import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadGetterTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function storeTupleFactoryDeploy(source: FactoryDeploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

export function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type SetPaid = {
    $$type: 'SetPaid';
}

export function storeSetPaid(src: SetPaid) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(273, 32);
    };
}

export function loadSetPaid(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 273) { throw Error('Invalid prefix'); }
    return { $$type: 'SetPaid' as const };
}

export function loadTupleSetPaid(source: TupleReader) {
    return { $$type: 'SetPaid' as const };
}

export function loadGetterTupleSetPaid(source: TupleReader) {
    return { $$type: 'SetPaid' as const };
}

export function storeTupleSetPaid(source: SetPaid) {
    const builder = new TupleBuilder();
    return builder.build();
}

export function dictValueParserSetPaid(): DictionaryValue<SetPaid> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetPaid(src)).endCell());
        },
        parse: (src) => {
            return loadSetPaid(src.loadRef().beginParse());
        }
    }
}

export type ConfirmRelease = {
    $$type: 'ConfirmRelease';
}

export function storeConfirmRelease(src: ConfirmRelease) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(546, 32);
    };
}

export function loadConfirmRelease(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 546) { throw Error('Invalid prefix'); }
    return { $$type: 'ConfirmRelease' as const };
}

export function loadTupleConfirmRelease(source: TupleReader) {
    return { $$type: 'ConfirmRelease' as const };
}

export function loadGetterTupleConfirmRelease(source: TupleReader) {
    return { $$type: 'ConfirmRelease' as const };
}

export function storeTupleConfirmRelease(source: ConfirmRelease) {
    const builder = new TupleBuilder();
    return builder.build();
}

export function dictValueParserConfirmRelease(): DictionaryValue<ConfirmRelease> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeConfirmRelease(src)).endCell());
        },
        parse: (src) => {
            return loadConfirmRelease(src.loadRef().beginParse());
        }
    }
}

export type Dispute = {
    $$type: 'Dispute';
    reason: string;
}

export function storeDispute(src: Dispute) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(819, 32);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadDispute(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 819) { throw Error('Invalid prefix'); }
    const _reason = sc_0.loadStringRefTail();
    return { $$type: 'Dispute' as const, reason: _reason };
}

export function loadTupleDispute(source: TupleReader) {
    const _reason = source.readString();
    return { $$type: 'Dispute' as const, reason: _reason };
}

export function loadGetterTupleDispute(source: TupleReader) {
    const _reason = source.readString();
    return { $$type: 'Dispute' as const, reason: _reason };
}

export function storeTupleDispute(source: Dispute) {
    const builder = new TupleBuilder();
    builder.writeString(source.reason);
    return builder.build();
}

export function dictValueParserDispute(): DictionaryValue<Dispute> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDispute(src)).endCell());
        },
        parse: (src) => {
            return loadDispute(src.loadRef().beginParse());
        }
    }
}

export type Arbitrate = {
    $$type: 'Arbitrate';
    winner_is_buyer: boolean;
}

export function storeArbitrate(src: Arbitrate) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1092, 32);
        b_0.storeBit(src.winner_is_buyer);
    };
}

export function loadArbitrate(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1092) { throw Error('Invalid prefix'); }
    const _winner_is_buyer = sc_0.loadBit();
    return { $$type: 'Arbitrate' as const, winner_is_buyer: _winner_is_buyer };
}

export function loadTupleArbitrate(source: TupleReader) {
    const _winner_is_buyer = source.readBoolean();
    return { $$type: 'Arbitrate' as const, winner_is_buyer: _winner_is_buyer };
}

export function loadGetterTupleArbitrate(source: TupleReader) {
    const _winner_is_buyer = source.readBoolean();
    return { $$type: 'Arbitrate' as const, winner_is_buyer: _winner_is_buyer };
}

export function storeTupleArbitrate(source: Arbitrate) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.winner_is_buyer);
    return builder.build();
}

export function dictValueParserArbitrate(): DictionaryValue<Arbitrate> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeArbitrate(src)).endCell());
        },
        parse: (src) => {
            return loadArbitrate(src.loadRef().beginParse());
        }
    }
}

export type P2PTrade$Data = {
    $$type: 'P2PTrade$Data';
    id: bigint;
    seller: Address;
    buyer: Address;
    arbitrator: Address;
    amount: bigint;
    isPaid: boolean;
    isDisputed: boolean;
}

