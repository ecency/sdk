import { queryOptions } from "@tanstack/react-query";
import { GeneralAssetInfo } from "../../types";
import { CONFIG } from "@ecency/sdk";
import { getTronAssetBalanceQueryOptions } from "./get-tron-asset-balance-query-options";
import { getCoinGeckoPriceQueryOptions } from "@/modules/wallets";

export function getTronAssetGeneralInfoQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["assets", "tron", "general-info", username],
    staleTime: 60000,
    refetchInterval: 90000,
    queryFn: async () => {
      await CONFIG.queryClient.fetchQuery(
        getTronAssetBalanceQueryOptions(username)
      );
      const accountBalance =
        CONFIG.queryClient.getQueryData<number>(
          getTronAssetBalanceQueryOptions(username).queryKey
        ) ?? 0;

      await CONFIG.queryClient.prefetchQuery(
        getCoinGeckoPriceQueryOptions("TRX")
      );
      const price =
        CONFIG.queryClient.getQueryData<number>(
          getCoinGeckoPriceQueryOptions("TRX").queryKey
        ) ?? 0;

      return {
        name: "TRON",
        title: "Tron",
        price,
        accountBalance,
      } satisfies GeneralAssetInfo;
    },
  });
}
