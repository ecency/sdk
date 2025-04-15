import { Operation } from "@hiveio/dhive";
import { useMutation } from "@tanstack/react-query";
import hs from "hivesigner";

export function useSignOperationByHivesigner(callbackUri = "/") {
  useMutation({
    mutationKey: ["operations", "sign-hivesigner", callbackUri],
    mutationFn: async ({ operation }: { operation: Operation }) => {
      return hs.sendOperation(operation, { callback: callbackUri }, () => {});
    },
  });
}
