/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return (
    knex.schema
      // --- SELL INTENTS TABLE ---
      .createTable("sell_intents", (table) => {
        table.increments("id").primary()
        table.bigInteger("user_id").notNullable() // Telegram User ID
        table.string("wallet_address").notNullable() // TON Wallet Address

        // Use BigInt for NanoTONs (1 TON = 1,000,000,000)
        table.bigInteger("amount_nanotons").notNullable()
        table.decimal("min_price_usd", 14, 2).notNullable()

        // The "Shield": Minimum reputation score required from a buyer
        table.integer("min_rep_threshold").defaultTo(0)

        // Status for Agent Logic
        // Statuses: OPEN, MATCHED, IN_ESCROW, COMPLETED, CANCELLED
        table
          .enum("status", [
            "OPEN",
            "MATCHED",
            "IN_ESCROW",
            "COMPLETED",
            "CANCELLED",
          ])
          .defaultTo("OPEN")

        // Payment Details: e.g., "Bank Name: XYZ, IBAN: 123..."
        // The Agent sends this to the buyer so the seller doesn't have to talk.
        table.text("payment_details").nullable()

        table.timestamps(true, true) // created_at, updated_at
      })

      // --- BUY ORDERS TABLE ---
      .createTable("buy_orders", (table) => {
        table.increments("id").primary()
        table.bigInteger("user_id").notNullable()
        table.string("wallet_address").notNullable()

        table.bigInteger("amount_nanotons").notNullable()
        table.decimal("max_price_usd", 14, 2).notNullable()

        // Statuses: OPEN, MATCHED, PAID, COMPLETED, CANCELLED
        table
          .enum("status", ["OPEN", "MATCHED", "PAID", "COMPLETED", "CANCELLED"])
          .defaultTo("OPEN")

        table.timestamps(true, true)
      })
  )
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
    .dropTableIfExists("buy_orders")
    .dropTableIfExists("sell_intents")
}
