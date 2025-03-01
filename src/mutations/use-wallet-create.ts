import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { EcencyCreateWalletInformation } from "@/types";
import { EcencyWalletCurrency } from "@/enums";
import { delay, getWallet } from "@/utils";
import { useSeedPhrase } from "@/queries";

const PATHS = {
  [EcencyWalletCurrency.BTC]: "m/44'/0'/0'/0/0", // Bitcoin (BIP44)
  [EcencyWalletCurrency.ETH]: "m/44'/60'/0'/0/0", // Ethereum (BIP44)
  [EcencyWalletCurrency.SOL]: "m/44'/501'/0'/0/0", // Solana (BIP44)
  [EcencyWalletCurrency.TON]: "m/44'/396'/0'/0/0", // TON (BIP44)
  [EcencyWalletCurrency.TRON]: "m/44'/195'/0'/0/0", // Tron (BIP44)
  [EcencyWalletCurrency.APT]: "m/44'/637'/0'/0/0", // Aptos (BIP44)
  [EcencyWalletCurrency.ATOM]: "m/44'/118'/0'/0/0", // Cosmos (BIP44)
} as const;

export function useWalletCreate(currency: EcencyWalletCurrency) {
  const { data: mnemonic } = useSeedPhrase();

  const createWallet = useMutation({
    mutationKey: ["ecency", "create-wallet", currency],
    mutationFn: async () => {
      if (!mnemonic) {
        throw new Error("[Ecency][Wallets] - No seed to create a wallet");
      }

      const wallet = getWallet(currency);
      const privateKey = await wallet?.getDerivedPrivateKey({
        mnemonic,
        hdPath: PATHS[currency],
      });
      await delay(1000);
      const address = (await wallet?.getNewAddress({
        privateKey,
      })) as { address: string; publicKey: string };
      return {
        privateKey,
        address: address.address,
        publicKey: address.publicKey,
      } as EcencyCreateWalletInformation;
    },
  });
  const importWallet = useCallback((currency: EcencyWalletCurrency) => {}, []);

  return {
    createWallet,
    importWallet,
  };
}
