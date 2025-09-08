import test from 'node:test';
import assert from 'node:assert/strict';
import { onRpcRequest } from '../dist/ecency-snap.es.js';

const state = {};

globalThis.snap = {
  request: async ({ method, params }) => {
    if (method !== 'snap_manageState') throw new Error('unsupported');
    if (params.operation === 'get') return state;
    if (params.operation === 'update') { Object.assign(state, params.newState); return null; }
    throw new Error('bad operation');
  },
};

const mnemonic = 'test test test test test test test test test test test junk';

test('dapp flow', async () => {
  await onRpcRequest({ origin: 'dapp', request: { method: 'initialize', params: { mnemonic } } });
  const addr = await onRpcRequest({ origin: 'dapp', request: { method: 'getAddress', params: { chain: 'HIVE' } } });
  assert.ok(addr.address);

  const tx = { ref_block_num: 0, ref_block_prefix: 0, expiration: '2020-01-01T00:00:00', operations: [], extensions: [] };
  const signed = await onRpcRequest({ origin: 'dapp', request: { method: 'signHiveTx', params: { tx } } });
  assert.ok(signed.signatures.length > 0);
});

