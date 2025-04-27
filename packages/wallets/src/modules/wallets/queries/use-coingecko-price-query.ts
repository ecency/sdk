import { EcencyWalletCurrency } from "@/modules/wallets/enums";
import { useQuery } from "@tanstack/react-query";
import { LRUCache } from "lru-cache";

const options = {
  max: 500,
  // how long to live in ms
  ttl: 1000 * 60 * 5,
  // return stale items before removing from cache?
  allowStale: false,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
};

const cache = new LRUCache(options);
const undefinedValue = Symbol("undefined");

const cacheSet = (key: string, value: any) =>
  cache.set(key, value === undefined ? undefinedValue : value);

const cacheGet = (key: string) => {
  const v = cache.get(key);
  return v === undefinedValue ? undefined : v;
};

interface CoinGeckoApiResponse {
  [key: string]: {
    [vsKey: string]: number;
  };
}

export function useCoinGeckoPriceQuery(currency?: EcencyWalletCurrency) {
  return useQuery({
    queryKey: ["ecency-wallets", "coingecko-price", currency],
    queryFn: async () => {
      let curr = currency as string;
      switch (currency) {
        case EcencyWalletCurrency.BTC:
          curr = "binance-wrapped-btc";
          break;
        case EcencyWalletCurrency.ETH:
          curr = "ethereum";
          break;
        case EcencyWalletCurrency.SOL:
          curr = "solana";
          break;
        case EcencyWalletCurrency.TON:
          curr = "trx";
          break;
        default:
          curr = currency as string;
      }

      let rate = cacheGet("gecko");
      let response;
      if (rate) {
        response = rate as CoinGeckoApiResponse;
      } else {
        const httpResponse = await fetch(
          "https://api.coingecko.com/api/v3/simple/price",
          {
            method: "POST",
            body: JSON.stringify({
              params: {
                ids: [curr],
                vs_currencies: "usd",
              },
            }),
          }
        );
        const data = (await httpResponse.json()) as CoinGeckoApiResponse;
        cacheSet("gecko", data === undefined ? undefinedValue : data);

        response = data;
      }

      const rateValue = +response[Object.keys(response)[0]].usd;
      return 1 / rateValue;
    },
    enabled: !!currency,
  });
}
