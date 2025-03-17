import { EcencyWalletCurrency } from "@/enums";
import { EcencyCreateWalletInformation } from "@/types";
import { getWallet } from "@/utils";
import { BaseWallet } from "@okxweb3/coin-base";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Payload {
  address: string;
  privateKeyOrSeed: string;
}

/**
 * These HD paths covers popular wallets like Trust, Meta, Ledger, Trezor
 */
const HD_PATHS: Record<EcencyWalletCurrency, string[]> = {
  [EcencyWalletCurrency.BTC]: [
    "m/84'/0'/0'/0/0",
    "m/44'/0'/0'/0/0",
    "m/49'/0'/0'/0/0",
  ],
  [EcencyWalletCurrency.ETH]: ["m/44'/60'/0'/0/0"],
  [EcencyWalletCurrency.SOL]: ["m/44'/501'/0'/0'"],
  [EcencyWalletCurrency.TRON]: ["m/44'/195'/0'/0/0"],
  [EcencyWalletCurrency.APT]: ["m/44'/637'/0'/0'/0'"],
  [EcencyWalletCurrency.TON]: ["m/44'/607'/0'"],
  [EcencyWalletCurrency.ATOM]: ["m/44'/118'/0'/0/0"],
};

async function getPrivateKeyFromSeedAndValidate(
  mnemonic: string,
  address: string,
  wallet: BaseWallet,
  currency: EcencyWalletCurrency
) {
  for (const hdPath of HD_PATHS[currency] || []) {
    try {
      const derivedPrivateKey = await wallet.getDerivedPrivateKey({
        mnemonic,
        hdPath,
      });
      const derivedAddress = await wallet.getNewAddress({
        privateKey: derivedPrivateKey,
      });

      if (derivedAddress.address === address) {
        return derivedPrivateKey;
      }
    } catch (error) {
      return undefined;
    }
  }
  return undefined;
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
