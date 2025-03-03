import { EcencyWalletCurrency } from "@/enums";

export interface EcencyCreateWalletInformation {
  address: string;
  privateKey: string;
  publicKey: string;
  username: string;
  currency: EcencyWalletCurrency;
}
