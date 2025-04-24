import { useQuery } from "@tanstack/react-query";
import { EcencyWalletBasicTokens } from "../enums";

export function useGetAccountWalletListQuery(username: string) {
  return useQuery({
    queryKey: ["ecency-wallets", "list", username],
    queryFn: () => {
      const basicTokensList = [
        EcencyWalletBasicTokens.Points,
        EcencyWalletBasicTokens.Hive,
        EcencyWalletBasicTokens.HivePower,
        EcencyWalletBasicTokens.HiveDollar,
        EcencyWalletBasicTokens.Leo,
        EcencyWalletBasicTokens.Spk,
      ];
      return basicTokensList;
    },
  });
}
