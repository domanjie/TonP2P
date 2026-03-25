# TonP2P

TonP2P is an agentic Telegram bot for running P2P TON trades using an escrow smart contract. It matches buyers and sellers, generates transaction links, and watches the blockchain to update trade state.

Why this exists: most P2P trades end up stuck in DMs. People negotiate forever, reply late, or intentionally delay. That creates bad fills, wasted time, and a lot of failed trades. This project moves the trade flow into a structured, on-chain escrow process with clear state transitions so deals do not depend on long back-and-forth chat.

Stack:
- Node.js
- Grammy (Telegram bot)
- Knex + MySQL
- @ton/ton for chain access
- Tact contracts (factory + trade/escrow)

## What it does
- Stores a user wallet address
- Lets users create buy and sell intents
- Matches intents and generates a deposit transaction link to create an escrow trade
- Watches the factory and escrow contracts
- Updates database statuses when deposit, paid, and release transactions happen

## Requirements
- Node.js 18+
- MySQL
- A Telegram bot token from BotFather
- A TON JSON-RPC endpoint (Toncenter or your own)
- Factory contract address (deployed)

## Setup

### 1) Install dependencies

npm install

### 2) Create a MySQL database
Create a database and a user with access.

### 3) Configure environment variables
Create a .env file in the project root.

Required variables:

BOT_TOKEN=123456:telegram-token

DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=tonp2p

TON_ENDPOINT=https://toncenter.com/api/v2/jsonRPC
TON_API_KEY=your_toncenter_api_key

FACTORY_ADDRESS=EQ....

Notes:
- TON_ENDPOINT can be mainnet or testnet. Make sure FACTORY_ADDRESS is on the same network.
- TON_API_KEY is optional for some endpoints, but Toncenter typically requires it.

### 4) Run migrations

npx knex migrate:latest

### 5) Start the bot

node index.js

The watcher is started from index.js and runs on intervals.

## Deployment

This is a Telegram bot plus a chain watcher. The simplest deployment is to run it as a single long-running Node process with environment variables configured.

Fast options that work well for hackathon submissions:

### Option A: Railway (fastest)
- Create a new project from this repo
- Add the environment variables from the Setup section
- Set the start command to:
  - `node index.js`
- Make sure the service is configured as a worker/background process (not a web server)

### Option B: Render
- Create a new Background Worker
- Connect the repo
- Build command:
  - `npm install`
- Start command:
  - `node index.js`
- Add the environment variables

### Option C: VPS
- Copy the repo to a Linux VM
- Install Node.js
- Create `.env`
- Run migrations
- Start the bot with a process manager:
  - `node index.js`

Your database can be:
- A managed MySQL instance (Railway/PlanetScale/etc)
- Or a MySQL server you run on the same VPS

## Usage in Telegram
- /start
- /setwallet <your address>
- Send messages like:
  - Sell 10 TON at $5
  - Buy 10 TON at $5

When a match is found:
- The seller receives a deposit link to create the escrow trade
- After deposit is detected, the buyer can mark paid on-chain
- After paid is detected, the seller can release TON

## Troubleshooting
- If matching fails, confirm wallet addresses in the DB are in a consistent friendly format.
- If the watcher is not seeing transactions, confirm:
  - TON_ENDPOINT and TON_API_KEY are correct
  - FACTORY_ADDRESS is correct for the selected network
- If migrations fail, confirm your MySQL credentials in .env and that the database exists.
