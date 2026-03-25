# Tact compilation report
Contract: P2PTrade
BoC Size: 720 bytes

## Structures (Structs and Messages)
Total structures: 21

### DataSize
TL-B: `_ cells:int257 bits:int257 refs:int257 = DataSize`
Signature: `DataSize{cells:int257,bits:int257,refs:int257}`

### SignedBundle
TL-B: `_ signature:fixed_bytes64 signedData:remainder<slice> = SignedBundle`
Signature: `SignedBundle{signature:fixed_bytes64,signedData:remainder<slice>}`

### StateInit
TL-B: `_ code:^cell data:^cell = StateInit`
Signature: `StateInit{code:^cell,data:^cell}`

### Context
TL-B: `_ bounceable:bool sender:address value:int257 raw:^slice = Context`
Signature: `Context{bounceable:bool,sender:address,value:int257,raw:^slice}`

### SendParameters
TL-B: `_ mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell value:int257 to:address bounce:bool = SendParameters`
Signature: `SendParameters{mode:int257,body:Maybe ^cell,code:Maybe ^cell,data:Maybe ^cell,value:int257,to:address,bounce:bool}`

### MessageParameters
TL-B: `_ mode:int257 body:Maybe ^cell value:int257 to:address bounce:bool = MessageParameters`
Signature: `MessageParameters{mode:int257,body:Maybe ^cell,value:int257,to:address,bounce:bool}`

### DeployParameters
TL-B: `_ mode:int257 body:Maybe ^cell value:int257 bounce:bool init:StateInit{code:^cell,data:^cell} = DeployParameters`
Signature: `DeployParameters{mode:int257,body:Maybe ^cell,value:int257,bounce:bool,init:StateInit{code:^cell,data:^cell}}`

### StdAddress
TL-B: `_ workchain:int8 address:uint256 = StdAddress`
Signature: `StdAddress{workchain:int8,address:uint256}`

### VarAddress
TL-B: `_ workchain:int32 address:^slice = VarAddress`
Signature: `VarAddress{workchain:int32,address:^slice}`

### BasechainAddress
TL-B: `_ hash:Maybe int257 = BasechainAddress`
Signature: `BasechainAddress{hash:Maybe int257}`

### Deploy
TL-B: `deploy#946a98b6 queryId:uint64 = Deploy`
Signature: `Deploy{queryId:uint64}`

### DeployOk
TL-B: `deploy_ok#aff90f57 queryId:uint64 = DeployOk`
Signature: `DeployOk{queryId:uint64}`

### FactoryDeploy
TL-B: `factory_deploy#6d0ff13b queryId:uint64 cashback:address = FactoryDeploy`
Signature: `FactoryDeploy{queryId:uint64,cashback:address}`

### SetPaid
TL-B: `set_paid#00000111  = SetPaid`
Signature: `SetPaid{}`

### ConfirmRelease
TL-B: `confirm_release#00000222  = ConfirmRelease`
Signature: `ConfirmRelease{}`

### Dispute
TL-B: `dispute#00000333 reason:^string = Dispute`
Signature: `Dispute{reason:^string}`

### Arbitrate
TL-B: `arbitrate#00000444 winner_is_buyer:bool = Arbitrate`
Signature: `Arbitrate{winner_is_buyer:bool}`

### P2PTrade$Data
TL-B: `_ id:uint32 seller:address buyer:address arbitrator:address amount:coins isPaid:bool isDisputed:bool = P2PTrade`
Signature: `P2PTrade{id:uint32,seller:address,buyer:address,arbitrator:address,amount:coins,isPaid:bool,isDisputed:bool}`

### CreateTrade
TL-B: `create_trade#6a13b5d1 queryId:uint64 seller:address buyer:address amount:coins = CreateTrade`
Signature: `CreateTrade{queryId:uint64,seller:address,buyer:address,amount:coins}`

### P2PFactory$Data
TL-B: `_ admin:address tradeCount:uint32 = P2PFactory`
Signature: `P2PFactory{admin:address,tradeCount:uint32}`

### TradeCreated
TL-B: `_ tradeAddress:address seller:address buyer:address = TradeCreated`
Signature: `TradeCreated{tradeAddress:address,seller:address,buyer:address}`

## Get methods
Total get methods: 1

## tradeData
No arguments

## Exit codes
* 2: Stack underflow
* 3: Stack overflow
* 4: Integer overflow
* 5: Integer out of expected range
* 6: Invalid opcode
* 7: Type check error
* 8: Cell overflow
* 9: Cell underflow
* 10: Dictionary error
* 11: 'Unknown' error
* 12: Fatal error
* 13: Out of gas error
* 14: Virtualization error
* 32: Action list is invalid
* 33: Action list is too long
* 34: Action is invalid or not supported
* 35: Invalid source address in outbound message
* 36: Invalid destination address in outbound message
* 37: Not enough Toncoin
* 38: Not enough extra currencies
* 39: Outbound message does not fit into a cell after rewriting
* 40: Cannot process a message
* 41: Library reference is null
* 42: Library change action error
* 43: Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree
* 50: Account state size exceeded limits
* 128: Null reference exception
* 129: Invalid serialization prefix
* 130: Invalid incoming message
* 131: Constraints error
* 132: Access denied
* 133: Contract stopped
* 134: Invalid argument
* 135: Code of a contract was not found
* 136: Invalid standard address
* 138: Not a basechain address
* 6908: Only seller can release
* 21958: Only buyer can mark as paid
* 28872: Only arbitrator can resolve
* 35407: Insufficient TON
* 48816: Buyer hasn't paid yet
* 49729: Unauthorized

## Trait inheritance diagram

```mermaid
graph TD
P2PTrade
P2PTrade --> BaseTrait
P2PTrade --> Deployable
Deployable --> BaseTrait
```

## Contract dependency diagram

```mermaid
graph TD
P2PTrade
```