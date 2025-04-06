import { useBroadcastMutation } from "@/modules/core";

export function useAccountUpdate(username: string) {
  return useBroadcastMutation(
    ["accounts", "update"],
    username,
    (newProfile: any) => {
      return [
        [
          "account_update2",
          {
            account: username,
            json_metadata: "",
            posting_json_metadata: JSON.stringify({
              profile: { ...newProfile, version: 2 },
            }),
            extensions: [],
          },
        ],
      ];
    }
  );
}
