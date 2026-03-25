import { Bot } from "grammy" // High-perf bot framework
import { Address } from "@ton/ton"
import { parseUserIntent } from "./agent.js"
import { db } from "../knexfile.js"
import { generateEscrowPayload } from "./escrow.js"
const bot = new Bot(process.env.TG_BOT_KEY)

// bot.command("sell", async (ctx) => {ss
//   const amount = ctx.match // e.g. /sell 100
//   const userId = ctx.from.id

//   //   1. Logic: Save intent and look for a match
//   const match = findBuyer(amount)

//   if (false) {
//     // 2. Alert the "Agent" to start negotiation
//     ctx.reply(`Found a match! Trading ${amount} TON with @${match.username}.
//         Please deposit TON to the Escrow.`)

//     // Generate TON Connect Link for Escrow Deployment
//     const link = `https://ton-connect.org/...`
//     ctx.reply("Click to Deposit", {
//       reply_markup: new InlineKeyboard().url("Deposit TON", link),
//     })
//   } else {
//     openIntents.push({ userId, amount })
//     ctx.reply("Agent is hunting for a buyer at your price... I'll ping you.")
//   }
// })
// // Listener for "I have paid" from Buyer
// bot.callbackQuery("buyer_paid", async (ctx) => {
//   // 1. Agent verifies transaction hash (Optional/AI check)
//   // 2. Ping Seller IMMEDIATELY
//   bot.api.sendMessage(
//     SELLER_CHAT_ID,
//     "🚨 Buyer claims they paid $XXX. Check your bank!",
//     {
//       reply_markup: new InlineKeyboard()
//         .text("✅ Confirm & Release", "release_funds")
//         .text("⚠️ Dispute", "open_dispute"),
//     }
//   )
// })

bot.command("start", async (ctx) => {
  const tgId = ctx.from.id
  const username = ctx.from.username || "Trader"

  try {
    // 1. Check if the user already exists in the database
    const user = await db("users").where("tg_id", tgId).first()

    // 2. NEW USER FLOW (or returning user who never finished setting their wallet)
    if (!user || !user.wallet_address) {
      // Create a blank profile for them just to secure their tg_id
      await db("users")
        .insert({ tg_id: tgId, username: ctx.from.username })
        .onConflict("tg_id")
        .ignore() // If they exist but have no wallet, don't overwrite

      const welcomeMessage =
        `👋 **Welcome to the TON P2P Agent, ${username}!**\n\n` +
        `I am your decentralized escrow bot. I match you with buyers/sellers and lock the TON in a smart contract so no one gets scammed.\n\n` +
        `⚠️ **Action Required:**\n` +
        `Before we can match you, I need to know where to send your funds. Please reply with your TON address using the command below:\n\n` +
        `👉 \`/setwallet EQYourAddressHere...\``

      return await ctx.reply(welcomeMessage, { parse_mode: "Markdown" })
    }

    // 3. EXISTING USER FLOW (They have a wallet)
    // Calculate their completion rate for their dashboard
    const total = user.total_orders || 0
    const completed = user.completed_orders || 0
    const rate = total === 0 ? 100 : Math.round((completed / total) * 100)

    // Mask the wallet for security/clean UI
    const maskedWallet = `${user.wallet_address.slice(
      0,
      6
    )}...${user.wallet_address.slice(-4)}`

    const dashboardMessage =
      `🤖 **Welcome back to your P2P Dashboard!**\n\n` +
      `📊 **Your Stats:**\n` +
      `• Trades: ${completed}/${total}\n` +
      `• Completion Rate: ${rate}%\n` +
      `• Wallet: \`${maskedWallet}\`\n\n` +
      `What would you like to do today?`

    // Give them inline buttons to start the intent flow
    return await ctx.reply(dashboardMessage, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🛒 Buy TON", callback_data: "initiate_buy" },
            { text: "💰 Sell TON", callback_data: "initiate_sell" },
          ],
          [{ text: "⚙️ Update Wallet", callback_data: "help_update_wallet" }],
        ],
      },
    })
  } catch (error) {
    console.error("Start Command Error:", error)
    await ctx.reply(
      "❌ An error occurred while loading your profile. Please try again."
    )
  }
})

