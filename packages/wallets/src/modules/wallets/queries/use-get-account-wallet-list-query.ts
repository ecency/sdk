import { queryOptions } from "@tanstack/react-query";
import { EcencyWalletBasicTokens } from "../enums";
import { CONFIG } from "@ecency/sdk";

export function getAccountWalletListQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["ecency-wallets", "list", username],
    enabled: !!username,
    queryFn: async () => {
      const list = CONFIG.storage.getItem(
        CONFIG.storagePrefix + "_wallet_assets_list"
      );
      if (list) {
        return JSON.parse(list);
      } else {
        return [
          EcencyWalletBasicTokens.Points,
          EcencyWalletBasicTokens.Hive,
          EcencyWalletBasicTokens.HivePower,
          EcencyWalletBasicTokens.HiveDollar,
          EcencyWalletBasicTokens.Spk,
        ];
      }
    },
  });
}