export function storeP2PTrade$Data(src: P2PTrade$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(src.id, 32);
        b_0.storeAddress(src.seller);
        b_0.storeAddress(src.buyer);
        b_0.storeAddress(src.arbitrator);
        b_0.storeCoins(src.amount);
        b_0.storeBit(src.isPaid);
        b_0.storeBit(src.isDisputed);
    };
}

export function loadP2PTrade$Data(slice: Slice) {
    const sc_0 = slice;
    const _id = sc_0.loadUintBig(32);
    const _seller = sc_0.loadAddress();
    const _buyer = sc_0.loadAddress();
    const _arbitrator = sc_0.loadAddress();
    const _amount = sc_0.loadCoins();
    const _isPaid = sc_0.loadBit();
    const _isDisputed = sc_0.loadBit();
    return { $$type: 'P2PTrade$Data' as const, id: _id, seller: _seller, buyer: _buyer, arbitrator: _arbitrator, amount: _amount, isPaid: _isPaid, isDisputed: _isDisputed };
}

export function loadTupleP2PTrade$Data(source: TupleReader) {
    const _id = source.readBigNumber();
    const _seller = source.readAddress();
    const _buyer = source.readAddress();
    const _arbitrator = source.readAddress();
    const _amount = source.readBigNumber();
    const _isPaid = source.readBoolean();
    const _isDisputed = source.readBoolean();
    return { $$type: 'P2PTrade$Data' as const, id: _id, seller: _seller, buyer: _buyer, arbitrator: _arbitrator, amount: _amount, isPaid: _isPaid, isDisputed: _isDisputed };
}

export function loadGetterTupleP2PTrade$Data(source: TupleReader) {
    const _id = source.readBigNumber();
    const _seller = source.readAddress();
    const _buyer = source.readAddress();
    const _arbitrator = source.readAddress();
    const _amount = source.readBigNumber();
    const _isPaid = source.readBoolean();
    const _isDisputed = source.readBoolean();
    return { $$type: 'P2PTrade$Data' as const, id: _id, seller: _seller, buyer: _buyer, arbitrator: _arbitrator, amount: _amount, isPaid: _isPaid, isDisputed: _isDisputed };
}

export function storeTupleP2PTrade$Data(source: P2PTrade$Data) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.id);
    builder.writeAddress(source.seller);
    builder.writeAddress(source.buyer);
    builder.writeAddress(source.arbitrator);
    builder.writeNumber(source.amount);
    builder.writeBoolean(source.isPaid);
    builder.writeBoolean(source.isDisputed);
    return builder.build();
}

export function dictValueParserP2PTrade$Data(): DictionaryValue<P2PTrade$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeP2PTrade$Data(src)).endCell());
        },
        parse: (src) => {
            return loadP2PTrade$Data(src.loadRef().beginParse());
        }
    }
}

export type CreateTrade = {
    $$type: 'CreateTrade';
    queryId: bigint;
    seller: Address;
    buyer: Address;
    amount: bigint;
}

export function storeCreateTrade(src: CreateTrade) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1779676625, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.seller);
        b_0.storeAddress(src.buyer);
        b_0.storeCoins(src.amount);
    };
}

export function loadCreateTrade(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1779676625) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _seller = sc_0.loadAddress();
    const _buyer = sc_0.loadAddress();
    const _amount = sc_0.loadCoins();
    return { $$type: 'CreateTrade' as const, queryId: _queryId, seller: _seller, buyer: _buyer, amount: _amount };
}

export function loadTupleCreateTrade(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _seller = source.readAddress();
    const _buyer = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'CreateTrade' as const, queryId: _queryId, seller: _seller, buyer: _buyer, amount: _amount };
}

export function loadGetterTupleCreateTrade(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _seller = source.readAddress();
    const _buyer = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'CreateTrade' as const, queryId: _queryId, seller: _seller, buyer: _buyer, amount: _amount };
}

export function storeTupleCreateTrade(source: CreateTrade) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.seller);
    builder.writeAddress(source.buyer);
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserCreateTrade(): DictionaryValue<CreateTrade> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCreateTrade(src)).endCell());
        },
        parse: (src) => {
            return loadCreateTrade(src.loadRef().beginParse());
        }
    }
}

export type P2PFactory$Data = {
    $$type: 'P2PFactory$Data';
    admin: Address;
    tradeCount: bigint;
}

export function storeP2PFactory$Data(src: P2PFactory$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.admin);
        b_0.storeUint(src.tradeCount, 32);
    };
}

export function loadP2PFactory$Data(slice: Slice) {
    const sc_0 = slice;
    const _admin = sc_0.loadAddress();
    const _tradeCount = sc_0.loadUintBig(32);
    return { $$type: 'P2PFactory$Data' as const, admin: _admin, tradeCount: _tradeCount };
}

