import { getHiveEngineTokensListQueryOptions } from "@/modules/hive-engine";
import { useCallback } from "react";
import { EcencyWalletBasicTokens, EcencyWalletCurrency } from "../enums";
import { useQuery } from "@tanstack/react-query";

export function useGetAllTokensListQuery(query: string) {
  const { data } = useQuery(getHiveEngineTokensListQueryOptions());

  return useCallback(
    () => ({
      basic: [
        EcencyWalletBasicTokens.Points,
        EcencyWalletBasicTokens.Hive,
        EcencyWalletBasicTokens.HivePower,
        EcencyWalletBasicTokens.HiveDollar,
        EcencyWalletBasicTokens.Spk,
      ].filter((token) => token.toLowerCase().includes(query.toLowerCase())),
      external: Object.values(EcencyWalletCurrency).filter((token) =>
        token.toLowerCase().includes(query.toLowerCase())
      ),
      layer2:
        data
          ?.map(({ symbol }) => symbol)
          ?.filter((token) =>
            token.toLowerCase().includes(query.toLowerCase())
          ) ?? [],
    }),
    [data, query]
  );
}
