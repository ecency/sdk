import { useBroadcastMutation } from "@/modules/core";
import { useQuery } from "@tanstack/react-query";
import { getAccountFullQueryOptions } from "../queries";

interface Payload {
  profile: Record<string, any>;
  tokens: { symbol: string; meta: { address: string } }[];
  beneficiary: {
    username: string;
    reward: number;
  };
}

export function useAccountUpdate(username: string) {
  const { data } = useQuery(getAccountFullQueryOptions(username));

  return useBroadcastMutation(
    ["accounts", "update", data],
    username,
    ({ profile, tokens, beneficiary }: Partial<Payload>) => {
      return [
        [
          "account_update2",
          {
            account: username,
            json_metadata: "",
            posting_json_metadata: JSON.stringify({
              ...JSON.parse(data?.posting_json_metadata || "{}"),
              profile: { ...profile, version: 2 },
              tokens,

              // See https://docs.ecency.com/communities/default-beneficiary/
              ...(beneficiary
                ? {
                    beneficiary: {
                      account: beneficiary?.username,
                      weight: beneficiary?.reward,
                    },
                  }
                : {}),
            }),
            extensions: [],
          },
        ],
      ];
    }
  );
}
