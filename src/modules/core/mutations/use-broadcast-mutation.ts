import { useMutation } from "@tanstack/react-query";
import { getAccessToken, getPostingKey } from "../storage";
import { Operation, PrivateKey } from "@hiveio/dhive";
import { CONFIG } from "@/config";
import hs from "hivesigner";

export function useBroadcastMutation<T>(
  mutationKey: Parameters<typeof useMutation>[0]["mutationKey"] = [],
  username: string,
  operations: (payload: T) => Operation[]
) {
  return useMutation({
    mutationKey: [...mutationKey, username],
    mutationFn: async (payload: T) => {
      const postingKey = getPostingKey(username);
      if (postingKey) {
        const privateKey = PrivateKey.fromString(postingKey);

        return CONFIG.hiveClient.broadcast.sendOperations(
          operations(payload),
          privateKey
        );
      }

      // With hivesigner access token
      let token = getAccessToken(username);
      if (token) {
        const response = await new hs.Client({
          accessToken: token,
        }).broadcast(operations(payload));
        return response.result;
      }

      throw new Error(
        "[SDK][Broadcast] – cannot broadcast w/o posting key or token"
      );
    },
  });
}
