import { queryOptions } from "@tanstack/react-query";
import { getAddressFromAccount } from "../common";

interface EthExplorerResponse {
  ETH: {
    balance: number;
  };
}

export function getEthAssetBalanceQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["assets", "eth", "balance", username],
    queryFn: async () => {
      const address = await getAddressFromAccount(username, "ETH");

      const ethResponse = await fetch(
        `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`
      );
      if (!ethResponse.ok) throw new Error("Ethplorer API request failed");
      const ethResponseData = (await ethResponse.json()) as EthExplorerResponse;
      return +ethResponseData.ETH.balance;
    },
  });
}
