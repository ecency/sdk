import { useAccountUpdate } from "@/modules/accounts";
import { useMutation } from "@tanstack/react-query";
import { EcencyWalletCurrency } from "../enums";
import { EcencyCreateWalletInformation } from "../types";

export function useSaveWalletInformationToMetadata(username: string) {
  const { mutateAsync: updateProfile } = useAccountUpdate(username);

  return useMutation({
    mutationKey: ["ecency-wallets", "save-wallet-to-metadata", username],
    mutationFn: ({
      wallets,
    }: {
      wallets: Map<EcencyWalletCurrency, EcencyCreateWalletInformation>;
    }) =>
      updateProfile({
        profile: {},
        tokens: Array.from(wallets.entries() ?? []).map(([curr, info]) => ({
          symbol: curr,
          type: "CHAIN",
          meta: {
            address: info.address,
          },
        })),
      }),
  });
}
