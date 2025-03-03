import { CONFIG } from "@/config";
import { EcencyWalletCurrency } from "@/enums";
import { useMutation } from "@tanstack/react-query";

interface Payload {
  currency: EcencyWalletCurrency;
  address: string;
}

export function useCreateAccountWithWallets(username: string) {
  return useMutation({
    mutationKey: ["signup-wallet", "create-account", username],
    mutationFn: ({ currency, address }: Payload) =>
      fetch(CONFIG + "/private-api/wallets-add", {
        method: "POST",
        body: JSON.stringify({
          username,
          token: currency,
          address,
          meta: {},
        }),
      }),
  });
}
