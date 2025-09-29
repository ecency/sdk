import { queryOptions } from "@tanstack/react-query";
import { getAddressFromAccount } from "../common";

interface AtomResponse {
  result: {
    value: {
      coins: {
        amount: number | string; // in microATOMs
      }[];
    };
  };
}

export function getAtomAssetBalanceQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["assets", "atom", "balance", username],
    queryFn: async () => {
      const address = await getAddressFromAccount(username, "ATOM");

      const atomResponse = await fetch(
        `https://rest.cosmos.directory/cosmoshub/auth/accounts/${address}`
      );
      if (!atomResponse.ok) throw new Error("Cosmos API request failed");
      const atomResponseData = (await atomResponse.json()) as AtomResponse;
      return +atomResponseData.result.value.coins[0].amount / 1e6;
    },
  });
}
