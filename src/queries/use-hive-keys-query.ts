import { useQuery } from "@tanstack/react-query";
import { useSeedPhrase } from "./use-seed-phrase";
import { PrivateKey } from "@hiveio/dhive";
import { EcencyHiveKeys } from "@/types";
import { mnemonicToSeed } from "bip39";

export function useHiveKeysQuery(username: string) {
  const { data: mnemonic } = useSeedPhrase();

  return useQuery({
    queryKey: [
      "ecenc-wallets",
      "hive-keys",
      username,
      mnemonicToSeed(mnemonic ?? ""),
    ],
    queryFn: async () => {
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
        ownerPubkey: ownerKey.createPublic().toString(),
        activePubkey: activeKey.createPublic().toString(),
        postingPubkey: postingKey.createPublic().toString(),
        memoPubkey: memoKey.createPublic().toString(),
      } as EcencyHiveKeys;
    },
  });
}
