# @ecency/snap

MetaMask Snap providing multi-chain wallet capabilities powered by
[`@ecency/wallets`](../wallets).

## Installation

```bash
yarn add @ecency/snap
```

Add the snap to MetaMask using a local manifest or bundle produced by
`yarn workspace @ecency/snap build`.

## Development

From the repository root you can build and test the snap:

```bash
# compile TypeScript and generate the snap bundle/manifest
yarn workspace @ecency/snap build

# run unit tests
yarn workspace @ecency/snap test
```

The build outputs `snap.manifest.json` alongside `dist/bundle.js`.

### Loading in MetaMask Flask

1. Install the [MetaMask Flask](https://metamask.io/flask/) extension.
2. Run `yarn workspace @ecency/snap build` to generate the manifest and bundle.
3. In MetaMask, open **Settings → Snaps** and choose **Add Snap**.
4. Select `packages/snap/snap.manifest.json` from this repository.
5. Approve the installation prompts.

The snap now appears in the MetaMask Snaps list and can be invoked by dApps
using `local:@ecency/snap`.

### Playground

For a quick way to install and interact with the snap locally, start the
included playground which builds the snap and serves an example page:

```bash
yarn workspace @ecency/snap-playground start
```

Open `http://localhost:5173` in a MetaMask Flask-enabled browser and use the
page buttons to install the snap, set a mnemonic and request derived addresses
for all supported chains. The playground resolves any Hive account name on your
behalf and shows the public keys returned by the snap.

## Usage

The snap exposes several RPC methods:

- `initialize` – store a BIP39 mnemonic inside the snap.
- `unlock` – validate and unlock previously stored mnemonic.
- `getAddresses` – derive public keys for Hive roles and addresses for BTC,
  ETH, APT, TRX, ATOM and SOL. dApps can perform any Hive account lookups
  themselves using the returned keys.
- `signHiveTx` – sign a Hive transaction with the active key.
- `signExternalTx` – sign transactions for external chains via `signExternalTx` from
  `@ecency/wallets`.
- `getBalance` – query balances using `useGetExternalWalletBalanceQuery` (todo: integrate).

### Connecting from a dApp

1. Request the snap to be installed in MetaMask. For local development use
   `local:@ecency/snap`; when published to npm replace it with `npm:@ecency/snap` and an
   optional version range.

   ```ts
   await window.ethereum.request({
     method: "wallet_enable",
     params: [{
       wallet_snap: {
         "local:@ecency/snap": {}
       }
     }]
   });
   ```

2. Invoke RPC methods exposed by the snap:

  ```ts
  const result = await window.ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: "local:@ecency/snap",
      request: { method: "getAddresses" }
    }
  });
  // Optional: resolve Hive account name
  const account = await lookupHiveAccount(result.hive.active);
  ```

3. Use the returned data in your application. When integrating into Ecency.com, these
   calls can be wrapped in a connector module that detects MetaMask and manages snap
   installation.

## Required Permissions

This snap declares the following permissions:

- `snap_getBip44Entropy` – derive Hive keys from the MetaMask seed phrase.
- `endowment:rpc` – communicate with dApps via the snap RPC interface.
- `snap_dialog` – prompt the user when signing transactions or encrypting and
  decrypting data.
- `endowment:webassembly` – enable WebAssembly support for cryptographic
  libraries used by the snap.

All permissions follow the principle of least privilege. No private keys are
stored in memory or exposed to the client.

## Security Notes

- Keys are derived only when required and cleared from memory immediately after
  use.
- No network requests are made by the snap itself.
- All transaction data is validated before processing.
- No sensitive data is stored in browser storage.
- The mnemonic phrase resides in the snap's managed state. Although snaps run in
  an isolated environment, that state persists on the user's machine. Avoid
  exposing the mnemonic and consider encrypting state for production
  deployments.

## Publishing & Discovery

To prepare the snap for public use:

1. **Build** the bundle and manifest:

   ```bash
   yarn workspace @ecency/snap build
   ```

2. **Publish** the package to npm from `packages/snap`.

3. **Submit** the npm package to the [MetaMask Snaps Directory](https://docs.metamask.io/snaps/developing/register/) for
   listing and discovery.

Once published, dApps like Ecency.com can enable the snap using the `npm:@ecency/snap`
identifier in the `wallet_enable` request.
