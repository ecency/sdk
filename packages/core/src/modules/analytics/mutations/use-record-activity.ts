import { CONFIG } from "@/modules/core";
import { useMutation } from "@tanstack/react-query";

type ActivityType =
  | "post-created"
  | "post-updated"
  | "post-scheduled"
  | "draft-created";

export function useRecordActivity(
  username: string | undefined,
  activityType: ActivityType
) {
  return useMutation({
    mutationKey: ["analytics", activityType],
    mutationFn: async () => {
      if (!activityType) {
        throw new Error("[SDK][Analytics] – no activity type provided");
      }
      await fetch(CONFIG.plausibleHost + "/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: activityType,
          url: window.location.href,
          domain: window.location.host,
          props: {
            username,
          },
        }),
      });
    },
  });
}
