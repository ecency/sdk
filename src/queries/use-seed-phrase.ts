import { useQuery } from "@tanstack/react-query";
import bip39 from "bip39";

export function useSeedPhrase() {
  return useQuery({
    queryKey: ["ecency-wallets", "seed"],
    queryFn: async () => bip39.generateMnemonic(128),
  });
}
