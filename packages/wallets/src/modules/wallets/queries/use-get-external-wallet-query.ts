import { CONFIG } from "@ecency/sdk";
import { EcencyWalletCurrency } from "@/modules/wallets/enums";
import { useQuery } from "@tanstack/react-query";

type BalanceQueryDefinition = {
  query: (address: string) => string;
  parse: (data: any) => number | undefined;
  scale: number;
};

const balanceQueryMap: Partial<
  Record<EcencyWalletCurrency, BalanceQueryDefinition>
> = {
  [EcencyWalletCurrency.BTC]: {
    query: (addr) =>
      `{"query":"{ bitcoin { address(address: {is: \"${addr}\"}) { balance } } }"}`,
    parse: (data) => data.bitcoin?.address?.[0]?.balance,
    scale: 1e8,
  },
  [EcencyWalletCurrency.ETH]: {
    query: (addr) =>
      `{"query":"{ ethereum { address(address: {is: \"${addr}\"}) { balance } } }"}`,
    parse: (data) => data.ethereum?.address?.[0]?.balance,
    scale: 1e18,
  },
  [EcencyWalletCurrency.BNB]: {
    query: (addr) =>
      `{"query":"{ ethereum(network: bsc) { address(address: {is: \"${addr}\"}) { balance } } }"}`,
    parse: (data) => data.ethereum?.address?.[0]?.balance,
    scale: 1e18,
  },
  [EcencyWalletCurrency.SOL]: {
    query: (addr) =>
      `{"query":"{ solana { account(address: {is: \"${addr}\"}) { balance } } }"}`,
    parse: (data) => data.solana?.account?.[0]?.balance,
    scale: 1e9,
  },
  [EcencyWalletCurrency.TRON]: {
    query: (addr) =>
      `{"query":"{ tron { address(address: {is: \"${addr}\"}) { balance } } }"}`,
    parse: (data) => data.tron?.address?.[0]?.balance,
    scale: 1e6,
  },
  [EcencyWalletCurrency.TON]: {
    query: (addr) =>
      `{"query":"{ ton { address(address: {is: \"${addr}\"}) { balance } } }"}`,
    parse: (data) => data.ton?.address?.[0]?.balance,
    scale: 1e9,
  },
  [EcencyWalletCurrency.APT]: {
    query: (addr) =>
      `{"query":"{ aptos { address(address: {is: \"${addr}\"}) { balance } } }"}`,
    parse: (data) => data.aptos?.address?.[0]?.balance,
    scale: 1e8,
  },
};

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

interface BscScanResponse {
  status: string;
  result: string; // balance in wei
}

interface AptosLabsResponse {
  type: string; // "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
  data: {
    coin: {
      value: string; // Баланс в микроAPT (нужно делить на 1e8)
    };
  };
}

/**
 * Returns information about the actual balance of the given currency address
 *         using various of public APIs
 * @param currency
 * @param address
 * @returns
 */
interface UseGetExternalWalletBalanceQueryOptions {
  /**
   * When true, Chainstack will be queried before Bitquery and public APIs.
   */
  reverseProviderOrder?: boolean;
}

