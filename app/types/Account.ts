import { BankKey } from "@/app/utils/BanksLogo";

export type Account = {
  id: string;
  name: string;
  bank: BankKey;
  balance: number;
  onEdit?: () => void;
};
