import { getHiveEngineTokensListQueryOptions } from "@/modules/hive-engine";
import { useCallback } from "react";
import { EcencyWalletBasicTokens, EcencyWalletCurrency } from "../enums";
import { useQuery } from "@tanstack/react-query";

export function useGetAllTokensListQuery() {
  const { data } = useQuery(getHiveEngineTokensListQueryOptions());

  return useCallback(
    () => [
      EcencyWalletBasicTokens.Points,
      EcencyWalletBasicTokens.Hive,
      EcencyWalletBasicTokens.HivePower,
      EcencyWalletBasicTokens.HiveDollar,
      EcencyWalletBasicTokens.Leo,
      EcencyWalletBasicTokens.Spk,
      ...Object.keys(EcencyWalletCurrency),
      ...(data?.map(({ symbol }) => symbol) ?? []),
    ],
    [data]
  );
}
