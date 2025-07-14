import {
  CONFIG,
  getDynamicPropsQueryOptions,
  getQueryClient,
} from "@ecency/sdk";
import { utils } from "@hiveio/dhive";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { HIVE_ACCOUNT_OPERATION_GROUPS } from "../consts";
import { HiveOperationGroup, HiveTransaction } from "../types";

export function getHiveAssetTransactionsQueryOptions(
  username: string | undefined,
  limit = 20,
  group: HiveOperationGroup
) {
  return infiniteQueryOptions<HiveTransaction[]>({
    queryKey: ["assets", "hive", "transactions", username, limit, group],
    initialData: { pages: [], pageParams: [] },
    initialPageParam: -1,
    getNextPageParam: (lastPage, __) =>
      lastPage ? +(lastPage[lastPage.length - 1]?.num ?? 0) - 1 : -1,

    queryFn: async ({ pageParam }) => {
      const dynamicPropsQuery = getDynamicPropsQueryOptions();
      await getQueryClient().prefetchQuery(dynamicPropsQuery);
      //   const dynamicProps = getQueryClient().getQueryData<DynamicProps>(
      //     dynamicPropsQuery.queryKey
      //   );

      let filters = [];

      switch (group) {
        case "transfers":
          filters = utils.makeBitMaskFilter(
            HIVE_ACCOUNT_OPERATION_GROUPS["transfers"]
          );
          break;
        case "market-orders":
          filters = utils.makeBitMaskFilter(
            HIVE_ACCOUNT_OPERATION_GROUPS["market-orders"]
          );
          break;
        case "interests":
          filters = utils.makeBitMaskFilter(
            HIVE_ACCOUNT_OPERATION_GROUPS["interests"]
          );
          break;
        case "stake-operations":
          filters = utils.makeBitMaskFilter(
            HIVE_ACCOUNT_OPERATION_GROUPS["stake-operations"]
          );
          break;
        case "rewards":
          filters = utils.makeBitMaskFilter(
            HIVE_ACCOUNT_OPERATION_GROUPS["rewards"]
          );
          break;
        default:
          filters = utils.makeBitMaskFilter([]);
      }

      const response = await CONFIG.hiveClient.call(
        "condenser_api",
        "get_account_history",
        [username, pageParam, limit, ...filters]
      );

      return response.map(
        (x: any) =>
          ({
            num: x[0],
            type: x[1].op[0],
            timestamp: x[1].timestamp,
            trx_id: x[1].trx_id,
            ...x[1].op[1],
          }) satisfies HiveTransaction
      );
      // .map(({ timestamp, type, num, ...tr }: HiveTransaction) => {
      //   const results: GeneralAssetTransaction["results"] = [];

      //   switch (type) {
      //     case "curation_reward":
      //       results.push({
      //         amount: vestsToHp(
      //           parseAsset((tr as CurationReward).reward).amount,
      //           dynamicProps?.hivePerMVests ?? 0
      //         ),
      //         asset: "HP",
      //       });
      //       break;
      //     case "author_reward":
      //     case "comment_benefactor_reward":
      //       //   const hbdPayout = +(tr as AuthorReward).hbd_payout;
      //       const hivePayout = parseAsset((tr as AuthorReward).hive_payout);
      //       const vestingPayout = parseAsset(
      //         (tr as AuthorReward).vesting_payout
      //       );

      //       // TODO: Show this payout only for HBD
      //       //   if (hbdPayout > 0) {
      //       //     results.push({
      //       //       amount: vestsToHp(
      //       //         parseAsset((tr as AuthorReward).hbd_payout).amount,
      //       //         dynamicProps?.hivePerMVests ?? 0
      //       //       ),
      //       //       asset: "HBD",
      //       //     });
      //       //   }

      //       if (hivePayout.amount > 0) {
      //         results.push({
      //           amount: vestsToHp(
      //             hivePayout.amount,
      //             dynamicProps?.hivePerMVests ?? 0
      //           ),
      //           asset: "HIVE",
      //         });
      //       }

      //       if (vestingPayout.amount > 0) {
      //         results.push({
      //           amount: vestsToHp(
      //             vestingPayout.amount,
      //             dynamicProps?.hivePerMVests ?? 0
      //           ),
      //           asset: "VESTS",
      //         });
      //       }
      //       break;
      //     case "claim_reward_balance":
      //       //   const rewardHbd = parseAsset(
      //       //     (tr as ClaimRewardBalance).reward_hbd
      //       //   );
      //       const rewardHive = parseAsset(
      //         (tr as ClaimRewardBalance).reward_hive
      //       );
      //       const rewardVesting = parseAsset(
      //         (tr as ClaimRewardBalance).reward_vests
      //       );

      //       // TODO: Show this payout only for HBD
      //       //   if (hbdPayout > 0) {
      //       //     results.push({
      //       //       amount: vestsToHp(
      //       //         parseAsset((tr as AuthorReward).hbd_payout).amount,
      //       //         dynamicProps?.hivePerMVests ?? 0
      //       //       ),
      //       //       asset: "HBD",
      //       //     });
      //       //   }

      //       if (rewardHive.amount > 0) {
      //         results.push({
      //           amount: vestsToHp(
      //             rewardHive.amount,
      //             dynamicProps?.hivePerMVests ?? 0
      //           ),
      //           asset: "HIVE",
      //         });
      //       }

      //       if (rewardVesting.amount > 0) {
      //         results.push({
      //           amount: vestsToHp(
      //             rewardVesting.amount,
      //             dynamicProps?.hivePerMVests ?? 0
      //           ),
      //           asset: "VESTS",
      //         });
      //       }
      //       break;
      //     case "transfer":
      //     case "transfer_to_savings":
      //     case "transfer_to_vesting":
      //       results.push({
      //         amount: (tr as Transfer).amount,
      //         asset: "HIVE",
      //       });
      //       break;
      //     case "set_withdraw_vesting_route":
      //       results.push({
      //         amount: (tr as SetWithdrawRoute).percent,
      //         asset: "HIVE",
      //       });
      //       break;
      //     case "recurrent_transfer":
      //     case "fill_recurrent_transfer":
      //       const asset = parseAsset((tr as FillRecurrentTransfers).amount);
      //       results.push({
      //         amount: asset.amount,
      //         asset: asset.symbol,
      //       });
      //       break;
      //     case "cancel_transfer_from_savings":
      //       results.push({
      //         amount: 0,
      //         asset: "",
      //       });
      //       break;
      //     case "withdraw_vesting":
      //       const vestingShares = parseAsset(
      //         (tr as WithdrawVesting).vesting_shares
      //       );
      //       results.push({
      //         amount: vestsToHp(
      //           vestingShares.amount,
      //           dynamicProps?.hivePerMVests ?? 0
      //         ),
      //         asset: "HP",
      //       });
      //       break;
      //     case "delegate_vesting_shares":
      //       const delegateVestingShares = parseAsset(
      //         (tr as DelegateVestingShares).vesting_shares
      //       );
      //       results.push({
      //         amount: vestsToHp(
      //           delegateVestingShares.amount,
      //           dynamicProps?.hivePerMVests ?? 0
      //         ),
      //         asset: "HP",
      //       });
      //       break;
      //     case "fill_vesting_withdraw":
      //       results.push({
      //         amount: (tr as FillVestingWithdraw).deposited,
      //         asset: "HIVE",
      //       });
      //       break;
      //     case "fill_order":
      //       results.push({
      //         amount: `${(tr as FillOrder).current_pays} = ${(tr as FillOrder).open_pays}}`,
      //         asset: "",
      //       });
      //       break;
      //     case "limit_order_create":
      //       results.push({
      //         amount: `${(tr as LimitOrderCreate).amount_to_sell} = ${(tr as LimitOrderCreate).min_to_receive}}`,
      //         asset: "",
      //       });
      //       break;
      //     case "limit_order_cancel":
      //       results.push({
      //         amount: num,
      //         asset: "",
      //       });
      //       break;
      //     case "producer_reward":
      //       results.push({
      //         amount: vestsToHp(
      //           parseAsset((tr as ProducerReward).vesting_shares).amount,
      //           dynamicProps?.hivePerMVests ?? 0
      //         ),
      //         asset: "HP",
      //       });
      //       break;
      //     case "interest":
      //       results.push({
      //         amount: (tr as Interest).interest,
      //         asset: "",
      //       });
      //       break;
      //     case "fill_convert_request":
      //       results.push({
      //         amount: `${(tr as FillConvertRequest).amount_in} = ${(tr as FillConvertRequest).amount_out}`,
      //         asset: "",
      //       });
      //       break;
      //     case "fill_collateralized_convert_request":
      //       results.push({
      //         amount: `${(tr as FillCollateralizedConvertRequest).amount_in} = ${(tr as FillCollateralizedConvertRequest).amount_out}`,
      //         asset: "",
      //       });
      //       break;
      //     case "return_vesting_delegation":
      //       const ReturnVestingDelegationAsset = parseAsset(
      //         (tr as ReturnVestingDelegation).vesting_shares
      //       );
      //       results.push({
      //         amount: vestsToHp(
      //           ReturnVestingDelegationAsset.amount,
      //           dynamicProps?.hivePerMVests ?? 0
      //         ),
      //         asset: "HP",
      //       });
      //       break;
      //     case "proposal_pay":
      //       results.push({
      //         amount: (tr as ProposalPay).payment,
      //         asset: "",
      //       });
      //       break;
      //     case "update_proposal_votes":
      //       // TODO: add additional information
      //       results.push({
      //         amount: "",
      //         asset: "",
      //       });
      //       break;
      //     case "comment_payout_update":
      //       // TODO: add additional information
      //       results.push({
      //         amount: "",
      //         asset: "",
      //       });
      //       break;
      //     case "comment_reward":
      //       // TODO: MOVE TO HBD
      //       results.push({
      //         amount: "",
      //         asset: "",
      //       });
      //       break;
      //     case "collateralized_convert":
      //       const collateralizedConvertAsset = parseAsset(
      //         (tr as CollateralizedConvert).amount
      //       );
      //       results.push({
      //         amount: collateralizedConvertAsset.amount,
      //         asset: "HIVE",
      //       });
      //       break;
      //     case "effective_comment_vote":
      //       // TODO: MOVE TO HBD
      //       const payout = parseAsset(
      //         (tr as EffectiveCommentVote).pending_payout
      //       );
      //       results.push({
      //         amount: payout.amount,
      //         asset: "HBD",
      //       });
      //       break;
      //     case "account_witness_proxy":
      //       // TODO: ADD INFO
      //       results.push({
      //         amount: "",
      //         asset: "",
      //       });
      //       break;
      //     default:
      //       break;
      //   }

      //   return {
      //     created: new Date(timestamp),
      //     type,
      //     results: [],
      //     id: num,
      //   } satisfies GeneralAssetTransaction;
      // });
    },
  });
}
