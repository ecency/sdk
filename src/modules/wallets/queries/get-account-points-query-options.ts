import { CONFIG } from "@/config";
import { queryOptions } from "@tanstack/react-query";
import { AccountPointsResponse } from "../types";

export function getAccountPointsQueryOptions(
  username?: string,
  filter?: string
) {
  return queryOptions({
    queryKey: ["ecency-wallets", "points", username, filter],
    queryFn: async () => {
      const response = await fetch(
        `${CONFIG.privateApiHost}/private-api/points`,
        {
          method: "POST",
          body: JSON.stringify({
            username: username!.replace("@", ""),
          }),
        }
      );
      return (await response.json()) as AccountPointsResponse;
    },
    staleTime: 30000,
    refetchOnMount: true,
    enabled: !!username,
  });
}
