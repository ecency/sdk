import { queryOptions } from "@tanstack/react-query";
import { GeneralAssetInfo } from "../../types";
import { CONFIG } from "@ecency/sdk";
import { getTonAssetBalanceQueryOptions } from "./get-ton-asset-balance-query-options";
import { getCoinGeckoPriceQueryOptions } from "@/modules/wallets";

export function getTonAssetGeneralInfoQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["assets", "ton", "general-info", username],
    staleTime: 60000,
    refetchInterval: 90000,
    queryFn: async () => {
      await CONFIG.queryClient.fetchQuery(
        getTonAssetBalanceQueryOptions(username)
      );
      const accountBalance =
        CONFIG.queryClient.getQueryData<number>(
          getTonAssetBalanceQueryOptions(username).queryKey
        ) ?? 0;

      await CONFIG.queryClient.prefetchQuery(
        getCoinGeckoPriceQueryOptions("TON")
      );
      const price =
        CONFIG.queryClient.getQueryData<number>(
          getCoinGeckoPriceQueryOptions("TON").queryKey
        ) ?? 0;

      return {
        name: "TON",
        title: "Toncoin",
        price,
        accountBalance,
      } satisfies GeneralAssetInfo;
    },
  });
}
