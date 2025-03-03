import { CONFIG } from "@/config";
import { EcencyWalletCurrency } from "@/enums";
import { useHiveKeysQuery } from "@/queries";
import { EcencyCreateWalletInformation } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

interface Payload {
  currency: EcencyWalletCurrency;
  address: string;
}

export function useCreateAccountWithWallets(username: string) {
  const { data } = useQuery<
    Map<EcencyWalletCurrency, EcencyCreateWalletInformation>
  >({
    queryKey: ["ecency-wallets", "wallets", username],
  });
  const { data: hiveKeys } = useHiveKeysQuery(username);

  return useMutation({
    mutationKey: ["ecency-wallets", "create-account-with-wallets", username],
    mutationFn: ({ currency, address }: Payload) =>
      fetch(CONFIG + "/private-api/wallets-add", {
        method: "POST",
        body: JSON.stringify({
          username,
          token: currency,
          address,
          meta: {
            ownerPublicKey: hiveKeys?.ownerPubkey,
            activePublicKey: hiveKeys?.activePubkey,
            postingPublicKey: hiveKeys?.postingPubkey,
            memoPublicKey: hiveKeys?.memoPubkey,

            ...Array.from(data?.entries() ?? []).reduce(
              (acc, [curr, info]) => ({
                ...acc,
                [curr]: info.address,
              }),
              {}
            ),
          },
        }),
      }),
  });
}
