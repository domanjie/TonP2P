/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return (
    knex.schema
      .createTable("users", (table) => {
        table.bigInteger("tg_id").primary() // Telegram User ID
        table.string("wallet_address") // TON Wallet Address
        table.string("username") // Optional: for easier searching
        table.integer("total_orders").defaultTo(0) // Every time they click "Buy" or "Sell"
        table.integer("completed_orders").defaultTo(0) // Every time the TON is successfully released
        table.timestamps(true, true)
      })
      .alterTable("sell_intents", (table) => {
        table
          .foreign("user_id")
          .references("tg_id")
          .inTable("users")
          .onDelete("CASCADE")
      })
      // 3. Add Foreign Key to Buy Orders
      .alterTable("buy_orders", (table) => {
        table
          .foreign("user_id")
          .references("tg_id")
          .inTable("users")
          .onDelete("CASCADE")
      })
  )
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  //   return knex.schema.dropTableIfExists("users")
}
