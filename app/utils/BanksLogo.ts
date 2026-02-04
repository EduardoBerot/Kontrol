export type BankKey =
  | "nubank"


export const BanksLogo: Record<BankKey, any> = {
  nubank: require("@/assets/banks/nubank.png"),
};

export default BanksLogo;
