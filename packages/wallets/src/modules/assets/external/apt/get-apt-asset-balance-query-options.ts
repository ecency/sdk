import { queryOptions } from "@tanstack/react-query";
import { getAddressFromAccount } from "../common";

interface AptosLabsResponse {
  type: string; // "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
  data: {
    coin: {
      value: string; // Баланс в микроAPT (нужно делить на 1e8)
    };
  };
}

export function getAptAssetBalanceQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["assets", "apt", "balance", username],
    queryFn: async () => {
      const address = await getAddressFromAccount(username, "APT");

      const aptResponse = await fetch(
        `https://fullnode.mainnet.aptoslabs.com/v1/accounts/${address}/resources`
      );
      if (!aptResponse.ok) throw new Error("Aptos API request failed");
      const aptResponseData = (await aptResponse.json()) as AptosLabsResponse[];
      const coinStore = aptResponseData.find((resource) =>
        resource.type.includes("coin::CoinStore")
      );
      if (!coinStore) return 0;

      return parseInt(coinStore.data.coin.value) / 1e8;
    },
  });
}
