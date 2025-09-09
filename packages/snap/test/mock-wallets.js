import fs from 'fs';
import path from 'path';

const pkgDir = path.resolve('node_modules/@ecency/wallets');
fs.mkdirSync(pkgDir, { recursive: true });
fs.writeFileSync(
  path.join(pkgDir, 'package.json'),
  '{"name":"@ecency/wallets","type":"module"}'
);

// store the last params globally so tests can access them
globalThis.__lastSignExternalTxParams = null;

fs.writeFileSync(
  path.join(pkgDir, 'index.js'),
  `
export function mnemonicToSeedBip39(m){return m;}
export function deriveHiveKeys(){
  return {
    owner:'priv',
    active:'priv',
    posting:'priv',
    memo:'priv',
    ownerPubkey:'owner',
    activePubkey:'pub',
    postingPubkey:'post',
    memoPubkey:'memo'
  };
}
export function signTx(tx){return {...tx,signatures:['sig']};}
export function signExternalTx(c,p){globalThis.__lastSignExternalTxParams=p;return 'signed';}
export function getWallet(){return {getNewAddress:async()=>({address:'addr',publicKey:'pub'}),getDerivedPrivateKey:async()=> 'priv',signTransaction:async()=> 'signed'};}
export async function getKeysFromSeed(){return ['priv','addr'];}
`
);

export function getLastSignExternalTxParams(){
  return globalThis.__lastSignExternalTxParams;
}

