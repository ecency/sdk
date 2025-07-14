import {
  GeneralAssetTransaction,
  getPointsAssetTransactionsQueryOptions,
} from "@/modules/assets";
import { getQueryClient } from "@ecency/sdk";
import { queryOptions } from "@tanstack/react-query";
import { HiveEngineTokens } from "../consts";

export function getAccountAssetTransactionsQueryOptions(
  username: string,
  asset: string
) {
  return queryOptions({
    queryKey: ["ecency-wallets", "transactions", username, asset],
    queryFn: async () => {
      if (asset === "HIVE") {
        return [];
      } else if (asset === "HP") {
        return [];
      } else if (asset === "HBD") {
        return [];
      } else if (asset === "SPK") {
        return [];
      } else if (asset === "LARYNX") {
        return [];
      } else if (asset === "LP") {
        return [];
      } else if (asset === "POINTS") {
        const query = getPointsAssetTransactionsQueryOptions(username);
        await getQueryClient().prefetchQuery(query);
        return getQueryClient().getQueryData<GeneralAssetTransaction[]>(
          query.queryKey
        );
      } else if (HiveEngineTokens.includes(asset)) {
        return [];
      } else {
        throw new Error(
          "[SDK][Wallets] – has requested unrecognized asset info"
        );
      }
    },
  });
}
