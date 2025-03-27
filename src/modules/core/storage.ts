import { CONFIG } from "@/config";
import { StoringUser } from "./entities";
import { decodeObj } from "./utils";

export const getUser = (username: string): StoringUser | undefined => {
  try {
    const raw = CONFIG.storage.getItem(
      CONFIG.storagePrefix + "_user_" + username
    );
    return decodeObj(raw) as StoringUser;
  } catch (e) {
    return undefined;
  }
};

export const getAccessToken = (username: string): string | undefined =>
  getUser(username) && getUser(username)!.accessToken;

export const getPostingKey = (username: string): null | undefined | string =>
  getUser(username) && getUser(username)!.postingKey;

export const getRefreshToken = (username: string): string | undefined =>
  getUser(username) && getUser(username)!.refreshToken;
