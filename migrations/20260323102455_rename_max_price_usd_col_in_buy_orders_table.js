/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.table("buy_orders", (table) => {
    table.renameColumn("max_price_usd", "price_per_ton")
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.table("buy_orders", (table) => {
    table.renameColumn("price_per_ton", "max_price_usd")
  })
}
