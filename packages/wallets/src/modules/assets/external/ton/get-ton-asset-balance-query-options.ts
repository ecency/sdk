import { queryOptions } from "@tanstack/react-query";
import { getAddressFromAccount } from "../common";

interface TonApiResponse {
  balance: number; // in nanotons
}

export function getTonAssetBalanceQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["assets", "ton", "balance", username],
    queryFn: async () => {
      const address = await getAddressFromAccount(username, "TON");

      const tonResponse = await fetch(
        `https://tonapi.io/v1/blockchain/getAccount?account=${address}`
      );
      if (!tonResponse.ok) throw new Error("Ton API request failed");
      const tonResponseData = (await tonResponse.json()) as TonApiResponse;
      return tonResponseData.balance / 1e9;
    },
  });
}
