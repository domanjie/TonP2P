async function cleanExpiredTrades() {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)

  // Find matches that never turned into 'IN_ESCROW'
  const expiredMatches = await knex("sell_intents")
    .where("status", "MATCHED")
    .andWhere("updated_at", "<", fifteenMinutesAgo)
    .select("id", "tg_id")

  for (const trade of expiredMatches) {
    // 1. Set the seller back to 'OPEN' so they can be matched again
    await knex("sell_intents").where("id", trade.id).update({
      status: "OPEN",
      matched_buyer_id: null,
    })

    // 2. Notify the seller
    await bot.api.sendMessage(
      trade.tg_id,
      "⚠️ Your trade match expired because the deposit wasn't made in time. Your intent is now back in the 'OPEN' pool."
    )
  }
}

// Run the Janitor every 60 seconds
setInterval(cleanExpiredTrades, 60000)
