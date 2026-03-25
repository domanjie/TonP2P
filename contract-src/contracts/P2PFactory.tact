import "@stdlib/deploy";
import "./P2PTrade.tact"; // This imports the trade logic we wrote earlier

// Message the Bot sends to the Factory to start a trade
message (0x6a13b5d1) CreateTrade {
    queryId: Int as uint64;
    seller: Address;
    buyer: Address;
    amount: Int as coins;
}

contract P2PFactory with Deployable {
    // You are the admin (the one who deployed it)
    admin: Address;
    tradeCount: Int as uint32 = 0;

    init() {
        self.admin = sender();
    }

    receive() {
        // Leave empty or add logic
    }
    // This function creates the new trade contract
    receive(msg: CreateTrade) {
        self.tradeCount = self.tradeCount + 1;
        
        // 1. Initialize the new Trade contract state
        // We use the tradeCount to make sure every contract address is unique
        let init: StateInit = initOf P2PTrade(
            self.tradeCount,
            msg.seller, 
            msg.buyer, 
            self.admin, 
            msg.amount
        );
        
        // 2. Calculate the address where this trade will live
        let tradeAddress: Address = contractAddress(init);

// 1. Math: Take 10% of the fee to send to the new contract for storage
        // The remaining 90% stays in the Factory balance automatically
       
   

        let deployCost:Int  =ton("0.05");
        let gasReserve:Int  =ton("0.03");
        let misc:Int=ton ("0.02");
        let required:Int=msg.amount+ deployCost+gasReserve+misc;
        let amountToEscrow:Int =msg.amount + deployCost;
        require(context().value >= required, "Insufficient TON");
        deploy(DeployParameters{
            init: init,
            value: amountToEscrow, 
        });

        // 4. Log it so the Agent can see it happened

        emit(TradeCreated{
            tradeAddress: tradeAddress, 
            seller: msg.seller, 
            buyer: msg.buyer
        }.toCell());


    }

    // Helper to check how many trades have been made
    get fun totalTrades(): Int {
        return self.tradeCount;
    }
}

// Simple event for the Agent to "Watch"
struct TradeCreated {
    tradeAddress: Address;
    seller: Address;
    buyer: Address;
}