# @ecency/wallets

Utilities for managing Hive blockchain wallets and external cryptocurrency wallets within the Ecency ecosystem.

## Features

- Create wallets from BIP39 seed phrases
- `signDigest` – create a signature for an arbitrary digest
- `signTx` – sign a transaction with an optional custom chain ID
- `signTxAndBroadcast` – sign a transaction and immediately broadcast it
- `encryptMemoWithKeys` / `decryptMemoWithKeys` – encrypt or decrypt memos using explicit keys
- `encryptMemoWithAccounts` / `decryptMemoWithAccounts` – encrypt or decrypt memos by looking up account memo keys
- `useGetExternalWalletBalanceQuery` – retrieve balances for external wallets such as BTC, ETH, SOL, TRX, TON, ATOM, or APT

## Installation

```sh
yarn add @ecency/wallets
# or
npm install @ecency/wallets
```

## Usage

```ts
import {
  signDigest,
  signTx,
  signTxAndBroadcast,
  encryptMemoWithKeys,
  encryptMemoWithAccounts,
  decryptMemoWithKeys,
  decryptMemoWithAccounts,
  EcencyWalletCurrency,
  useGetExternalWalletBalanceQuery,
} from '@ecency/wallets';
import { Client } from '@hiveio/dhive';

const client = new Client('https://api.hive.blog');

const signature = signDigest('deadbeef', privateWif);
const signedTx = signTx(tx, privateWif, customChainId);
await signTxAndBroadcast(client, tx, privateWif);

const encrypted = await encryptMemoWithAccounts(client, privateWif, 'alice', '#hello');
const memo = decryptMemoWithKeys(privateWif, encrypted);

// query an external wallet balance (e.g., BTC)
const { data: btcBalance } = useGetExternalWalletBalanceQuery(
  EcencyWalletCurrency.BTC,
  '1BitcoinAddress...'
);
```

