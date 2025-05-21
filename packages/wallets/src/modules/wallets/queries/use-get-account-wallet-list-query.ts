import { queryOptions } from "@tanstack/react-query";
import {
  GeneralAssetInfo,
  getHiveAssetGeneralInfoQueryOptions,
  getHivePowerAssetGeneralInfoQueryOptions,
} from "@/modules/assets";
import { getQueryClient } from "@ecency/sdk";
import { getHbdAssetGeneralInfoQueryOptions } from "@/modules/assets/hive/queries/get-hbd-asset-general-info-query-options";

export function getAccountWalletListQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["ecency-wallets", "list", username],
    enabled: !!username,
    queryFn: async () => {
      await getQueryClient().prefetchQuery(
        getHiveAssetGeneralInfoQueryOptions(username)
      );
      await getQueryClient().prefetchQuery(
        getHivePowerAssetGeneralInfoQueryOptions(username)
      );
      await getQueryClient().prefetchQuery(
        getHbdAssetGeneralInfoQueryOptions(username)
      );

      return [
        getQueryClient().getQueryData<GeneralAssetInfo>(
          getHiveAssetGeneralInfoQueryOptions(username).queryKey
        ),
        getQueryClient().getQueryData<GeneralAssetInfo>(
          getHivePowerAssetGeneralInfoQueryOptions(username).queryKey
        ),
        getQueryClient().getQueryData<GeneralAssetInfo>(
          getHbdAssetGeneralInfoQueryOptions(username).queryKey
        ),
      ].filter((i) => !!i) satisfies GeneralAssetInfo[];
    },
  });
}
