/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const { Address } = await import("@ton/ton")

  const normalize = (addr) => {
    if (!addr) return null

    try {
      return Address.parse(addr).toString({ bounceable: true })
    } catch {
      // Support raw format like: 0:14790c15... (workchain: 64 hex)
      try {
        const m = String(addr).match(/^(-?\d+):([0-9a-fA-F]{64})$/)
        if (!m) return null
        const wc = Number(m[1])
        const hash = Buffer.from(m[2], "hex")
        return new Address(wc, hash).toString({ bounceable: true })
      } catch {
        return null
      }
    }
  }

  const normalizeTable = async (tableName, idColumn, columnName) => {
    const batchSize = 500
    let lastId = null

    while (true) {
      let q = knex(tableName)
        .where(columnName, "is not", null)
        .select(idColumn, columnName)
        .orderBy(idColumn, "asc")
        .limit(batchSize)

      if (lastId !== null) {
        q = q.andWhere(idColumn, ">", lastId)
      }

      const rows = await q
      if (rows.length === 0) break

      for (const r of rows) {
        lastId = r[idColumn]
        const current = r[columnName]
        const n = normalize(current)
        if (n && n !== current) {
          await knex(tableName).where(idColumn, r[idColumn]).update({ [columnName]: n })
        }
      }
    }
  }

  await normalizeTable("users", "tg_id", "wallet_address")
  await normalizeTable("sell_intents", "id", "wallet_address")
  await normalizeTable("buy_orders", "id", "wallet_address")
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Non-reversible normalization
}
