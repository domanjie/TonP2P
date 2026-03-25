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
      host: process.env.DB_HOST ,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./migrations",
    },
  },
}
export const db = knex(config.development)
export default config
