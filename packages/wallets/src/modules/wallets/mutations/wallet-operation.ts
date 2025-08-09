import {
  AssetOperation,
  delegateHive,
  powerDownHive,
  powerUpHive,
  transferHive,
  transferToSavingsHive,
  withdrawVestingRouteHive,
} from "@/modules/assets";
import { EcencyAnalytics } from "@ecency/sdk";
import { useMutation } from "@tanstack/react-query";

const operationToFunctionMap: Record<
  string,
  Partial<Record<AssetOperation, any>>
> = {
  HIVE: {
    [AssetOperation.Transfer]: transferHive,
    [AssetOperation.TransferToSavings]: transferToSavingsHive,
    [AssetOperation.PowerUp]: powerUpHive,
  },
  HP: {
    [AssetOperation.PowerDown]: powerDownHive,
    [AssetOperation.Delegate]: delegateHive,
    [AssetOperation.WithdrawRoutes]: withdrawVestingRouteHive,
  },
};

export function useWalletOperation(
  username: string,
  asset: string,
  operation: AssetOperation
) {
  const { mutateAsync: recordActivity } = EcencyAnalytics.useRecordActivity(
    username,
    operation as any
  );

  return useMutation({
    mutationKey: ["ecency-wallets", asset, operation],
    mutationFn: async (payload: Record<string, unknown>) => {
      if (asset !== "HIVE") {
        throw new Error(`Unsupported asset: ${asset}`);
      }

      const operationFn = operationToFunctionMap[asset][operation];
      if (!operationFn) {
        throw new Error(`Unsupported operation: ${operation}`);
      }

      return operationFn(payload);
    },
    onSuccess: () => {
      recordActivity();
    },
  });
}
