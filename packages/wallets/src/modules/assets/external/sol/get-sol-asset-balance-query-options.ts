import { CONFIG } from "@ecency/sdk";
import { queryOptions } from "@tanstack/react-query";
import { getAddressFromAccount } from "../common";

interface SolResponse {
  result: {
    value: number; // in lamports
  };
}

export function getSolAssetBalanceQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["assets", "sol", "balance", username],
    queryFn: async () => {
      const address = await getAddressFromAccount(username, "SOL");

      const solResponse = await fetch(
        `https://rpc.helius.xyz/?api-key=${CONFIG.heliusApiKey}`,
        {
          method: "POST",
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "1",
            method: "getBalance",
            params: [address],
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!solResponse.ok) throw new Error("Helius API request failed");
      const solResponseData = (await solResponse.json()) as SolResponse;
      return solResponseData.result.value / 1e9;
    },
  });
}
