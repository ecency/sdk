# @ecency/snap-playground

Simple web app for installing and exercising the Ecency MetaMask Snap during
local development.

## Usage

```bash
yarn workspace @ecency/snap-playground start
```

Open `http://localhost:5173` in a MetaMask Flask-enabled browser and use the
page controls to install the snap, set a mnemonic and request derived addresses
for all supported chains. The playground performs the Hive RPC lookup so any
linked account name is displayed alongside the derived public keys.
