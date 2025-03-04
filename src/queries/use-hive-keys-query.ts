import { useQuery } from "@tanstack/react-query";
import { useSeedPhrase } from "./use-seed-phrase";
import { PrivateKey } from "@hiveio/dhive";
import { EcencyHiveKeys } from "@/types";
import { mnemonicToSeedSync } from "bip39";
import { useMemo } from "react";

export function useHiveKeysQuery(username: string) {
  const { data: mnemonic } = useSeedPhrase();

  const seed = useMemo(
    () => mnemonicToSeedSync(mnemonic ?? "").toString("hex"),
    [mnemonic]
  );

  return useQuery({
    queryKey: ["ecencу-wallets", "hive-keys", username, seed],
    queryFn: async () => {
      if (!mnemonic) {
        throw new Error("[Ecency][Wallets] - no seed to create Hive account");
      }

      const ownerKey = PrivateKey.fromSeed(seed + "owner");
      const activeKey = PrivateKey.fromSeed(seed + "active");
      const postingKey = PrivateKey.fromSeed(seed + "posting");
      const memoKey = PrivateKey.fromSeed(seed + "memo");

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
