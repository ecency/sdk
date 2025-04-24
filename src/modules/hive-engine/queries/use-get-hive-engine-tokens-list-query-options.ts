import { CONFIG } from "@/config";
import { queryOptions } from "@tanstack/react-query";
import { HiveEngineListResponse } from "../types";

export function getHiveEngineTokensListQueryOptions(
  username?: string,
  symbol?: string
) {
  return queryOptions({
    queryKey: ["hive-engine", "tokens-list", username, symbol],
    queryFn: async () => {
      const response = await fetch(
        `${CONFIG.privateApiHost}/private-api/engine-api`,
        {
          method: "POST",
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "find",
            params: {
              contract: "market",
              table: "metrics",
              query: {
                symbol: symbol,
                account: username,
              },
            },
            id: 1,
          }),
          headers: { "Content-type": "application/json" },
        }
      );
      const data = (await response.json()) as HiveEngineListResponse;
      return data.result;
    },
  });
}
