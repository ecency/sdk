import { queryOptions } from "@tanstack/react-query";
import { GeneralAssetInfo } from "../../types";
import { CONFIG } from "@ecency/sdk";
import { getAptAssetBalanceQueryOptions } from "./get-apt-asset-balance-query-options";
import { getCoinGeckoPriceQueryOptions } from "@/modules/wallets";

export function getAptAssetGeneralInfoQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["assets", "apt", "general-info", username],
    staleTime: 60000,
    refetchInterval: 90000,
    queryFn: async () => {
      await CONFIG.queryClient.fetchQuery(
        getAptAssetBalanceQueryOptions(username)
      );
      const accountBalance =
        CONFIG.queryClient.getQueryData<number>(
          getAptAssetBalanceQueryOptions(username).queryKey
        ) ?? 0;

      await CONFIG.queryClient.prefetchQuery(
        getCoinGeckoPriceQueryOptions("APT")
      );
      const price =
        CONFIG.queryClient.getQueryData<number>(
          getCoinGeckoPriceQueryOptions("APT").queryKey
        ) ?? 0;

      return {
        name: "APT",
        title: "Aptos",
        price,
        accountBalance,
      } satisfies GeneralAssetInfo;
    },
  });
}
