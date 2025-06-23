import { CONFIG, getQueryClient } from "@ecency/sdk";
import { useMutation } from "@tanstack/react-query";
import { getAccountWalletListQueryOptions } from "../queries";

export function useChangeAssetsList(username: string) {
  return useMutation({
    mutationKey: ["wallets", "assets-list", username],
    mutationFn: async (list: string[]) => {
      CONFIG.storage.setItem(
        CONFIG.storagePrefix + "_wallet_assets_list",
        JSON.stringify(list)
      );
      return list;
    },
    onSuccess() {
      getQueryClient().invalidateQueries({
        queryKey: getAccountWalletListQueryOptions(username).queryKey,
      });
    },
  });
}
