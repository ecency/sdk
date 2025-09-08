# @ecency/snap

MetaMask Snap providing multi-chain wallet capabilities powered by
[`@ecency/wallets`](../wallets).

## Installation

```bash
yarn add @ecency/snap
```

Add the snap to MetaMask using a local manifest or bundle produced by
`yarn workspace @ecency/snap build`.

## Usage

The snap exposes several RPC methods:

- `initialize` – store a BIP39 mnemonic inside the snap.
- `unlock` – validate and unlock previously stored mnemonic.
- `getAddress` – return a public address for a given chain (`HIVE`, `BTC`, `ETH`, etc.).
- `signHiveTx` – sign a Hive transaction with the active key.
- `signExternalTx` – sign transactions for external chains via `signExternalTx` from
  `@ecency/wallets`.
- `getBalance` – query balances using `useGetExternalWalletBalanceQuery` (todo: integrate).

Example from a dApp:

```ts
const result = await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: 'local:@ecency/snap',
    request: {
      method: 'getAddress',
      params: { chain: 'HIVE' }
    }
  }
});
```

## Security considerations

The mnemonic phrase is stored inside the snap's managed state. Snaps run in an
isolated environment, but any state stored by the snap is persisted on the
user's machine. Avoid exposing the mnemonic and consider encrypting state in
production deployments.
