import {
  AccountProfile,
  getAccountFullQueryOptions,
  useAccountUpdate,
} from "@ecency/sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EcencyTokenMetadata } from "../types";
import * as R from "remeda";
import { getAccountWalletListQueryOptions } from "../queries";

function getGroupedChainTokens(
  tokens?: AccountProfile["tokens"],
  show = false
) {
  if (!tokens) {
    return {};
  }

  return R.pipe(
    tokens,
    R.filter(({ type }) => type === "CHAIN"),
    R.map((item) => {
      item.meta.show = show;
      return item;
    }),
    R.groupByProp("symbol")
  );
}

/**
 * Saving of token(s) metadata to Hive profile
 * It may contains: external wallets(see EcencyWalletCurrency), Hive tokens arrangement
 *
 * Basically, this mutation is a convenient wrapper for update profile operation
 */
export function useSaveWalletInformationToMetadata(username: string) {
  const queryClient = useQueryClient();

  const { data: accountData } = useQuery(getAccountFullQueryOptions(username));
  const { mutateAsync: updateProfile } = useAccountUpdate(username);

  return useMutation({
    mutationKey: ["ecency-wallets", "save-wallet-to-metadata", accountData],
    mutationFn: async (tokens: EcencyTokenMetadata[]) => {
      if (!accountData) {
        throw new Error("[SDK][Wallets] – no account data to save wallets");
      }

      // Chain type tokens couldn't be deleted entierly from the profile list
      //       then visibility should be controlling using meta.show field
      const profileChainTokens = getGroupedChainTokens(
        accountData.profile?.tokens
      );
      const payloadTokens =
        (tokens.map(({ currency, type, ...meta }) => ({
          symbol: currency!,
          type,
          meta,
        })) as AccountProfile["tokens"]) ?? [];

      const payloadChainTokens = getGroupedChainTokens(payloadTokens, true);
      const payloadNonChainTokens = payloadTokens.filter(
        ({ type }) => type !== "CHAIN"
      );

      const mergedChainTokens = R.pipe(
        profileChainTokens,
        R.mergeDeep(payloadChainTokens),
        R.values()
      );

      return updateProfile({
        tokens: [
          ...payloadNonChainTokens,
          ...mergedChainTokens,
        ] as AccountProfile["tokens"],
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: getAccountWalletListQueryOptions(username).queryKey,
      }),
  });
}
