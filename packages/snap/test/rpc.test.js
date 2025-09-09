import test from "node:test";
import assert from "node:assert/strict";
import { onRpcRequest } from "../dist/bundle.js";
import { getLastSignExternalTxParams } from "./mock-wallets.js";

const state = {};

// simple snap state stub
globalThis.snap = {
  request: async ({ method, params }) => {
    if (method !== "snap_manageState") throw new Error("unsupported");
    if (params.operation === "get") return state;
    if (params.operation === "update") {
      Object.assign(state, params.newState);
      return null;
    }
    throw new Error("bad operation");
  },
};

const mnemonic = "test test test test test test test test test test test junk";

test("initialize and unlock", async () => {
  const init = await onRpcRequest({
    origin: "test",
    request: { method: "initialize", params: { mnemonic } },
  });
  assert.equal(init, true);

  const unlock = await onRpcRequest({
    origin: "test",
    request: { method: "unlock", params: { mnemonic } },
  });
  assert.equal(unlock, true);
});

test("get derived addresses without network", async () => {
  const origFetch = globalThis.fetch;
  globalThis.fetch = () => {
    throw new Error("network request not allowed");
  };
  await onRpcRequest({
    origin: "test",
    request: { method: "initialize", params: { mnemonic } },
  });
  const res = await onRpcRequest({
    origin: "test",
    request: { method: "getAddresses" },
  });
  assert.equal(res.hive.active, "pub");
  assert.equal(res.btc, "addr");
  assert.equal(res.eth, "addr");
  assert.equal(res.apt, "addr");
  assert.equal(res.trx, "addr");
  assert.equal(res.atom, "addr");
  assert.equal(res.sol, "addr");
  globalThis.fetch = origFetch;
});

test("sign hive tx", async () => {
  await onRpcRequest({
    origin: "test",
    request: { method: "initialize", params: { mnemonic } },
  });
  const tx = {
    ref_block_num: 0,
    ref_block_prefix: 0,
    expiration: "2020-01-01T00:00:00",
    operations: [],
    extensions: [],
  };
  const signed = await onRpcRequest({
    origin: "test",
    request: { method: "signHiveTx", params: { tx } },
  });
  assert.ok(Array.isArray(signed.signatures));
});

test("sign external tx", async () => {
  await onRpcRequest({
    origin: "test",
    request: { method: "initialize", params: { mnemonic } },
  });
  const res = await onRpcRequest({
    origin: "test",
    request: {
      method: "signExternalTx",
      params: { currency: "BTC", params: { foo: "bar" } },
    },
  });
  assert.equal(res, "signed");
  assert.equal(getLastSignExternalTxParams().privateKey, "priv");
});

test("balance query placeholder", async () => {
  await onRpcRequest({
    origin: "test",
    request: { method: "initialize", params: { mnemonic } },
  });
  const bal = await onRpcRequest({
    origin: "test",
    request: {
      method: "getBalance",
      params: { currency: "BTC", address: "xyz" },
    },
  });
  assert.equal(bal, 0);
});
