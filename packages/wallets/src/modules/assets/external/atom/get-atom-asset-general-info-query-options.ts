import { queryOptions } from "@tanstack/react-query";
import { GeneralAssetInfo } from "../../types";
import { CONFIG } from "@ecency/sdk";
import { getAtomAssetBalanceQueryOptions } from "./get-atom-asset-balance-query-options";
import { getCoinGeckoPriceQueryOptions } from "@/modules/wallets";

export function getAtomAssetGeneralInfoQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["assets", "atom", "general-info", username],
    staleTime: 60000,
    refetchInterval: 90000,
    queryFn: async () => {
      await CONFIG.queryClient.fetchQuery(
        getAtomAssetBalanceQueryOptions(username)
      );
      const accountBalance =
        CONFIG.queryClient.getQueryData<number>(
          getAtomAssetBalanceQueryOptions(username).queryKey
        ) ?? 0;

      await CONFIG.queryClient.prefetchQuery(
        getCoinGeckoPriceQueryOptions("ATOM")
      );
      const price =
        CONFIG.queryClient.getQueryData<number>(
          getCoinGeckoPriceQueryOptions("ATOM").queryKey
        ) ?? 0;

      return {
        name: "ATOM",
        title: "Cosmos",
        price,
        accountBalance,
      } satisfies GeneralAssetInfo;
    },
  });
}
