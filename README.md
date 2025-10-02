# Ecency SDK

## Packages

1. `@ecency/sdk` – [![NPM](https://img.shields.io/npm/v/@ecency/sdk.svg)](https://www.npmjs.com/package/@ecency/sdk) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
2. `@ecency/wallets` – [![NPM](https://img.shields.io/npm/v/@ecency/wallets.svg)](https://www.npmjs.com/package/@ecency/wallets) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Overview

1. `@ecency/sdk` provides an API and state management based on @tanstack/react-query for building Hive user interfaces.
2. `@ecency/wallets` provides an API for managing Hive blockchain wallets and external cryptocurrency wallets within the Ecency ecosystem.

## Installation

```sh
yarn add @ecency/sdk
# or
npm install @ecency/sdk
```

## Setup

1. Install `react @tanstack/react-query @hiveio/dhive`
2. Use!

## SDK

`@ecency/sdk` bundles React Query helpers for the Hive blockchain:

- Accounts, posts, operations, communities, games, analytics, and keychain modules
- Query and mutation option builders
- Customisable Hive RPC clients via the `CONFIG` object

See [packages/core/README.md](packages/core/README.md) for detailed usage.

## Wallets

This package is built on top of [@hiveio/dhive](https://www.npmjs.com/package/@hiveio/dhive) and [okweb3](http://okx.github.io/) packages.

The main functionality is creating wallets based on seed phrase([BIP39](https://www.npmjs.com/package/bip39)) and generating addresses with keys on device. Seed phrases and private keys are never sent to any API, all operations happen locally.

Supported tokens: BTC, ETH, SOL, TRON, TON, ATOM, APT—theoretically all child tokens of these systems. Make forks for it.
Use `useGetExternalWalletBalanceQuery` to fetch balances for these chains through Ecency's private API. The hook resolves to the
raw base-unit balance (`balanceString` and `balanceBigInt`) together with the units reported by the upstream node.

### Hive helpers

`@ecency/wallets` also exposes helpers for interacting with the Hive blockchain:

- `signDigest` – create a signature for an arbitrary digest
- `signTx` – sign a transaction with an optional custom chain ID
- `signTxAndBroadcast` – sign a transaction and immediately broadcast it
- `signExternalTx` – sign transactions for external chains like BTC or ETH
- `signExternalTxAndBroadcast` – sign and broadcast transactions on external networks
- `buildExternalTx` – construct transactions or PSBTs for external chains
- `encryptMemoWithKeys` / `decryptMemoWithKeys` – encrypt or decrypt memos with explicit keys
- `encryptMemoWithAccounts` / `decryptMemoWithAccounts` – encrypt or decrypt memos by looking up account memo keys

See [packages/wallets/README.md](packages/wallets/README.md) for usage examples.

## Roadmap

- Add more Hive wallets operations
- Allow importing existing wallets by phrase or private keys
- Support of DASH
- Support of DOGE
