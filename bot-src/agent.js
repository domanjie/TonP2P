import { GoogleGenAI } from "@google/genai"
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY })
const tools = [
  {
    functionDeclarations: [
      {
        name: "create_sell_intent",
        description:
          "Triggers when the user expresses intent to sell TON. Extracts the amount they want to sell and the minimum  price per ton they are willing to receive.",
        parameters: {
          type: "OBJECT",
          properties: {
            amount: { type: "NUMBER", description: "Amount of TON" },
            minPrice: { type: "NUMBER", description: "Min price in USD" },
          },
          required: ["amount", "minPrice"],
        },
      },
      {
        name: "create_buy_order",
        description:
          "Triggers when the user expresses intent to buy TON. Extracts the amount they want to buy and the maximum price they are willing to pay.",
        parameters: {
          type: "OBJECT",
          properties: {
            amount: {
              type: "NUMBER",
              description:
                "The total amount of TON the user wants to purchase.",
            },
            pricePerTon: {
              type: "NUMBER",
              description:
                "The  price in USD the user is willing to pay per TON.",
            },
          },
          required: ["amount", "pricePerTon"],
        },
      },
    ],
  },
]

const model = "gemini-2.5-flash"
// First Turn: Ask the question

export async function parseUserIntent(userText) {
  const lower = userText.toLowerCase()
  const hasNumber = /\d+(?:\.\d+)?/.test(userText)
  if ((lower.includes("sell") || lower.includes("buy")) && lower.includes("ton") && !hasNumber) {
    return { functionName: null, args: null }
  }

  const response = await genAI.models.generateContent({
    model: model,
    contents: userText,
    config: { tools: tools },
  })

  const functionCalls = response.functionCalls

  if (functionCalls && functionCalls.length > 0) {
    const call = functionCalls[0]
    const functionName = call.name
    const args = call.args
    return { functionName, args }
  }

  return { functionName: null, args: null }
}
