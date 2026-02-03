import { ComponentProps } from "react";
import { MaterialIcons } from "@expo/vector-icons";

export type IconName = ComponentProps<typeof MaterialIcons>["name"];

export const Icons: IconName[] = [
  // Geral
  "shopping-cart",
  "restaurant",
  "credit-card",
  "account-balance-wallet",
  "attach-money",

  // Moradia / contas
  "house",
  "apartment",
  "bolt",
  "water-drop",
  "wifi",
  "gas-meter",

  // Transporte
  "directions-car",
  "local-gas-station",
  "commute",
  "directions-bus",
  "directions-bike",
  "flight",

  // Alimentação
  "restaurant",
  "fastfood",
  "local-cafe",
  "local-pizza",
  "icecream",

  // Saúde
  "local-hospital",
  "medical-services",
  "medication",
  "fitness-center",
  "healing",

  // Educação
  "school",
  "menu-book",
  "computer",
  "psychology",

  // Lazer
  "movie",
  "sports-esports",
  "sports-soccer",
  "music-note",
  "celebration",
  "beach-access",

  // Compras / pessoal
  "shopping-bag",
  "checkroom",
  "watch",
  "phone-iphone",
  "headphones",

  // Família / pets
  "pets",
  "child-care",
  "family-restroom",

  // Trabalho / renda
  "work",
  "business-center",
  "trending-up",
  "payments",

  // Outros
  "favorite",
  "star",
  "card-giftcard",
  "volunteer-activism",
  "more-horiz",
];


export default Icons
