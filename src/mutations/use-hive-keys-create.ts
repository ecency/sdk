import { useMutation } from "@tanstack/react-query";
import { PrivateKey } from "@hiveio/dhive";
import { EcencyHiveKeys } from "@/types";
import { useSeedPhrase } from "@/queries";

export function useCreateAccountKeys(username: string) {
  const { data: mnemonic } = useSeedPhrase();

  return useMutation({
    mutationKey: ["ecency", "create-hive-keys", username],
    mutationFn: async () => {
      if (!mnemonic) {
        throw new Error("[Ecency][Wallets] - no seed to create Hive account");
      }

      const ownerKey = PrivateKey.fromLogin(username, mnemonic, "owner");
      const activeKey = PrivateKey.fromLogin(username, mnemonic, "active");
      const postingKey = PrivateKey.fromLogin(username, mnemonic, "posting");
      const memoKey = PrivateKey.fromLogin(username, mnemonic, "memo");

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
