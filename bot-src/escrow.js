import { Address, toNano, beginCell } from "@ton/ton"
const FACTORY_ADDRESS = Address.parse(process.env.FACTORY_ADDRESS)
export async function generateEscrowPayload(sellerAddr, buyerAddr, amountTon) {
  // 1. Prepare the "Message Body" based on our Tact Factory contract
  // We use a specific 'Op-Code' (e.g., 0x1234) that the Factory expects

  let deployCost = 0.05
  let gasReserve = 0.03
  let misc = 0.02
  const body = beginCell()
    .storeUint(0x6a13b5d1, 32) // Op-code for "CreateTrade"
    .storeUint(0, 64)
    .storeAddress(Address.parse(sellerAddr))
    .storeAddress(Address.parse(buyerAddr))
    .storeCoins(toNano(amountTon)) // The amount to be locked in Escrow
    .endCell()

  // 2. Return the data needed for a TON Connect link
  return {
    address: FACTORY_ADDRESS.toString(),
    amount: toNano(amountTon + deployCost + gasReserve + misc).toString(), // Amount + gas fee
    payload: body.toBoc().toString("base64"), // The "Instructions" for the contract
  }
}
