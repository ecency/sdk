import {
  AssetOperation,
  getHiveEngineTokensBalancesQueryOptions,
  HiveEngineTokenMetadataResponse,
} from "@/modules/assets";
import { getQueryClient } from "@ecency/sdk";
import { queryOptions } from "@tanstack/react-query";
import { EcencyWalletBasicTokens } from "../enums";

export function getTokenOperationsQueryOptions(
  token: string,
  username: string,
  isForOwner = false
) {
  return queryOptions({
    queryKey: ["wallets", "token-operations", token, username, isForOwner],
    queryFn: async () => {
      switch (token) {
        case EcencyWalletBasicTokens.Hive:
          return [
            AssetOperation.Transfer,
            ...(isForOwner
              ? [
                  AssetOperation.TransferToSavings,
                  AssetOperation.PowerUp,
                  AssetOperation.Swap,
                ]
              : []),
          ];
        case EcencyWalletBasicTokens.HivePower:
          return [
            AssetOperation.Delegate,
            ...(isForOwner
              ? [AssetOperation.PowerDown, AssetOperation.WithdrawRoutes]
              : [AssetOperation.PowerUp]),
          ];
        case EcencyWalletBasicTokens.HiveDollar:
          return [
            AssetOperation.Transfer,
            ...(isForOwner
              ? [AssetOperation.TransferToSavings, AssetOperation.Swap]
              : []),
          ];
        case EcencyWalletBasicTokens.Points:
          return [
            AssetOperation.Gift,
            ...(isForOwner
              ? [
                  AssetOperation.Promote,
                  AssetOperation.Claim,
                  AssetOperation.Buy,
                ]
              : []),
          ];
        case EcencyWalletBasicTokens.Spk:
          return [AssetOperation.Transfer];
        case "LARYNX":
          return [
            AssetOperation.Transfer,
            ...(isForOwner
              ? [AssetOperation.PowerUp, AssetOperation.LockLiquidity]
              : []),
          ];
        case "LP":
          return [
            AssetOperation.Delegate,
            ...(isForOwner ? [AssetOperation.PowerDown] : []),
          ];
      }

      const marketQuery = getHiveEngineTokensBalancesQueryOptions(username);
      await getQueryClient().prefetchQuery(marketQuery);
      const marketList = getQueryClient().getQueryData<
        HiveEngineTokenMetadataResponse[]
      >(marketQuery.queryKey);

      const tokenInfo = marketList?.find((m) => m.symbol === token);
      return [
        AssetOperation.Transfer,
        ...(isForOwner && tokenInfo?.delegationEnabled
          ? [AssetOperation.Delegate]
          : []),
        ...(isForOwner && tokenInfo?.stakingEnabled
          ? [AssetOperation.Stake, AssetOperation.Unstake]
          : []),
      ];
    },
  });
}
