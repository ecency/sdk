import { useQuery } from "@tanstack/react-query";
import { useSeedPhrase } from "./use-seed-phrase";
import { EcencyHiveKeys } from "@/modules/wallets/types";
import { deriveHiveKeys } from "@/modules/wallets/utils";

export function useHiveKeysQuery(username: string) {
  const { data: seed } = useSeedPhrase(username);

  return useQuery({
    queryKey: ["ecencу-wallets", "hive-keys", username, seed],
    staleTime: Infinity,
    queryFn: async () => {
      if (!seed) {
        throw new Error("[Ecency][Wallets] - no seed to create Hive account");
      }

      const keys = deriveHiveKeys(seed);

      return {
        username,
        ...keys,
      } as EcencyHiveKeys;
    },
  });
}
