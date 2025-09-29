import { queryOptions } from "@tanstack/react-query";
import { getAddressFromAccount } from "../common";

interface TronGridResponse {
  data: {
    balance: number; // in santrons
  }[];
}

export function getTronAssetBalanceQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["assets", "tron", "balance", username],
    queryFn: async () => {
      const address = await getAddressFromAccount(username, "TRX");

      const tronResponse = await fetch(
        `https://api.trongrid.io/v1/accounts/${address}`
      );
      if (!tronResponse.ok) throw new Error("Trongrid API request failed");
      const tronResponseData = (await tronResponse.json()) as TronGridResponse;
      return tronResponseData.data[0].balance / 1e6;
    },
  });
}
