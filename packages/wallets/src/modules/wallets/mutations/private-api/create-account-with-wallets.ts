import { CONFIG } from "@ecency/sdk";
import { EcencyWalletCurrency } from "@/modules/wallets/enums";
import { useHiveKeysQuery } from "@/modules/wallets/queries";
import { EcencyCreateWalletInformation } from "@/modules/wallets/types";
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
      fetch(CONFIG.privateApiHost + "/private-api/wallets-add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
