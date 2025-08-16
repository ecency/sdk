import { useBroadcastMutation } from "@/modules/core";
import { useQuery } from "@tanstack/react-query";
import { getAccountFullQueryOptions } from "../queries";
import { AccountProfile } from "../types";

interface Payload {
  profile: Partial<AccountProfile>;
  tokens: { symbol: string; meta: { address: string } }[];
}

export function useAccountUpdate(username: string) {
  const { data } = useQuery(getAccountFullQueryOptions(username));

  return useBroadcastMutation(
    ["accounts", "update", data],
    username,
    ({ profile, tokens }: Partial<Payload>) => {
      const metadata = {
        ...JSON.parse(data?.posting_json_metadata || "{}"),
        profile: { ...data?.profile, ...profile, version: 2 },
      };

      if (tokens && tokens.length > 0) {
        metadata.tokens = tokens;
      }

      return [
        [
          "account_update2",
          {
            account: username,
            posting_json_metadata: JSON.stringify(metadata),
          },
        ],
      ];
    }
  );
}
