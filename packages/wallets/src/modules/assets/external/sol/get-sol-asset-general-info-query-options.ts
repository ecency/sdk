import { queryOptions } from "@tanstack/react-query";
import { GeneralAssetInfo } from "../../types";
import { CONFIG } from "@ecency/sdk";
import { getSolAssetBalanceQueryOptions } from "./get-sol-asset-balance-query-options";
import { getCoinGeckoPriceQueryOptions } from "@/modules/wallets";

export function getSolAssetGeneralInfoQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["assets", "sol", "general-info", username],
    staleTime: 60000,
    refetchInterval: 90000,
    queryFn: async () => {
      await CONFIG.queryClient.fetchQuery(
        getSolAssetBalanceQueryOptions(username)
      );
      const accountBalance =
        CONFIG.queryClient.getQueryData<number>(
          getSolAssetBalanceQueryOptions(username).queryKey
        ) ?? 0;

      await CONFIG.queryClient.prefetchQuery(
        getCoinGeckoPriceQueryOptions("SOL")
      );
      const price =
        CONFIG.queryClient.getQueryData<number>(
          getCoinGeckoPriceQueryOptions("SOL").queryKey
        ) ?? 0;

      return {
        name: "SOL",
        title: "Solana",
        price,
        accountBalance,
      } satisfies GeneralAssetInfo;
    },
  });
}
