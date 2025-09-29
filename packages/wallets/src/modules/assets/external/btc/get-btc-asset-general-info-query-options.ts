import { queryOptions } from "@tanstack/react-query";
import { GeneralAssetInfo } from "../../types";
import { CONFIG } from "@ecency/sdk";
import { getBtcAssetBalanceQueryOptions } from "./get-btc-asset-balance-query-options";
import { getCoinGeckoPriceQueryOptions } from "@/modules/wallets";

export function getBtcAssetGeneralInfoQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["assets", "btc", "general-info", username],
    staleTime: 60000,
    refetchInterval: 90000,
    queryFn: async () => {
      await CONFIG.queryClient.fetchQuery(
        getBtcAssetBalanceQueryOptions(username)
      );
      const accountBalance =
        CONFIG.queryClient.getQueryData<number>(
          getBtcAssetBalanceQueryOptions(username).queryKey
        ) ?? 0;

      await CONFIG.queryClient.prefetchQuery(
        getCoinGeckoPriceQueryOptions("BTC")
      );
      const price =
        CONFIG.queryClient.getQueryData<number>(
          getCoinGeckoPriceQueryOptions("BTC").queryKey
        ) ?? 0;

      return {
        name: "BTC",
        title: "Bitcoin",
        price,
        accountBalance,
      } satisfies GeneralAssetInfo;
    },
  });
}
