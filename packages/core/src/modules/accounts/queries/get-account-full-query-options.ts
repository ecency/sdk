import { CONFIG } from "@/modules/core/config";
import { AccountFollowStats, AccountReputation } from "../types";
import { queryOptions } from "@tanstack/react-query";

export function getAccountFullQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["get-account-full", username],
    queryFn: async () => {
      if (!username) {
        throw new Error("[SDK] Username is empty");
      }

      const response = await CONFIG.hiveClient.database.getAccounts([username]);
      if (!response[0]) {
        throw new Error("[SDK] No account with given username");
      }

      const profile = JSON.parse(response[0].posting_json_metadata!).profile;

      let follow_stats: AccountFollowStats | undefined;
      try {
        follow_stats = await CONFIG.hiveClient.database.call(
          "get_follow_count",
          [username]
        );
      } catch (e) {}

      const reputation: AccountReputation[] = await CONFIG.hiveClient.call(
        "condenser_api",
        "get_account_reputations",
        [username, 1]
      );

      return {
        ...response,
        follow_stats,
        reputation: reputation[0].reputation,
        profile: {
          ...profile,
          reputation: reputation[0].reputation,
        },
      };
    },
    enabled: !!username,
    staleTime: 60000,
  });
}
