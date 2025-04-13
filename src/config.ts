import { Client } from "@hiveio/dhive";

export const CONFIG = {
  privateApiHost: "https://ecency.com",
  storage: localStorage,
  storagePrefix: "ecency",
  hiveClient: new Client(
    [
      "https://api.hive.blog",
      "https://api.deathwing.me",
      "https://rpc.mahdiyari.info",
      "https://api.openhive.network",
      "https://techcoderx.com",
      "https://hive-api.arcange.eu",
      "https://api.syncad.com",
      "https://anyx.io",
      "https://api.c0ff33a.uk",
      "https://hiveapi.actifit.io",
      "https://hive-api.3speak.tv",
    ],
    {
      timeout: 2000,
      failoverThreshold: 2,
      consoleOnFailover: true,
    }
  ),
  heliusApiKey: import.meta.env.VITE_HELIUS_API_KEY,
};
