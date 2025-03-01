import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { EcencyCreateWalletInformation } from "@/types";
import { EcencyWalletCurrency } from "@/enums";
import { delay, getWallet } from "@/utils";

export function useWalletCreate(currency: EcencyWalletCurrency) {
  const createWallet = useMutation({
    mutationKey: ["ecency", "create-wallet", currency],
    mutationFn: async () => {
      const wallet = getWallet(currency);
      wallet?.getDerivedPrivateKey;
      const privateKey = (await wallet?.getRandomPrivateKey()) as string;
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
