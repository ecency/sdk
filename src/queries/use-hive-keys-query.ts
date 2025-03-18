import { useQuery } from "@tanstack/react-query";
import { useSeedPhrase } from "./use-seed-phrase";
import { PrivateKey } from "@hiveio/dhive";
import { EcencyHiveKeys } from "@/types";

export function useHiveKeysQuery(username: string) {
  const { data: seed } = useSeedPhrase(username);

  return useQuery({
    queryKey: ["ecencу-wallets", "hive-keys", username, seed],
    queryFn: async () => {
      if (!seed) {
        throw new Error("[Ecency][Wallets] - no seed to create Hive account");
      }

      const ownerKey = PrivateKey.fromLogin(username, seed, "owner");
      const activeKey = PrivateKey.fromLogin(username, seed, "active");
      const postingKey = PrivateKey.fromLogin(username, seed, "posting");
      const memoKey = PrivateKey.fromLogin(username, seed, "memo");

      return {
        username,
        owner: ownerKey.toString(),
        active: activeKey.toString(),
        posting: postingKey.toString(),
        memo: memoKey.toString(),
        ownerPubkey: ownerKey.createPublic().toString(),
        activePubkey: activeKey.createPublic().toString(),
        postingPubkey: postingKey.createPublic().toString(),
        memoPubkey: memoKey.createPublic().toString(),
      } as EcencyHiveKeys;
    },
  });
}
