import { EcencyWalletCurrency } from "@/modules/wallets/enums";

export interface EcencyCreateWalletInformation {
  address: string;
  privateKey: string;
  publicKey: string;
  username: string;
  currency: EcencyWalletCurrency;
  custom?: boolean;
}
