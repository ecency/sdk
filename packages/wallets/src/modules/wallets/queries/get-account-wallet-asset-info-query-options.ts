import {
  GeneralAssetInfo,
  getHbdAssetGeneralInfoQueryOptions,
  getHiveAssetGeneralInfoQueryOptions,
  getHivePowerAssetGeneralInfoQueryOptions,
  getLarynxAssetGeneralInfoQueryOptions,
  getSpkAssetGeneralInfoQueryOptions,
} from "@/modules/assets";
import { getLarynxPowerAssetGeneralInfoQueryOptions } from "@/modules/assets/spk/queries/get-larynx-power-asset-general-info-query-options";
import { getQueryClient } from "@ecency/sdk";
import { queryOptions } from "@tanstack/react-query";

export function getAccountWalletAssetInfoQueryOptions(
  username: string,
  asset: string
) {
  return queryOptions({
    queryKey: ["ecency-wallets", "asset-info", username, asset],
    queryFn: async () => {
      if (asset === "HIVE") {
        await getQueryClient().prefetchQuery(
          getHiveAssetGeneralInfoQueryOptions(username)
        );
        return getQueryClient().getQueryData<GeneralAssetInfo>(
          getHiveAssetGeneralInfoQueryOptions(username).queryKey
        );
      } else if (asset === "HP") {
        await getQueryClient().prefetchQuery(
          getHivePowerAssetGeneralInfoQueryOptions(username)
        );
        return getQueryClient().getQueryData<GeneralAssetInfo>(
          getHivePowerAssetGeneralInfoQueryOptions(username).queryKey
        );
      } else if (asset === "HBD") {
        await getQueryClient().prefetchQuery(
          getHbdAssetGeneralInfoQueryOptions(username)
        );
        return getQueryClient().getQueryData<GeneralAssetInfo>(
          getHbdAssetGeneralInfoQueryOptions(username).queryKey
        );
      } else if (asset === "SPK") {
        await getQueryClient().prefetchQuery(
          getSpkAssetGeneralInfoQueryOptions(username)
        );
        return getQueryClient().getQueryData<GeneralAssetInfo>(
          getSpkAssetGeneralInfoQueryOptions(username).queryKey
        );
      } else if (asset === "LARYNX") {
        await getQueryClient().prefetchQuery(
          getLarynxAssetGeneralInfoQueryOptions(username)
        );
        return getQueryClient().getQueryData<GeneralAssetInfo>(
          getLarynxAssetGeneralInfoQueryOptions(username).queryKey
        );
      } else if (asset === "LP") {
        await getQueryClient().prefetchQuery(
          getLarynxPowerAssetGeneralInfoQueryOptions(username)
        );
        return getQueryClient().getQueryData<GeneralAssetInfo>(
          getLarynxPowerAssetGeneralInfoQueryOptions(username).queryKey
        );
      } else {
        throw new Error(
          "[SDK][Wallets] – has requested unrecognized asset info"
        );
      }
    },
  });
}