bot.command("setwallet", async (ctx) => {
  // Get the address string from the message
  const walletAddress = ctx.match?.trim()

  if (!walletAddress) {
    return await ctx.reply(
      "❌ **Missing Address**\n\nUsage: `/setwallet EQB...`",
      { parse_mode: "Markdown" }
    )
  }

  try {
    // This checks if the string is a valid TON format (Base64 or Hex)
    const parsed = Address.parse(walletAddress)

    // We store it in "User-Friendly, Non-Bounceable" format
    const friendlyAddress = parsed.toString({
      bounceable: false,
      testOnly: true, // Set to false for Mainnet!
    })

    //Save to Knex DB
    await db("users")
      .insert({
        tg_id: ctx.from.id,
        wallet_address: friendlyAddress,
        username: ctx.from.username,
      })
      .onConflict("tg_id")
      .merge()

    await ctx.reply(
      `✅ **Wallet Linked!**\n\nYour address is secured:\n\`${friendlyAddress}\``,
      { parse_mode: "Markdown" }
    )
  } catch (e) {
    // If Address.parse() fails, it throws an error
    await ctx.reply(
      "❌ **Invalid Address**\nThat doesn't look like a real TON address. Please copy it directly from Tonkeeper."
    )
  }
})

bot.on("message:text", async (ctx) => {
  const userText = ctx.message.text
  try {
    const { functionName, args } = await parseUserIntent(userText)
    switch (functionName) {
      case "create_sell_intent":
        await executeSellLogic(ctx, args)
        break
      case "create_buy_order":
        return await executeBuyLogic(ctx, args)
        break
      default:
        throw new Error("I don't know that function")
    }
  } catch (e) {
    console.log(e)
    ctx.reply(
      "I couldn't quite catch that. Try saying: 'Sell [amount] TON at $[price]'"
    )
  }
})
export { bot }

async function executeSellLogic(ctx, args) {
  console.log(args)
  const match = await findMatchForSeller({
    amount: args.amount * 1e9,
    minPrice: args.minPrice,
    minCompletionRate: 80,
  })
  const sellerWallet = await getWalletByTgId(ctx.from.id)

  if (match) {
    const buyerWallet = match.walletAddress
    const txData = await generateEscrowPayload(
      sellerWallet,
      buyerWallet,
      args.amount
    )

    // Set expiration for 15 minutes from now
    const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60
    const tonConnectLink = `https://app.tonkeeper.com/transfer/${txData.address}?amount=${txData.amount}&bin=${txData.payload}&exp=${expiresAt}`
    await ctx.reply(
      "Match confirmed! 🚀\n\nTo start the trade, you need to deposit the TON into the secure Escrow contract.",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "💎 Deposit to Escrow", url: tonConnectLink }],
          ],
        },
      }
    )
    // return await executeSellLogic(args.amount, args.price)

    await db("sell_intents").insert({
      amount_nanotons: args.amount * 1e9,
      min_price_usd: args.minPrice,
      status: "MATCHED",
      min_rep_threshold: 80,
      user_id: ctx.from.id,
      wallet_address: sellerWallet,
    })
  } else {
    await db("sell_intents").insert({
      amount_nanotons: args.amount * 1e9,
      min_price_usd: args.minPrice,
      status: "OPEN",
      min_rep_threshold: 80,
      user_id: ctx.from.id,
      wallet_address: sellerWallet,
    })
    ctx.reply(
      `I've set your intent to sell ${args.amount} TON at $${args.minPrice}. I'll ping you when a buyer is found.`
    )
  }
}

async function executeBuyLogic(ctx, args) {
  console.log("Buy Args:", args)
  // args from AI should be: { amount: number, pricePerTon: number }

  // 1. Get the buyer's wallet (you can reuse your existing wallet function)
  const buyerWallet = await getWalletByTgId(ctx.from.id)

  if (!buyerWallet) {
    return ctx.reply(
      "⚠️ I don't have your wallet address yet! Please use /setwallet first."
    )
  }

  // 2. Look for an existing OPEN sell intent that matches
  const match = await findMatchForBuyer({
    amount: args.amount * 1e9, // Store in NanoTONs
    pricePerTon: args.pricePerTon,
    minCompletionRate: 80,
  })

  if (match) {
    // --- MATCH FOUND ---
    const sellerTgId = match.user_id
    const sellerWallet = match.wallet_address

    // Generate Escrow Payload for the SELLER (The seller always deposits the TON)
    const txData = await generateEscrowPayload(
      sellerWallet,
      buyerWallet,
      args.amount
    )

    // Set expiration for 15 minutes
    const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60
    const tonConnectLink = `https://app.tonkeeper.com/transfer/${txData.address}?amount=${txData.amount}&bin=${txData.payload}&exp=${expiresAt}`

    // Update Seller's intent to MATCHED
    await db("sell_intents").where("id", match.id).update({ status: "MATCHED" })

    // Insert Buyer's order as MATCHED
    await db("buy_orders").insert({
      amount_nanotons: args.amount * 1e9,
      price_per_ton: args.pricePerTon,
      status: "MATCHED",
      user_id: ctx.from.id,
      wallet_address: buyerWallet,
    })

    // Notify the BUYER (The person running this command)
    await ctx.reply(
      `✅ **Match confirmed with a reputable seller!**\n\n` +
        `I have pinged the seller to lock ${args.amount} TON into the secure escrow contract.\n` +
        `⏳ Sit tight! I will notify you with the payment details as soon as the TON is secured.`,
      { parse_mode: "Markdown" }
    )

    // Notify the SELLER (The person who was waiting)
    // NOTE: You must use bot.telegram.sendMessage to send a message to a DIFFERENT user
    await bot.api.sendMessage(
      sellerTgId,
      `🎉 **Match Found!**\n\nA buyer wants your ${args.amount} TON at $${match.min_price_usd}.\n\n` +
        `To start the trade, you need to deposit the TON into the secure Escrow contract within 15 minutes.`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "💎 Deposit to Escrow", url: tonConnectLink }],
          ],
        },
      }
    )
  } else {
    // --- NO MATCH FOUND ---
    await db("buy_orders").insert({
      amount_nanotons: args.amount * 1e9,
      price_per_ton: args.pricePerTon,
      status: "OPEN",
      user_id: ctx.from.id,
      wallet_address: buyerWallet,
    })

    await ctx.reply(
      `📝 I've set your order to buy ${args.amount} TON at a max price of $${args.pricePerTon}. I'll ping you the moment a seller matches your price!`
    )
  }
}

