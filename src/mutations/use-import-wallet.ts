import { EcencyWalletCurrency } from "@/enums";
import { getPrivateKeyFromSeedAndValidate } from "@/functions";
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
    mutationFn: async ({ privateKeyOrSeed, address }: Payload) => {
      const wallet = getWallet(currency);

      if (!wallet) {
        throw new Error("Cannot find token for this currency");
      }

      const isSeed = privateKeyOrSeed.split(" ").length === 12;
      let isValid = false;
      let privateKey = privateKeyOrSeed;

      if (isSeed) {
        privateKey = await getPrivateKeyFromSeedAndValidate(
          privateKeyOrSeed,
          address,
          wallet,
          currency
        );
        isValid = !!privateKey;
      } else {
        const derivedAddress = await wallet.getNewAddress({
          privateKey: privateKeyOrSeed,
        });
        const validationResult = (await wallet.validPrivateKey({
          privateKey: privateKeyOrSeed,
        })) as { isValid: boolean };

        isValid =
          derivedAddress.address === address && validationResult.isValid;
      }

      if (!isValid) {
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