export function useGetExternalWalletBalanceQuery(
  currency: EcencyWalletCurrency,
  address: string,
  options: UseGetExternalWalletBalanceQueryOptions = {},
) {
  const { reverseProviderOrder = false } = options;

  return useQuery({
    queryKey: ["ecency-wallets", "external-wallet-balance", currency, address],
    queryFn: async () => {
      const fetchGraphqlBalance = async (
        provider: "bitquery" | "chainstack",
      ) => {
        const definition = balanceQueryMap[currency];
        if (!definition) {
          throw new Error(`Unsupported currency for ${provider}`);
        }

        const endpoint =
          provider === "bitquery"
            ? CONFIG.bitqueryApiUrl
            : CONFIG.chainstackApiUrl;

        if (!endpoint) {
          throw new Error(
            provider === "bitquery"
              ? "Bitquery API URL is not configured"
              : "Chainstack API URL is not configured",
          );
        }

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (provider === "bitquery") {
          headers["X-API-KEY"] = CONFIG.bitqueryApiKey || "";
        } else if (CONFIG.chainstackApiKey) {
          headers["X-API-KEY"] = CONFIG.chainstackApiKey;
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers,
          body: definition.query(address),
        });
        if (!response.ok) {
          throw new Error(
            provider === "bitquery"
              ? "Bitquery request failed"
              : "Chainstack request failed",
          );
        }

        const result = (await response.json()) as any;
        const balance = definition.parse(result.data);
        if (typeof balance !== "number") {
          throw new Error(
            provider === "bitquery"
              ? "Bitquery returned invalid balance"
              : "Chainstack returned invalid balance",
          );
        }
        return balance / definition.scale;
      };

      const withFallback = async (primary: () => Promise<number>) => {
        const providers = reverseProviderOrder
          ? [
              () => fetchGraphqlBalance("chainstack"),
              () => fetchGraphqlBalance("bitquery"),
              primary,
            ]
          : [
              primary,
              () => fetchGraphqlBalance("bitquery"),
              () => fetchGraphqlBalance("chainstack"),
            ];

        let lastError: unknown;

        for (const provider of providers) {
          try {
            return await provider();
          } catch (err) {
            lastError = err;
          }
        }

        if (lastError instanceof Error) {
          throw lastError;
        }

        throw new Error("Failed to fetch external wallet balance");
      };

      switch (currency) {
        case EcencyWalletCurrency.BTC:
          return withFallback(async () => {
            const btcResponse = await fetch(
              `https://mempool.space/api/address/${address}`,
            );
            if (!btcResponse.ok) throw new Error("Mempool API request failed");
            const btcResponseData =
              (await btcResponse.json()) as MempoolResponse;
            return (
              (btcResponseData.chain_stats.funded_txo_sum -
                btcResponseData.chain_stats.spent_txo_sum) /
              1e8
            );
          });

        case EcencyWalletCurrency.ETH:
          return withFallback(async () => {
            const ethResponse = await fetch(
              `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`,
            );
            if (!ethResponse.ok)
              throw new Error("Ethplorer API request failed");
            const ethResponseData =
              (await ethResponse.json()) as EthExplorerResponse;
            return +ethResponseData.ETH.balance;
          });

        case EcencyWalletCurrency.BNB:
          return withFallback(async () => {
            const bnbResponse = await fetch(
              `https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`,
            );
            if (!bnbResponse.ok)
              throw new Error("BscScan API request failed");
            const bnbResponseData =
              (await bnbResponse.json()) as BscScanResponse;
            if (bnbResponseData.status !== "1") {
              throw new Error("BscScan API returned an error");
            }

            return parseInt(bnbResponseData.result, 10) / 1e18;
          });

        case EcencyWalletCurrency.SOL:
          return withFallback(async () => {
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
              },
            );
            if (!solResponse.ok) throw new Error("Helius API request failed");
            const solResponseData = (await solResponse.json()) as SolResponse;
            return solResponseData.result.value / 1e9;
          });

        case EcencyWalletCurrency.TRON:
          return withFallback(async () => {
            const tronResponse = await fetch(
              `https://api.trongrid.io/v1/accounts/${address}`,
            );
            if (!tronResponse.ok)
              throw new Error("Trongrid API request failed");
            const tronResponseData =
              (await tronResponse.json()) as TronGridResponse;
            return tronResponseData.data[0].balance / 1e6;
          });

        case EcencyWalletCurrency.TON:
          return withFallback(async () => {
            const tonResponse = await fetch(
              `https://tonapi.io/v1/blockchain/getAccount?account=${address}`,
            );
            if (!tonResponse.ok) throw new Error("Ton API request failed");
            const tonResponseData =
              (await tonResponse.json()) as TonApiResponse;
            return tonResponseData.balance / 1e9;
          });

        case EcencyWalletCurrency.APT:
          return withFallback(async () => {
            const aptResponse = await fetch(
              `https://fullnode.mainnet.aptoslabs.com/v1/accounts/${address}/resources`,
            );
            if (!aptResponse.ok) throw new Error("Aptos API request failed");
            const aptResponseData =
              (await aptResponse.json()) as AptosLabsResponse[];
            const coinStore = aptResponseData.find((resource) =>
              resource.type.includes("coin::CoinStore"),
            );
            if (!coinStore) return 0;

            return parseInt(coinStore.data.coin.value) / 1e8;
          });
        default:
          throw new Error(`Unsupported currency ${currency}`);
      }
    },
  });
}