async function findMatchForBuyer({ amount, pricePerTon, minCompletionRate }) {
  const bestMatch = await db("sell_intents")
    .join("users", "sell_intents.user_id", "=", "users.tg_id")
    .where("sell_intents.status", "OPEN")
    .andWhere("sell_intents.amount_nanotons", amount)
    .andWhere("sell_intents.min_price_usd", ">=", pricePerTon)

    // THE PERCENTAGE LOGIC
    // If total_orders is 0, we treat them as 100% to let them start trading.
    // Otherwise, (completed / total) * 100 >= minCompletionRate
    .andWhereRaw(
      `
            CASE 
                WHEN users.total_orders = 0 THEN 100 
                ELSE (users.completed_orders * 100.0 / users.total_orders) 
            END >= ?
        `,
      [minCompletionRate]
    )

    // Select the calculated rate so the bot can display it: "Found a buyer! (95% completion)"
    .select(
      "sell_intents.*",
      "users.total_orders",
      db.raw(`

                CASE 
                    WHEN users.total_orders = 0 THEN 100 
                    ELSE ROUND((users.completed_orders * 100.0 / users.total_orders), 1) 
                END as completion_rate
            `)
    )
    // Sort by best price, then by highest completion rate, then by most experience
    .orderBy([
      { column: "sell_intents.min_price_usd", order: "desc" },
      { column: "completion_rate", order: "desc" },
      { column: "users.total_orders", order: "desc" }, // Tie-breaker: 1000 trades beats 1 trade
    ])
    .first()

  return bestMatch || null
}
async function findMatchForSeller({ amount, minPrice, minCompletionRate }) {
  const bestMatch = await db("buy_orders")
    .join("users", "buy_orders.user_id", "=", "users.tg_id")
    .where("buy_orders.status", "OPEN")
    .andWhere("buy_orders.amount_nanotons", amount)
    .andWhere("buy_orders.price_per_ton", ">=", minPrice)

    // THE PERCENTAGE LOGIC
    // If total_orders is 0, we treat them as 100% to let them start trading.
    // Otherwise, (completed / total) * 100 >= minCompletionRate
    .andWhereRaw(
      `
            CASE 
                WHEN users.total_orders = 0 THEN 100 
                ELSE (users.completed_orders * 100.0 / users.total_orders) 
            END >= ?
        `,
      [minCompletionRate]
    )

    // Select the calculated rate so the bot can display it: "Found a buyer! (95% completion)"
    .select(
      "buy_orders.*",
      "users.total_orders",
      db.raw(`

                CASE 
                    WHEN users.total_orders = 0 THEN 100 
                    ELSE ROUND((users.completed_orders * 100.0 / users.total_orders), 1) 
                END as completion_rate
            `)
    )
    // Sort by best price, then by highest completion rate, then by most experience
    .orderBy([
      { column: "buy_orders.price_per_ton", order: "desc" },
      { column: "completion_rate", order: "desc" },
      { column: "users.total_orders", order: "desc" }, // Tie-breaker: 1000 trades beats 1 trade
    ])
    .first()

  return bestMatch || null
}

async function getWalletByTgId(sellerTgId) {
  const user = await db("users")
    .where("tg_id", sellerTgId)
    .select("wallet_address")
    .first()

  return user ? user.wallet_address : null
}
