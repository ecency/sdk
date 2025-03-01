import { useMutation } from "@tanstack/react-query";
import base58 from "bs58";
import { cryptoUtils, PrivateKey } from "@hiveio/dhive";
import { EcencyHiveKeys } from "@/types";

function random() {
  return Math.random().toString(36).substring(7);
}

export function useCreateAccountKeys(username: string) {
  return useMutation({
    mutationKey: ["ecency", "create-hive-keys", username],
    mutationFn: async () => {
      const wif = "P" + base58.encode(cryptoUtils.sha256(random()));

      const ownerKey = PrivateKey.fromLogin(username, wif, "owner");
      const activeKey = PrivateKey.fromLogin(username, wif, "active");
      const postingKey = PrivateKey.fromLogin(username, wif, "posting");
      const memoKey = PrivateKey.fromLogin(username, wif, "memo");

      return {
        username,
        owner: ownerKey.toString(),
        active: activeKey.toString(),
        posting: postingKey.toString(),
        memo: memoKey.toString(),
        masterPassword: wif,
        ownerPubkey: ownerKey.createPublic().toString(),
        activePubkey: activeKey.createPublic().toString(),
        postingPubkey: postingKey.createPublic().toString(),
        memoPubkey: memoKey.createPublic().toString(),
      } as EcencyHiveKeys;
    },
  });
}
