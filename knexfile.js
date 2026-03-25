import dotenv from "dotenv"
import knex from "knex"
dotenv.config()
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const config = {
  development: {
    client: "mysql",
    connection: {
    host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE
    },
    migrations: {
      directory: "./migrations",
    },
  },
}
export const db = knex(config.development)
export default config
