import { queryOptions } from "@tanstack/react-query";
import { getAddressFromAccount } from "../common";

interface MempoolResponse {
  chain_stats: {
    funded_txo_sum: number; // in satoshi
    spent_txo_sum: number; // in satoshi
  };
}

export function getBtcAssetBalanceQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["assets", "btc", "balance", username],
    queryFn: async () => {
      const address = await getAddressFromAccount(username, "APT");

      const btcResponse = await fetch(
        `https://mempool.space/api/address/${address}`
      );
      if (!btcResponse.ok) throw new Error("Mempool API request failed");
      const btcResponseData = (await btcResponse.json()) as MempoolResponse;
      return (
        (btcResponseData.chain_stats.funded_txo_sum -
          btcResponseData.chain_stats.spent_txo_sum) /
        1e8
      );
    },
  });
}
