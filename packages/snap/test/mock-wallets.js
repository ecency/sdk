import fs from 'fs';
import path from 'path';

const pkgDir = path.resolve('node_modules/@ecency/wallets');
await fs.promises.mkdir(pkgDir, { recursive: true });
await fs.promises.writeFile(path.join(pkgDir, 'package.json'), '{"name":"@ecency/wallets","type":"module"}');
await fs.promises.writeFile(path.join(pkgDir, 'index.js'), `
export function mnemonicToSeedBip39(m){return m;}
export function deriveHiveKeys(){return {active:'priv',activePubkey:'pub'};}
export function signTx(tx){return {...tx,signatures:['sig']};}
export function signExternalTx(){return 'signed';}
export function getWallet(){return {getNewAddress:async()=>({address:'addr',publicKey:'pub'}),getDerivedPrivateKey:async()=> 'priv',signTransaction:async()=> 'signed'};}
export async function getKeysFromSeed(){return ['priv','addr'];}
`);

