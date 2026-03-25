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
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port:process.env.DB_PORT|| 3306
    },
    migrations: {
      directory: "./migrations",
    },
  },
}
export const db = knex(config.development)
export default config
