/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // 1) buy_orders: align column name to spec: max_price_usd
  const hasPricePerTon = await knex.schema.hasColumn("buy_orders", "price_per_ton")
  const hasMaxPriceUsd = await knex.schema.hasColumn("buy_orders", "max_price_usd")

  if (hasPricePerTon && !hasMaxPriceUsd) {
    await knex.schema.table("buy_orders", (table) => {
      table.renameColumn("price_per_ton", "max_price_usd")
    })
  }

  // 2) Update enums/status sets (best effort; MySQL stores enum type on column)
  // We perform raw ALTER where supported.
  const client = knex.client.config.client

  if (client === "mysql" || client === "mysql2") {
    await knex.raw(
      "ALTER TABLE sell_intents MODIFY COLUMN status ENUM('OPEN','MATCHED','ESCROW_LOCKED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'OPEN'"
    )
    await knex.raw(
      "ALTER TABLE buy_orders MODIFY COLUMN status ENUM('OPEN','MATCHED','COMPLETED') NOT NULL DEFAULT 'OPEN'"
    )
  }

  // 3) Add escrow_address for watcher (needed to watch release on individual escrows)
  const hasEscrowAddress = await knex.schema.hasColumn(
    "sell_intents",
    "escrow_address"
  )
  if (!hasEscrowAddress) {
    await knex.schema.table("sell_intents", (table) => {
      table.string("escrow_address").nullable()
    })
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Non-destructive down (skip)
}
