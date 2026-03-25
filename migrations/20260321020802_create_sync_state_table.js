/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("sync_state", (table) => {
    // We use a 'key' column so you can store other sync data later (e.g. price_update_lt)
    table.string("key").primary()

    // We store LT as a string because TON LTs are 64-bit integers
    // which can exceed the safe range of standard JavaScript numbers.
    table.string("value").notNullable()

    table.timestamps(true, true)
  })
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists("sync_state")
}
