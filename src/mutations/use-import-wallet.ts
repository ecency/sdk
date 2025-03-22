import { EcencyWalletCurrency } from "@/enums";
import { getKeysFromSeed } from "@/functions";
import { EcencyCreateWalletInformation } from "@/types";
import { getWallet } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Payload {
  address: string;
  privateKeyOrSeed: string;
}

export function useImportWallet(
  username: string,
  currency: EcencyWalletCurrency
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["ecency-wallets", "import-wallet", username, currency],
    mutationFn: async ({ privateKeyOrSeed }: Payload) => {
      const wallet = getWallet(currency);

      if (!wallet) {
        throw new Error("Cannot find token for this currency");
      }

      const isSeed = privateKeyOrSeed.split(" ").length === 12;
      let address;
      let privateKey = privateKeyOrSeed;

      if (isSeed) {
        [privateKey, address] = await getKeysFromSeed(
          privateKeyOrSeed,
          wallet,
          currency
        );
      } else {
        address = (
          await wallet.getNewAddress({
            privateKey: privateKeyOrSeed,
          })
        ).address;
      }

      if (!address || !privateKeyOrSeed) {
        throw new Error(
          "Private key/seed phrase isn't matching with public key or token"
        );
      }

      return {
        privateKey,
        address,
        publicKey: "",
      };
    },
    onSuccess: ({ privateKey, publicKey, address }) => {
      queryClient.setQueryData<
        Map<EcencyWalletCurrency, EcencyCreateWalletInformation>
      >(["ecency-wallets", "wallets", username], (data) =>
        new Map(data ? Array.from(data.entries()) : []).set(currency, {
          privateKey,
          publicKey,
          address,
          username,
          currency,
          custom: true,
        })
      );
    },
  });
}
