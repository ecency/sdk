# Ecency SD

[![NPM](https://img.shields.io/npm/v/@ecency/wallets.svg)](https://www.npmjs.com/package/@ecency/wallets) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Overview

`@ecency/sdk` provides an API for managing Hive blockchain wallets and external cryptocurrency wallets within the Ecency ecosystem.

## Installation

```sh
yarn add @ecency/sdk
# or
npm install @ecency/sdk
```

## Setup

1. Install `react @tanstack/react-query @hiveio/dhive`
2. Use!

## Features

This package built on top of [@hiveio/dhive](https://www.npmjs.com/package/@hiveio/dhive) and [okweb3](http://okx.github.io/) packages.

Main functionality is creating wallets based on seed phrase([BIP39](https://www.npmjs.com/package/bip39)) and generating addresses with keys on device. Seed phrases and private keys are never sent to any API, all operations happen locally.

Supportings tokens: BTC, ETH, SOL, TRX, TON, ATOM, APT – theoretically all child tokens of these systems. Make forks for it.

## Roadmap

- Add more Hive wallets operations
- Allow to sign transactions with external wallets
- Allow to import existing wallets by phrase or private keys
- Support of DASH
- Support of DOGE
