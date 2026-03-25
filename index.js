import { bot } from "./bot-src/bot.js"

import { startWatcher } from "./bot-src/watcher.js"

startWatcher(bot)
bot.start()
