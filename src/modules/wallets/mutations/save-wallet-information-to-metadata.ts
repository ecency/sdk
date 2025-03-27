import { useAccountUpdate } from "@/modules/accounts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EcencyWalletCurrency } from "../enums";
import { EcencyCreateWalletInformation } from "../types";

export function useSaveWalletInformationToMetadata(username: string) {
  const { data } = useQuery<
    Map<EcencyWalletCurrency, EcencyCreateWalletInformation>
  >({
    queryKey: ["ecency-wallets", "wallets", username],
  });
  const { mutateAsync: updateProfile } = useAccountUpdate(username);

  return useMutation({
    mutationKey: ["ecency-wallets", "save-wallet-to-metadata", username],
    mutationFn: () =>
      updateProfile({
        ...Array.from(data?.entries() ?? []).reduce(
          (acc, [curr, info]) => ({
            ...acc,
            [curr]: info.address,
          }),
          {}
        ),
      }),
  });
}
