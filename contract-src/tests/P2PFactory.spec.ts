import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox"
import { toNano } from "@ton/core"
import { P2PFactory } from "../build/P2PFactory/P2PFactory_P2PFactory"
import "@ton/test-utils"

describe("P2PFactory", () => {
  let blockchain: Blockchain
  let deployer: SandboxContract<TreasuryContract>
  let p2PFactory: SandboxContract<P2PFactory>

  beforeEach(async () => {
    blockchain = await Blockchain.create()

    p2PFactory = blockchain.openContract(await P2PFactory.fromInit())

    deployer = await blockchain.treasury("deployer")

    const deployResult = await p2PFactory.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      }
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: p2PFactory.address,
      deploy: true,
      success: true,
    })
  })

  it("should deploy", async () => {
    // the check is done inside beforeEach
    // blockchain and p2PFactory are ready to use
  })
})
