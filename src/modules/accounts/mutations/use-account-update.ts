import { useBroadcastMutation } from "@/modules/core";

export function useAccountUpdate(username: string) {
  return useBroadcastMutation(
    ["accounts", "update"],
    username,
    ({
      profile,
      tokens,
    }: {
      profile: Record<string, any>;
      tokens: { symbol: string; meta: { address: string } }[];
    }) => {
      return [
        [
          "account_update2",
          {
            account: username,
            json_metadata: "",
            posting_json_metadata: JSON.stringify({
              profile: { ...profile, version: 2 },
              tokens,
            }),
            extensions: [],
          },
        ],
      ];
    }
  );
}
