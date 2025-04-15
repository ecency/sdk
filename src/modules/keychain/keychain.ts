import { Operation } from "@hiveio/dhive";

type KeychainedWindow = {
  hive_keychain?: any;
} & Window;

declare var window: KeychainedWindow;

export type KeychainAuthorityTypes = "Owner" | "Active" | "Posting" | "Memo";

interface TxResponse {
  success: boolean;
  result: string;
}

export function handshake() {
  return new Promise<void>((resolve) => {
    window.hive_keychain?.requestHandshake(() => {
      resolve();
    });
  });
}

export const broadcast = (
  account: string,
  operations: Operation[],
  key: KeychainAuthorityTypes,
  rpc: string | null = null
): Promise<TxResponse> =>
  new Promise<TxResponse>((resolve, reject) => {
    window.hive_keychain?.requestBroadcast(
      account,
      operations,
      key,
      (resp: TxResponse) => {
        if (!resp.success) {
          reject({ message: "Operation cancelled" });
        }

        resolve(resp);
      },
      rpc
    );
  });
