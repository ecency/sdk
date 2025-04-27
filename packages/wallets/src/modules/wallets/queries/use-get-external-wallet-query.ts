import { CONFIG } from "@ecency/sdk";
import { EcencyWalletCurrency } from "@/modules/wallets/enums";
import { useQuery } from "@tanstack/react-query";

interface MempoolResponse {
  chain_stats: {
    funded_txo_sum: number; // in satoshi
    spent_txo_sum: number; // in satoshi
  };
}

interface EthExplorerResponse {
  ETH: {
    balance: number;
  };
}

interface SolResponse {
  result: {
    value: number; // in lamports
  };
}

interface TronGridResponse {
  data: {
    balance: number; // in santrons
  }[];
}

interface TonApiResponse {
  balance: number; // in nanotons
}

interface AptosLabsResponse {
  type: string; // "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
  data: {
    coin: {
      value: string; // Баланс в микроAPT (нужно делить на 1e8)
    };
  };
}

interface AtomResponse {
  result: {
    value: {
      coins: {
        amount: number | string; // in microATOMs
      }[];
    };
  };
}

/**
 * Returns information about the actual balance of the given currency address
 *         using various of public APIs
 * todo extract URLs to configs
 * @param currency
 * @param address
 * @returns
 */
export function useGetExternalWalletBalanceQuery(
  currency: EcencyWalletCurrency,
  address: string
) {
  return useQuery({
    queryKey: ["ecency-wallets", "external-wallet-balance", currency, address],
    queryFn: async () => {
      switch (currency) {
        case EcencyWalletCurrency.BTC:
          const btcResponse = await fetch(
            `https://mempool.space/api/address/${address}`
          );
          const btcResponseData = (await btcResponse.json()) as MempoolResponse;
          return (
            (btcResponseData.chain_stats.funded_txo_sum -
              btcResponseData.chain_stats.spent_txo_sum) /
            1e8
          );

        case EcencyWalletCurrency.ETH:
          const ethResponse = await fetch(
            `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`
          );
          const ethResponseData =
            (await ethResponse.json()) as EthExplorerResponse;
          return +ethResponseData.ETH.balance;

        case EcencyWalletCurrency.SOL:
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
          const solResponseData = (await solResponse.json()) as SolResponse;
          return solResponseData.result.value / 1e9;

        case EcencyWalletCurrency.TRON:
          const tronResponse = await fetch(
            `https://api.trongrid.io/v1/accounts/${address}`
          );
          const tronResponseData =
            (await tronResponse.json()) as TronGridResponse;
          return tronResponseData.data[0].balance / 1e6;

        case EcencyWalletCurrency.TON:
          const tonResponse = await fetch(
            `https://tonapi.io/v1/blockchain/getAccount?account=${address}`
          );
          const tonResponseData = (await tonResponse.json()) as TonApiResponse;
          return tonResponseData.balance / 1e9;

        case EcencyWalletCurrency.APT:
          const aptResponse = await fetch(
            `https://fullnode.mainnet.aptoslabs.com/v1/accounts/${address}/resources`
          );
          const aptResponseData =
            (await aptResponse.json()) as AptosLabsResponse[];
          const coinStore = aptResponseData.find((resource) =>
            resource.type.includes("coin::CoinStore")
          );
          if (!coinStore) return 0;

          return parseInt(coinStore.data.coin.value) / 1e8;

        case EcencyWalletCurrency.ATOM:
          const atomResponse = await fetch(
            `https://rest.cosmos.directory/cosmoshub/auth/accounts/${address}`
          );
          const atomResponseData = (await atomResponse.json()) as AtomResponse;
          return +atomResponseData.result.value.coins[0].amount / 1e6;
      }
    },
  });
}
