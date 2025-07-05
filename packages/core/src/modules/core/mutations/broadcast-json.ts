import { CONFIG } from "@/modules/core/config";
import { PrivateKey } from "@hiveio/dhive";
import hs from "hivesigner";
import { getAccessToken, getPostingKey } from "../storage";

export async function broadcastJson<T>(
  username: string | undefined,
  id: string,
  payload: T
) {
  if (!username) {
    throw new Error(
      "[Core][Broadcast] Attempted to call broadcast API with anon user"
    );
  }

  const postingKey = getPostingKey(username);
  if (postingKey) {
    const privateKey = PrivateKey.fromString(postingKey);

    return CONFIG.hiveClient.broadcast.json(
      {
        id,
        required_auths: [],
        required_posting_auths: [username],
        json: JSON.stringify(payload),
      },
      privateKey
    );
  }

  // With hivesigner access token
  let token = getAccessToken(username);
  if (token) {
    const response = await new hs.Client({
      accessToken: token,
    }).customJson([], [username], id, JSON.stringify(payload));
    return response.result;
  }

  throw new Error(
    "[SDK][Broadcast] – cannot broadcast w/o posting key or token"
  );
}
