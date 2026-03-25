import { Address, TonClient } from "@ton/ton"
import { db } from "../knexfile.js"

const FACTORY_ADDRESS = Address.parse(process.env.FACTORY_ADDRESS)
const tonClient = new TonClient({
  endpoint: process.env.TON_ENDPOINT,
  apiKey: process.env.TON_API_KEY,
})

const FACTORY_LT_KEY = "factory_last_processed_lt"

export function startWatcher(bot) {
  setInterval(() => pollFactory(bot).catch((e) => console.error("pollFactory", e)), 10_000)
  setInterval(() => pollActiveEscrows(bot).catch((e) => console.error("pollEscrows", e)), 12_000)
}

function normalizeTxHash(hashLike) {
  try {
    const h = typeof hashLike === "function" ? hashLike() : hashLike
    if (!h) return null
    if (Buffer.isBuffer(h)) return h
    if (h instanceof Uint8Array) return Buffer.from(h)
    if (typeof h === "string") {
      // TonClient HttpApi expects hash as Buffer (raw bytes). We accept hex or base64 strings.
      const hex = h.startsWith("0x") ? h.slice(2) : h
      if (/^[0-9a-fA-F]+$/.test(hex) && hex.length % 2 === 0) {
        return Buffer.from(hex, "hex")
      }
      return Buffer.from(h, "base64")
    }
    return null
  } catch {
    return null
  }
}

async function notifySellerPaid(bot, sellIntentId) {
  const sell = await db("sell_intents").where("id", sellIntentId).first()
  if (!sell || sell.status !== "ESCROW_LOCKED") return

  await bot.api.sendMessage(
    sell.user_id,
    "✅ Buyer marked as paid on-chain. If you received fiat, you can release the TON.",
    {
      reply_markup: {
        inline_keyboard: [[{ text: "✅ Release TON", callback_data: `release_${sellIntentId}` }]],
      },
    }
  )
}

async function pollFactory(bot) {
  let lastSeenLt = await getSyncValue(FACTORY_LT_KEY, "0")

  const latestBatch = await tonClient.getTransactions(FACTORY_ADDRESS, { limit: 20 })
  if (latestBatch.length === 0) return

  let currentBatch = latestBatch
  let processing = true
  const batchNewestLt = latestBatch[0].lt

  while (processing) {
    for (const tx of currentBatch) {
      if (BigInt(tx.lt) <= BigInt(lastSeenLt)) {
        processing = false
        break
      }
      if (tx.description?.computePhase?.exitCode === 0) {
        await processFactoryTransaction(bot, tx)
      }
    }
    if (processing) {
      const oldestTx = currentBatch[currentBatch.length - 1]
      const hash = normalizeTxHash(oldestTx?.hash)
      if (!hash) {
        console.warn("pollFactory: missing/invalid tx hash for pagination; stopping early")
        processing = false
        break
      }
      currentBatch = await tonClient.getTransactions(FACTORY_ADDRESS, {
        limit: 20,
        lt: String(oldestTx.lt),
        hash,
      })
      if (currentBatch.length === 0) processing = false
    }
  }

  if (BigInt(batchNewestLt) > BigInt(lastSeenLt)) {
    await setSyncValue(FACTORY_LT_KEY, String(batchNewestLt))
  }
}

async function processFactoryTransaction(bot, tx) {
  // We match by parsing the CreateTrade in-message (seller deposit) and the emitted TradeCreated in out-messages.
  const inMsg = tx.inMessage
  const createTrade = tryParseCreateTrade(inMsg)
  if (!createTrade) return

  const tradeCreated = tryParseTradeCreated(tx.outMessages)
  if (!tradeCreated) return

  console.log(createTrade)
  const seller = normalizeTonAddress(createTrade.seller)
  const buyer = normalizeTonAddress(createTrade.buyer)
  const amount = createTrade.amount

  const sellIntent = await db("sell_intents")
    .where("status", "MATCHED")
    .andWhere("wallet_address", seller)
    .andWhere("amount_nanotons", String(amount))
    .first()

  if (!sellIntent) return

  const buyerOrder = await db("buy_orders")
    .whereIn("status", ["MATCHED", "OPEN"])
    .andWhere("wallet_address", buyer)
    .andWhere("amount_nanotons", String(amount))
    .orderBy("updated_at", "desc")
    .first()

  await db("sell_intents").where("id", sellIntent.id).update({
    status: "ESCROW_LOCKED",
    escrow_address: normalizeTonAddress(tradeCreated.tradeAddress),
  })

  if (buyerOrder) {
    const amountTon = Number(amount) / 1e9
    await bot.api.sendMessage(
      buyerOrder.user_id,
      `🔒 TON is secured!\n\nThe seller deposited ${amountTon.toFixed(
        2
      )} TON into escrow. You can now pay the seller.`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: "✅ I Have Paid", callback_data: `paid_${sellIntent.id}` }]],
        },
      }
    )
  }
}

async function pollActiveEscrows(bot) {
  const active = await db("sell_intents")
    .where("status", "ESCROW_LOCKED")
    .whereNotNull("escrow_address")
    .select("id", "escrow_address", "wallet_address", "amount_nanotons")

  for (const s of active) {
    await pollSingleEscrow(bot, s).catch((e) =>
      console.error("pollSingleEscrow", s.id, e)
    )
  }
}

