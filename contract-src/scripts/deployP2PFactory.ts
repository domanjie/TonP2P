import { toNano } from "@ton/core"
import { P2PFactory } from "../build/P2PFactory/P2PFactory_P2PFactory"
import { NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const p2PFactory = provider.open(await P2PFactory.fromInit())

  await p2PFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n, // Use any bigint, usually 0n for initial deploy
    }
  )

  await provider.waitForDeploy(p2PFactory.address)

  // run methods on `p2PFactory`
}
