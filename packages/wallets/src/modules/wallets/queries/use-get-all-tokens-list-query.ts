import { getHiveEngineTokensListQueryOptions } from "@ecency/sdk";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { EcencyWalletBasicTokens, EcencyWalletCurrency } from "../enums";

export function useGetAllTokensListQuery(query: string) {
  const { data } = useQuery(getHiveEngineTokensListQueryOptions());

  return useMemo(
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
