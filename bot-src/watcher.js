let lastSeenLt = await getLastSeenLt()
async function pollUntilCaughtUp() {
  let latestBatch = await client.getTransactions(FACTORY_ADDRESS, { limit: 20 })
  if (latestBatch.length === 0) return
  let currentBatch = latestBatch
  let processing = true
  let batchNewestLt = latestBatch[0].lt

  while (processing) {
    for (const tx of currentBatch) {
      // If we hit a transaction we've already seen, we are officially caught up.
      if (BigInt(tx.lt) <= BigInt(lastSeenLt)) {
        processing = false
        break
      }

      // 2. Process the transaction logic (Skip if failed)
      if (tx.description.computePhase?.exitCode === 0) {
        await processFactoryTransaction(tx)
      }
    }

    // If we finished the loop and 'processing' is still true, it means
    // there are MORE transactions further back in history we haven't seen.
    if (processing) {
      const oldestTx = currentBatch[currentBatch.length - 1]

      // Fetch the NEXT 20 transactions starting from the oldest one in the current batch
      currentBatch = await client.getTransactions(FACTORY_ADDRESS, {
        limit: 20,
        lt: oldestTx.lt,
        hash: oldestTx.hash,
      })

      // If the API returns no more, we've hit the beginning of time
      if (currentBatch.length === 0) processing = false
    }
  }

  // Persist the new bookmark to the DB
  if (BigInt(batchNewestLt) > BigInt(lastSeenLt)) {
    lastSeenLt = batchNewestLt
    await updateLastSeenLt(lastSeenLt)
    console.log(`✅ Synced up to LT: ${lastSeenLt}`)
  }
}

// Run this every 10 seconds
setInterval(pollUntilCaughtUp, 10000)

const processFactoryTransaction = async (tx) => {
  // 2. Look for the "TradeCreated" Event in the output messages
  // This is where Tact's 'emit' lands
  const outMsgs = tx.outMessages

  outMsgs.forEach(async (msg) => {
    // Here you would use a parser to check if the message matches your 'TradeCreated' structure
    // For the hackathon, you can simplify by checking the transaction's memo or logs

    const tradeAddress = parseTradeAddressFromMsg(msg)

    if (tradeAddress) {
      // 3. Link the on-chain trade to your Database
      const tradeRecord = await knex("sell_intents")
        .where("status", "MATCHED")
        .andWhere("temp_trade_address", tradeAddress) // We store this when the seller clicks "Deposit"
        .first()

      if (tradeRecord) {
        // 4. Update DB status
        await knex("sell_intents")
          .where("id", tradeRecord.id)
          .update({ status: "IN_ESCROW" })

        // 5. TRIGGER THE FUNCTION!
        await onTonDeposited(tradeRecord.id)
      }
    }
  })
}
const FACTORY_LT_KEY = "factory_last_processed_lt"

async function getLastSeenLt() {
  const row = await knex("sync_state").where("key", FACTORY_LT_KEY).first()

  return row ? row.value : "0" // Default to 0 if we've never synced
}

async function updateLastSeenLt(newLt) {
  await knex("sync_state")
    .insert({ key: FACTORY_LT_KEY, value: newLt })
    .onConflict("key")
    .merge({ value: newLt, updated_at: knex.fn.now() })
}
// This function runs when the Agent detects the TON is in Escrow
async function onTonDeposited(tradeId) {
  // 1. Get the trade details from our Knex DB
  const trade = await knex("sell_intents")
    .join("buy_orders", "sell_intents.matched_buyer_id", "=", "buy_orders.id")
    .select(
      "buy_orders.tg_id as buyer_tg_id",
      "sell_intents.payment_details", // This is the bank info!
      "sell_intents.amount_nanotons"
    )
    .where("sell_intents.id", tradeId)
    .first()

  const amountTon = Number(trade.amount_nanotons) / 1e9

  // 2. THE CRITICAL MESSAGE TO THE BUYER
  await bot.api.sendMessage(
    trade.buyer_tg_id,
    `🔒 **TON IS SECURED!**\n\n` +
      `The seller has deposited **${amountTon} TON** into the Escrow contract.\n\n` +
      `👉 **Step 2: Send Fiat Payment**\n` +
      `Please send the total amount to the following account:\n\n` +
      `--------------------------\n` +
      `${trade.payment_details}\n` + // <--- THIS IS THE ACCOUNT NUMBER
      `--------------------------\n\n` +
      `⚠️ **Note:** Once you have sent the money, click the button below.`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ I Have Paid", callback_data: `paid_${tradeId}` }],
        ],
      },
    }
  )
}
