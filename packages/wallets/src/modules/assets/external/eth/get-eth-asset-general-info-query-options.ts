import { queryOptions } from "@tanstack/react-query";
import { GeneralAssetInfo } from "../../types";
import { CONFIG } from "@ecency/sdk";
import { getEthAssetBalanceQueryOptions } from "./get-eth-asset-balance-query-options";
import { getCoinGeckoPriceQueryOptions } from "@/modules/wallets";

export function getEthAssetGeneralInfoQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["assets", "eth", "general-info", username],
    staleTime: 60000,
    refetchInterval: 90000,
    queryFn: async () => {
      await CONFIG.queryClient.fetchQuery(
        getEthAssetBalanceQueryOptions(username)
      );
      const accountBalance =
        CONFIG.queryClient.getQueryData<number>(
          getEthAssetBalanceQueryOptions(username).queryKey
        ) ?? 0;

      await CONFIG.queryClient.prefetchQuery(
        getCoinGeckoPriceQueryOptions("ETH")
      );
      const price =
        CONFIG.queryClient.getQueryData<number>(
          getCoinGeckoPriceQueryOptions("ETH").queryKey
        ) ?? 0;

      return {
        name: "ETH",
        title: "Ethereum",
        price,
        accountBalance,
      } satisfies GeneralAssetInfo;
    },
  });
}
