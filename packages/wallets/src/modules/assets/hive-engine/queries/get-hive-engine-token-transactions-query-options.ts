import { CONFIG } from "@ecency/sdk";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { GeneralAssetTransaction } from "../../types";

export function getHiveEngineTokenTransactionsQueryOptions(
  username: string | undefined,
  symbol: string,
  limit = 20
) {
  return infiniteQueryOptions<GeneralAssetTransaction[]>({
    queryKey: ["assets", "hive-engine", symbol, "transactions", username],
    enabled: !!symbol && !!username,
    staleTime: 60000,
    refetchInterval: 90000,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.length ?? 0 + limit,
    queryFn: async ({ pageParam }) => {
      if (!symbol || !username) {
        throw new Error(
          "[SDK][Wallets] – hive engine token or username missed"
        );
      }

      const response = await fetch(
        `${CONFIG.privateApiHost}/private-api/engine-api`,
        {
          method: "POST",
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "find",
            params: {
              account: username,
              symbol,
              limit,
              offset: limit + pageParam,
            },
            id: 1,
          }),
          headers: { "Content-type": "application/json" },
        }
      );
      const data = (await response.json()) satisfies {
        result: GeneralAssetTransaction[];
      };

      return data.result;
    },
  });
}
