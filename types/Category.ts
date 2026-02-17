import { IconName } from "@/utils/Icons";

export type Category = {
  id: number;
  name: string;
  icon: IconName;
  color: string;
  limit?: string;
  spent?: string;
};
