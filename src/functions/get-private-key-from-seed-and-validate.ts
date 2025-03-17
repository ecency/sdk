import { EcencyWalletCurrency } from "@/enums";
import { BaseWallet } from "@okxweb3/coin-base";

/**
 * These HD paths covers popular wallets like Trust, Meta, Ledger, Trezor
 */
const HD_PATHS: Record<EcencyWalletCurrency, string[]> = {
  [EcencyWalletCurrency.BTC]: [
    "m/84'/0'/0'/0/0",
    "m/44'/0'/0'/0/0",
    "m/49'/0'/0'/0/0",
  ],
  [EcencyWalletCurrency.ETH]: ["m/44'/60'/0'/0/0"],
  [EcencyWalletCurrency.SOL]: ["m/44'/501'/0'/0'"],
  [EcencyWalletCurrency.TRON]: ["m/44'/195'/0'/0/0"],
  [EcencyWalletCurrency.APT]: ["m/44'/637'/0'/0'/0'"],
  [EcencyWalletCurrency.TON]: ["m/44'/607'/0'"],
  [EcencyWalletCurrency.ATOM]: ["m/44'/118'/0'/0/0"],
};

const ADDRESS_TYPES: Record<EcencyWalletCurrency, (string | undefined)[]> = {
  [EcencyWalletCurrency.BTC]: [
    "", // legacy
    "segwit_native",
    "segwite_nested",
    "segwit_taproot",
  ],

  [EcencyWalletCurrency.ETH]: [undefined],
  [EcencyWalletCurrency.SOL]: [undefined],
  [EcencyWalletCurrency.TRON]: [undefined],
  [EcencyWalletCurrency.APT]: [undefined],
  [EcencyWalletCurrency.TON]: [undefined],
  [EcencyWalletCurrency.ATOM]: [undefined],
};

export async function getPrivateKeyFromSeedAndValidate(
  mnemonic: string,
  address: string,
  wallet: BaseWallet,
  currency: EcencyWalletCurrency
) {
  for (const hdPath of HD_PATHS[currency] || []) {
    try {
      const derivedPrivateKey = await wallet.getDerivedPrivateKey({
        mnemonic,
        hdPath,
      });

      for (const addressType of ADDRESS_TYPES[currency]) {
        const derivedAddress = await wallet.getNewAddress({
          privateKey: derivedPrivateKey,
          addressType,
        });

        if (derivedAddress.address === address) {
          return derivedPrivateKey;
        }
      }
    } catch (error) {
      return undefined;
    }
  }
  return undefined;
}
