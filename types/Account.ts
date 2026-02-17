import { BankKey } from "@/utils/BanksLogo";

export type Account = {
  id: string;
  name: string;
  bank: BankKey;
  balance: number;
  onEdit?: () => void;
};

