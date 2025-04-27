import { queryOptions } from "@tanstack/react-query";
import { EcencyWalletBasicTokens } from "../enums";

export function getAccountWalletListQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["ecency-wallets", "list", username],
    queryFn: () => {
      const basicTokensList = [
        EcencyWalletBasicTokens.Points,
        EcencyWalletBasicTokens.Hive,
        EcencyWalletBasicTokens.HivePower,
        EcencyWalletBasicTokens.HiveDollar,
        EcencyWalletBasicTokens.Spk,
      ];
      return basicTokensList;
    },
  });
}
