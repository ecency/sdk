import { getHiveEngineTokensMetadataQueryOptions } from "@/modules/assets";
import { HiveEngineTokenMetadataResponse } from "@/modules/assets/hive-engine/types";
import { getQueryClient } from "@ecency/sdk";
import { queryOptions } from "@tanstack/react-query";
import { EcencyWalletBasicTokens, EcencyWalletCurrency } from "../enums";
import { HiveEngineTokens } from "../consts";

export function getAllTokensListQueryOptions(query: string) {
  return queryOptions({
    queryKey: ["ecency-wallets", "all-tokens-list", query],
    queryFn: async () => {
      await getQueryClient().prefetchQuery(
        getHiveEngineTokensMetadataQueryOptions(HiveEngineTokens)
      );

      const metadataList = getQueryClient().getQueryData<
        HiveEngineTokenMetadataResponse[]
      >(getHiveEngineTokensMetadataQueryOptions(HiveEngineTokens).queryKey);

      return {
        basic: [
          EcencyWalletBasicTokens.Points,
          EcencyWalletBasicTokens.Hive,
          EcencyWalletBasicTokens.HivePower,
          EcencyWalletBasicTokens.HiveDollar,
          EcencyWalletBasicTokens.Spk,
          "LARYNX",
          "LP",
        ].filter((token) => token.toLowerCase().includes(query.toLowerCase())),
        external: Object.values(EcencyWalletCurrency).filter((token) =>
          token.toLowerCase().includes(query.toLowerCase())
        ),
        layer2: metadataList,
      };
    },
  });
}
