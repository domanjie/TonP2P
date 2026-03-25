/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const { Address } = await import("@ton/ton")

  const normalize = (addr) => {
    if (!addr) return null
    try {
      return Address.parse(addr).toString({ bounceable: false })
    } catch {
      return null
    }
  }

  const normalizeTable = async (tableName, columnName) => {
    // Process in small batches to avoid loading huge tables
    const batchSize = 500
    let lastId = 0

    while (true) {
      // assumes numeric id PK for sell_intents and buy_orders
      // users table uses tg_id; handled separately.
      const rows = await knex(tableName)
        .where(columnName, "is not", null)
        .andWhere("id", ">", lastId)
        .select("id", columnName)
        .orderBy("id", "asc")
        .limit(batchSize)

      if (rows.length === 0) break

      for (const r of rows) {
        lastId = r.id
        const n = normalize(r[columnName])
        if (n && n !== r[columnName]) {
          await knex(tableName).where("id", r.id).update({ [columnName]: n })
        }
      }
    }
  }

  // users(tg_id PK)
  const users = await knex("users")
    .where("wallet_address", "is not", null)
    .select("tg_id", "wallet_address")

  for (const u of users) {
    const n = normalize(u.wallet_address)
    if (n && n !== u.wallet_address) {
      await knex("users").where("tg_id", u.tg_id).update({ wallet_address: n })
    }
  }

  await normalizeTable("sell_intents", "wallet_address")
  await normalizeTable("buy_orders", "wallet_address")
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Non-reversible normalization
}
