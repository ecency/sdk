import { CONFIG } from "@/modules/core";
import { AuthorityType, PrivateKey } from "@hiveio/dhive";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAccountFullQueryOptions } from "../queries";
import * as R from "remeda";

interface Payload {
  keepCurrent?: boolean;
  currentPassword: string;
  keys: {
    owner: PrivateKey;
    active: PrivateKey;
    posting: PrivateKey;
    memo: PrivateKey;
  };
}

export function useAccountUpdateKeyAuths(username: string) {
  const { data: accountData } = useQuery(getAccountFullQueryOptions(username));

  return useMutation({
    mutationKey: ["accounts", "keys-update", username],
    mutationFn: async ({
      currentPassword,
      keys,
      keepCurrent = false,
    }: Payload) => {
      if (!accountData) {
        throw new Error(
          "[SDK][Update password] – cannot update password for anon user"
        );
      }
      const currentKeys = {
        owner: currentPassword.startsWith("5")
          ? PrivateKey.fromString(currentPassword)
          : PrivateKey.fromLogin(username, currentPassword, "owner"),
        active: PrivateKey.fromLogin(username, currentPassword, "active"),
        posting: PrivateKey.fromLogin(username, currentPassword, "posting"),
      };

      const prepareAuth = (keyName: keyof typeof currentKeys) =>
        R.pipe(
          R.clone(accountData[keyName]),

          R.set(
            "key_auths",

            R.pipe(
              accountData[keyName].key_auths,
              R.map(([key]) => key),
              R.concat([keys[keyName].createPublic().toString()]),
              R.filter(
                (key) =>
                  !keepCurrent &&
                  key !== currentKeys[keyName].createPublic().toString()
              )
            )
          )
        ) as AuthorityType;

      return CONFIG.hiveClient.broadcast.updateAccount(
        {
          account: username,
          json_metadata: accountData.json_metadata,
          owner: prepareAuth("owner"),
          active: prepareAuth("active"),
          posting: prepareAuth("active"),
          memo_key: keepCurrent
            ? accountData.memo_key
            : keys.memo.createPublic().toString(),
        },
        currentKeys.owner
      );
    },
  });
}
