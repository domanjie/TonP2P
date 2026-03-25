import "@stdlib/deploy";

message(0x111) SetPaid { }
message(0x222) ConfirmRelease { }
message(0x333) Dispute { reason: String }
message(0x444) Arbitrate { winner_is_buyer: Bool }

contract P2PTrade with Deployable {
    id: Int as uint32;
    seller: Address;
    buyer: Address;
    arbitrator: Address;
    amount: Int as coins;
    isPaid: Bool = false;
    isDisputed: Bool = false;

    // Ensure this order is IDENTICAL to the Factory
    init(id: Int, seller: Address, buyer: Address, arbitrator: Address, amount: Int) {
        self.id = id;
        self.seller = seller;
        self.buyer = buyer;
        self.arbitrator = arbitrator;
        self.amount = amount;
    }

    receive(msg: SetPaid) {
        require(sender() == self.buyer, "Only buyer can mark as paid");
        self.isPaid = true;
    }

    receive(msg: ConfirmRelease) {
        require(sender() == self.seller, "Only seller can release");
        require(self.isPaid, "Buyer hasn't paid yet");
        
        send(SendParameters{
            to: self.buyer,
            value: 0, 
            mode: SendRemainingBalance + SendDestroyIfZero
        });
    }

    receive(msg: Dispute) {
        require(sender() == self.seller || sender() == self.buyer, "Unauthorized");
        self.isDisputed = true;
    }

    receive(msg: Arbitrate) {
        require(sender() == self.arbitrator, "Only arbitrator can resolve");
        let winner: Address = msg.winner_is_buyer ? self.buyer : self.seller;
        

        
        send(SendParameters{
            to: winner,
            value: 0,
            mode: SendRemainingBalance + SendDestroyIfZero
        });
    }
    receive() {
        // Leave empty or add logic
    }

    get fun tradeData(): Address {
        return self.seller;
    }
}