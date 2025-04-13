import { useBroadcastMutation } from "@/modules/core";
import { Operation } from "@hiveio/dhive";

export function useSignOperation(username: string | undefined) {
  return useBroadcastMutation(
    ["operations", "sign"],
    username,
    (op: Operation) => [op]
  );
}
