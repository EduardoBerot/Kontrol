export type BankKey =
  | "bancodobrasil"
  | "banrisul"
  | "bradesco"
  | "c6"
  | "caixa"
  | "itau"
  | "mercadopago"
  | "nubank"
  | "pagbank"
  | "picpay"
  | "santander"
  | "sicoob"
  | "sicredi";

export const BanksLogo: Record<BankKey, any> = {
  bancodobrasil: require("@/assets/banks/bancodobrasil.png"),
  banrisul: require("@/assets/banks/banrisul.png"),
  bradesco: require("@/assets/banks/bradesco.png"),
  c6: require("@/assets/banks/c6.png"),
  caixa: require("@/assets/banks/caixa.png"),
  itau: require("@/assets/banks/itau.png"),
  mercadopago: require("@/assets/banks/mercadopago.png"),
  nubank: require("@/assets/banks/nubank.png"),
  pagbank: require("@/assets/banks/pagbank.png"),
  picpay: require("@/assets/banks/picpay.png"),
  santander: require("@/assets/banks/santander.png"),
  sicoob: require("@/assets/banks/sicoob.png"),
  sicredi: require("@/assets/banks/sicredi.png"),
};

export default BanksLogo;
