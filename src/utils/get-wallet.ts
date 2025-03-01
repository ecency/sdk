import { BtcWallet } from "@okxweb3/coin-bitcoin";
import { EthWallet } from "@okxweb3/coin-ethereum";
import { TrxWallet } from "@okxweb3/coin-tron";
import { TonWallet } from "@okxweb3/coin-ton";
import { SolWallet } from "@okxweb3/coin-solana";
import { AtomWallet } from "@okxweb3/coin-cosmos";
import { AptosWallet } from "@okxweb3/coin-aptos";
import { BaseWallet } from "@okxweb3/coin-base";
import { EcencyWalletCurrency } from "@/enums";

export function getWallet(
  currency: EcencyWalletCurrency
): BaseWallet | undefined {
  switch (currency) {
    case EcencyWalletCurrency.BTC:
      return new BtcWallet();
      EcencyWalletCurrency;
    case EcencyWalletCurrency.ETH:
      return new EthWallet();

    case EcencyWalletCurrency.TRON:
      return new TrxWallet();

    case EcencyWalletCurrency.TON:
      return new TonWallet();

    case EcencyWalletCurrency.SOL:
      return new SolWallet();

    case EcencyWalletCurrency.ATOM:
      return new AtomWallet();

    case EcencyWalletCurrency.APT:
      return new AptosWallet();

    default:
      return undefined;
  }
}