async function pollSingleEscrow(bot, sellIntent) {
  const escrow = Address.parse(sellIntent.escrow_address)
  const key = `escrow_last_processed_lt_${sellIntent.id}`
  let lastSeenLt = await getSyncValue(key, "0")

  const latestBatch = await tonClient.getTransactions(escrow, { limit: 10 })
  if (latestBatch.length === 0) return
  const batchNewestLt = latestBatch[0].lt

  for (const tx of latestBatch) {
    if (BigInt(tx.lt) <= BigInt(lastSeenLt)) break
    if (tx.description?.computePhase?.exitCode !== 0) continue

    const inMsg = tx.inMessage
    const op = tryReadOp(inMsg)
    if (op === 0x111) {
      await notifySellerPaid(bot, sellIntent.id)
      continue
    }
    if (op === 0x222) {
      await markTradeCompleted(bot, sellIntent.id)
      break
    }
  }

  if (BigInt(batchNewestLt) > BigInt(lastSeenLt)) {
    await setSyncValue(key, String(batchNewestLt))
  }
}

async function markTradeCompleted(bot, sellIntentId) {
  const sell = await db("sell_intents").where("id", sellIntentId).first()
  if (!sell || sell.status === "COMPLETED") return

  const buyerOrder = await db("buy_orders")
    .where("status", "MATCHED")
    .andWhere("amount_nanotons", sell.amount_nanotons)
    .orderBy("updated_at", "desc")
    .first()

  await db.transaction(async (trx) => {
    await trx("sell_intents").where("id", sellIntentId).update({ status: "COMPLETED" })
    if (buyerOrder) {
      await trx("buy_orders").where("id", buyerOrder.id).update({ status: "COMPLETED" })
    }
    await trx("users").where("tg_id", sell.user_id).increment("completed_orders", 1)
    if (buyerOrder) {
      await trx("users").where("tg_id", buyerOrder.user_id).increment("completed_orders", 1)
    }
  })

  if (buyerOrder) {
    await bot.api.sendMessage(buyerOrder.user_id, "✅ Trade completed. TON released to your wallet.")
  }
  await bot.api.sendMessage(sell.user_id, "✅ Trade completed. You released TON from escrow.")
}

function tryParseCreateTrade(msg) {
  const op = tryReadOp(msg)
  if (op !== 0x6a13b5d1) return null

  const s = msg.body?.beginParse?.() ?? null
  if (!s) return null
  try {
    s.loadUint(32) // op
    s.loadUintBig(64) // queryId
    const seller = s.loadAddress()
    const buyer = s.loadAddress()
    const amount = s.loadCoins()
    return { seller, buyer, amount }
  } catch {
    return null
  }
}

function tryParseTradeCreated(outMessages) {
  if (!outMessages) return null

  for (const msg of iterOutMessages(outMessages)) {
    // In some TonClient versions this is { info, init, body }, in others it may be a message object.
    const body = msg?.body ?? msg
    const parsed = tryParseTradeCreatedFromBody(body)
    if (parsed) return parsed
  }

  return null
}

function iterOutMessages(outMessages) {
  if (Array.isArray(outMessages)) return outMessages
  if (outMessages?._map instanceof Map) return outMessages._map.values()
  if (typeof outMessages?.[Symbol.iterator] === "function") return outMessages
  return []
}

function tryParseTradeCreatedFromBody(body) {
  if (!body) return null

  // 1) Try parse directly
  const direct = tryParseTradeCreatedFromCell(body)
  if (direct) return direct

  // 2) Try parse from first ref (Tact emits are often wrapped)
  try {
    const s = body.beginParse?.()
    if (!s) return null
    if (s.remainingRefs > 0) {
      const ref = s.loadRef()
      return tryParseTradeCreatedFromCell(ref)
    }
  } catch {
    return null
  }

  return null
}

function tryParseTradeCreatedFromCell(cell) {
  try {
    const s = cell?.beginParse?.()
    if (!s) return null

    // TradeCreated struct in your Tact contract: tradeAddress, seller, buyer (no opcode/header)
    const tradeAddress = s.loadAddress()
    const seller = s.loadAddress()
    const buyer = s.loadAddress()
    if (tradeAddress && seller && buyer) return { tradeAddress, seller, buyer }
    return null
  } catch {
    return null
  }
}

function tryReadOp(msg) {
  const s = msg?.body?.beginParse?.() ?? null
  if (!s) return null
  try {
    return s.loadUint(32)
  } catch {
    return null
  }
}

function normalizeTonAddress(addressLike) {
  // Normalize to bounceable friendly (EQ...) for DB matching
  if (!addressLike) return null

  if (typeof addressLike === "string") {
    try {
      return Address.parse(addressLike).toString({ bounceable: true })
    } catch {
      const m = addressLike.match(/^(-?\d+):([0-9a-fA-F]{64})$/)
      if (!m) return null
      const wc = Number(m[1])
      const hash = Buffer.from(m[2], "hex")
      return new Address(wc, hash).toString({ bounceable: true })
    }
  }

  return addressLike.toString({ bounceable: true })
}

async function getSyncValue(key, defaultValue) {
  const row = await db("sync_state").where("key", key).first()
  return row ? row.value : defaultValue
}

async function setSyncValue(key, value) {
  await db("sync_state")
    .insert({ key, value })
    .onConflict("key")
    .merge({ value, updated_at: db.fn.now() })
}