export function loadTupleP2PFactory$Data(source: TupleReader) {
    const _admin = source.readAddress();
    const _tradeCount = source.readBigNumber();
    return { $$type: 'P2PFactory$Data' as const, admin: _admin, tradeCount: _tradeCount };
}

export function loadGetterTupleP2PFactory$Data(source: TupleReader) {
    const _admin = source.readAddress();
    const _tradeCount = source.readBigNumber();
    return { $$type: 'P2PFactory$Data' as const, admin: _admin, tradeCount: _tradeCount };
}

export function storeTupleP2PFactory$Data(source: P2PFactory$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.admin);
    builder.writeNumber(source.tradeCount);
    return builder.build();
}

export function dictValueParserP2PFactory$Data(): DictionaryValue<P2PFactory$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeP2PFactory$Data(src)).endCell());
        },
        parse: (src) => {
            return loadP2PFactory$Data(src.loadRef().beginParse());
        }
    }
}

export type TradeCreated = {
    $$type: 'TradeCreated';
    tradeAddress: Address;
    seller: Address;
    buyer: Address;
}

export function storeTradeCreated(src: TradeCreated) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.tradeAddress);
        b_0.storeAddress(src.seller);
        b_0.storeAddress(src.buyer);
    };
}

export function loadTradeCreated(slice: Slice) {
    const sc_0 = slice;
    const _tradeAddress = sc_0.loadAddress();
    const _seller = sc_0.loadAddress();
    const _buyer = sc_0.loadAddress();
    return { $$type: 'TradeCreated' as const, tradeAddress: _tradeAddress, seller: _seller, buyer: _buyer };
}

export function loadTupleTradeCreated(source: TupleReader) {
    const _tradeAddress = source.readAddress();
    const _seller = source.readAddress();
    const _buyer = source.readAddress();
    return { $$type: 'TradeCreated' as const, tradeAddress: _tradeAddress, seller: _seller, buyer: _buyer };
}

export function loadGetterTupleTradeCreated(source: TupleReader) {
    const _tradeAddress = source.readAddress();
    const _seller = source.readAddress();
    const _buyer = source.readAddress();
    return { $$type: 'TradeCreated' as const, tradeAddress: _tradeAddress, seller: _seller, buyer: _buyer };
}

export function storeTupleTradeCreated(source: TradeCreated) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.tradeAddress);
    builder.writeAddress(source.seller);
    builder.writeAddress(source.buyer);
    return builder.build();
}

export function dictValueParserTradeCreated(): DictionaryValue<TradeCreated> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTradeCreated(src)).endCell());
        },
        parse: (src) => {
            return loadTradeCreated(src.loadRef().beginParse());
        }
    }
}

 type P2PFactory_init_args = {
    $$type: 'P2PFactory_init_args';
}

function initP2PFactory_init_args(src: P2PFactory_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
    };
}

