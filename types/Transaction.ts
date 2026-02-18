export type Transaction = {
  id: string;
  type: "receita" | "despesa" | "transferencia";
  value: number;
  date: string;
  category: string;
  accountId: string;
  toAccountId?: string;
};