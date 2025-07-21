import { infiniteQueryOptions } from "@tanstack/react-query";
import { HiveMarketMetric } from "../types";
import { CONFIG } from "@ecency/sdk";
import { addSeconds, formatISO } from "date-fns";

export function getHiveAssetMetricQueryOptions(bucketSeconds = 86_400) {
  return infiniteQueryOptions({
    queryKey: ["assets", "hive", "metrics", bucketSeconds],
    queryFn: async ({ pageParam: [startDate, endDate] }) => {
      const apiData: HiveMarketMetric[] = await CONFIG.hiveClient.call(
        "condenser_api",
        "get_market_history",
        [
          bucketSeconds,
          formatISO(startDate).split("+")[0],
          formatISO(endDate).split("+")[0],
        ]
      );

      return apiData.map(({ hive, non_hive, open }) => ({
        close: non_hive.close / hive.close,
        open: non_hive.open / hive.open,
        low: non_hive.low / hive.low,
        high: non_hive.high / hive.high,
        volume: hive.volume,
        time: new Date(open),
      }));
    },
    initialPageParam: [
      // Fetch at least 8 hours or given interval
      addSeconds(new Date(), -Math.max(100 * bucketSeconds, 28_800)),
      new Date(),
    ],
    getNextPageParam: (_, __, [prevStartDate]) => [
      addSeconds(
        new Date(prevStartDate.getTime()),
        -Math.max(100 * bucketSeconds, 28_800)
      ),
      addSeconds(new Date(prevStartDate.getTime()), -bucketSeconds),
    ],
  });
}