async function P2PFactory_init() {
    const __code = Cell.fromHex('b5ee9c72410211010004c4000228ff008e88f4a413f4bcf2c80bed5320e303ed43d901030139a645a2fb513434800065fe9034c7d65b04a54c1c3e108078b6cf1b08600200022002e03001d072d721d200d200fa4021103450666f04f86102f862ed44d0d2000197fa40d31f596c12953070f84201e203925f03e07022d74920c21f953102d31f03de2182106a13b5d1bae302218210946a98b6bae30233c00002c12112b09e01c87f01ca005902cecb1fc9ed54e05bf2c082041002fe5b01d33f31fa40fa40fa003004a45470215367db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0820afaf0808209c9c3808209312d0053a2a058a001a05099a082008a4ff8416f24135f03500abe19f2f407706d50437f595f41f90001f9005ad76501050f013a88c87001ca0055415045810101cf0012cece01c8ce12810101cf00cdc9060228ff008e88f4a413f4bcf2c80bed5320e303ed43d907090189a6743efb51343480006384b4c7fe903e903e903e803480348015581b05e38820404075c03e903e903500743e9020404075c00c040944090408c1745540dc1c38b6cf1b1c600800022503f63001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e12d31ffa40fa40fa40fa00d200d20055606c178e20810101d700fa40fa40d401d0fa40810101d7003010251024102305d155037070e208925f08e07027d74920c21f953107d31f08de21810111bae30221810222bae30221810333ba0a0b0c005a5f03358155c6f84223c705f2f4103555127f01c87f01ca0055605067cb1f14ce12cece01fa02ca00ca00c9ed5400da5b36811afcf84225c705f2f48200beb026f2f422708100a06d5a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0010465513c87f01ca0055605067cb1f14ce12cece01fa02ca00ca00c9ed5402ec8e345b36368200c241f84224c705917f95f84223c705e2f2f455137fc87f01ca0055605067cb1f14ce12cece01fa02ca00ca00c9ed54e021810444bae302218210946a98b6bae30238c00007c12117b08e1e10465513c87f01ca0055605067cb1f14ce12cece01fa02ca00ca00c9ed54e05f07f2c0820d0e00da5b06d200308170c8f84224c705f2f491229123e2708100a06d5a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0010465513c87f01ca0055605067cb1f14ce12cece01fa02ca00ca00c9ed5400b05b06d33f30c8018210aff90f5758cb1fcb3fc91057104610354430f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00c87f01ca0055605067cb1f14ce12cece01fa02ca00ca00c9ed5400ccd76582020134c8cb17cb0fcb0fcbffcbff71f9040003c8cf8580ca0012cccccf884008cbff01fa028069cf40cf8634f400c901fb004444c855205023cececec9c88258c000000000000000000000000101cb67ccc970fb0001c87f01ca005902cecb1fc9ed5400885b01d33f30c8018210aff90f5758cb1fcb3fc912f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00c87f01ca005902cecb1fc9ed5435159b73');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initP2PFactory_init_args({ $$type: 'P2PFactory_init_args' })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const P2PFactory_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    6908: { message: "Only seller can release" },
    21958: { message: "Only buyer can mark as paid" },
    28872: { message: "Only arbitrator can resolve" },
    35407: { message: "Insufficient TON" },
    48816: { message: "Buyer hasn't paid yet" },
    49729: { message: "Unauthorized" },
} as const

export const P2PFactory_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Only seller can release": 6908,
    "Only buyer can mark as paid": 21958,
    "Only arbitrator can resolve": 28872,
    "Insufficient TON": 35407,
    "Buyer hasn't paid yet": 48816,
    "Unauthorized": 49729,
} as const

const P2PFactory_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"SetPaid","header":273,"fields":[]},
    {"name":"ConfirmRelease","header":546,"fields":[]},
    {"name":"Dispute","header":819,"fields":[{"name":"reason","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"Arbitrate","header":1092,"fields":[{"name":"winner_is_buyer","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"P2PTrade$Data","header":null,"fields":[{"name":"id","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"seller","type":{"kind":"simple","type":"address","optional":false}},{"name":"buyer","type":{"kind":"simple","type":"address","optional":false}},{"name":"arbitrator","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"isPaid","type":{"kind":"simple","type":"bool","optional":false}},{"name":"isDisputed","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"CreateTrade","header":1779676625,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"seller","type":{"kind":"simple","type":"address","optional":false}},{"name":"buyer","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"P2PFactory$Data","header":null,"fields":[{"name":"admin","type":{"kind":"simple","type":"address","optional":false}},{"name":"tradeCount","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"TradeCreated","header":null,"fields":[{"name":"tradeAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"seller","type":{"kind":"simple","type":"address","optional":false}},{"name":"buyer","type":{"kind":"simple","type":"address","optional":false}}]},
]

const P2PFactory_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "SetPaid": 273,
    "ConfirmRelease": 546,
    "Dispute": 819,
    "Arbitrate": 1092,
    "CreateTrade": 1779676625,
}

const P2PFactory_getters: ABIGetter[] = [
    {"name":"totalTrades","methodId":71307,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
]

export const P2PFactory_getterMapping: { [key: string]: string } = {
    'totalTrades': 'getTotalTrades',
}

const P2PFactory_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"empty"}},
    {"receiver":"internal","message":{"kind":"typed","type":"CreateTrade"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]


export class P2PFactory implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = P2PFactory_errors_backward;
    public static readonly opcodes = P2PFactory_opcodes;
    
    static async init() {
        return await P2PFactory_init();
    }
    
    static async fromInit() {
        const __gen_init = await P2PFactory_init();
        const address = contractAddress(0, __gen_init);
        return new P2PFactory(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new P2PFactory(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  P2PFactory_types,
        getters: P2PFactory_getters,
        receivers: P2PFactory_receivers,
        errors: P2PFactory_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: null | CreateTrade | Deploy) {
        
        let body: Cell | null = null;
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'CreateTrade') {
            body = beginCell().store(storeCreateTrade(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getTotalTrades(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('totalTrades', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
}