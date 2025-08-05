import { CONFIG } from "@ecency/sdk";
import { PrivateKey } from "@hiveio/dhive";
import hs from "hivesigner";
import { HiveBasedAssetSignType } from "../../types";

export interface TransferPayload<T extends HiveBasedAssetSignType> {
  from: string;
  to: string;
  amount: string;
  memo: string;
  type: T;
}

export async function transferHive<T extends HiveBasedAssetSignType>(
  payload: T extends "key"
    ? TransferPayload<T> & { key: PrivateKey }
    : TransferPayload<T>
) {
  if (payload.type === "key" && "key" in payload) {
    const { key, type, ...params } = payload;
    return CONFIG.hiveClient.broadcast.transfer(params, key);
  } else if (payload.type === "keychain") {
    return new Promise((resolve, reject) =>
      (window as any).hive_keychain?.requestTransfer(
        payload.from,
        payload.to,
        payload.amount,
        payload.memo,
        "HIVE",
        (resp: { success: boolean }) => {
          if (!resp.success) {
            reject({ message: "Operation cancelled" });
          }

          resolve(resp);
        },
        true,
        null
      )
    );
  } else {
    return hs.sendOperation(
      ["transfer", payload],
      { callback: `https://ecency.com/@${payload.from}/wallet` },
      () => {}
    );
  }
}
