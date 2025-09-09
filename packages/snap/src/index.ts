import {
  mnemonicToSeedBip39,
  deriveHiveKeys,
  signTx,
  signExternalTx,
  getWallet,
  getKeysFromSeed,
} from "@ecency/wallets";

export type RpcRequest = { method: string; params?: any };
export interface RpcArgs { origin: string; request: RpcRequest }
export type OnRpcRequestHandler = (args: RpcArgs) => Promise<any>;

interface SnapState { mnemonic?: string }

async function getState(): Promise<SnapState> {
  return (
    ((await (globalThis as any).snap.request({
      method: "snap_manageState",
      params: { operation: "get" },
    })) as SnapState) || {}
  );
}

async function updateState(state: SnapState): Promise<void> {
  await (globalThis as any).snap.request({
    method: "snap_manageState",
    params: { operation: "update", newState: state },
  });
}

async function getAddressesFromMnemonic(mnemonic: string) {
  const hive = deriveHiveKeys(mnemonic);
  const chains = ["BTC", "ETH", "APT", "TRX", "ATOM", "SOL"] as const;
  const entries = await Promise.all(
    chains.map(async (chain) => {
      const wallet = getWallet(chain as any);
      if (!wallet) return [chain.toLowerCase(), null];
      const [, address] = await getKeysFromSeed(
        mnemonic,
        wallet,
        chain as any,
      );
      return [chain.toLowerCase(), address];
    }),
  );
  return {
    hive: {
      owner: hive.ownerPubkey,
      active: hive.activePubkey,
      posting: hive.postingPubkey,
      memo: hive.memoPubkey,
    },
    ...Object.fromEntries(entries),
  } as any;
}

async function signHiveTransaction(mnemonic: string, tx: any) {
  const keys = deriveHiveKeys(mnemonic);
  return signTx(tx, keys.active);
}

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  const state = await getState();

  switch (request.method) {
    case "initialize": {
      const mnemonic = request.params?.mnemonic;
      if (typeof mnemonic !== "string") throw new Error("mnemonic required");
      mnemonicToSeedBip39(mnemonic); // validate
      await updateState({ mnemonic });
      return true;
    }
    case "unlock": {
      const mnemonic = request.params?.mnemonic;
      if (typeof mnemonic !== "string") throw new Error("mnemonic required");
      mnemonicToSeedBip39(mnemonic); // validate
      if (state.mnemonic && mnemonic !== state.mnemonic) {
        throw new Error("invalid mnemonic");
      }
      await updateState({ mnemonic });
      return true;
    }
    case "getAddresses": {
      if (!state.mnemonic) throw new Error("locked");
      return getAddressesFromMnemonic(state.mnemonic);
    }
    case "signHiveTx": {
      if (!state.mnemonic) throw new Error("locked");
      const tx = request.params?.tx;
      return signHiveTransaction(state.mnemonic, tx);
    }
    case "signExternalTx": {
      if (!state.mnemonic) throw new Error("locked");
      const { currency, params } = request.params ?? {};
      const wallet = getWallet(currency as any);
      if (!wallet) throw new Error("Unsupported chain");
      const [privateKey] = await getKeysFromSeed(
        state.mnemonic,
        wallet,
        currency as any
      );
      return signExternalTx(currency, { ...params, privateKey });
    }
    case "getBalance": {
      // Placeholder implementation. In a full snap environment the
      // useGetExternalWalletBalanceQuery hook from @ecency/wallets
      // should be used via a QueryClient.
      return 0;
    }
    default:
      throw new Error("Method not found.");
  }
};
