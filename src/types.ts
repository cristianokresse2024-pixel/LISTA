export interface ShoppingItem {
  id: string;
  name: string;
  qty?: string;
  price?: number;
  category: string;
  checked: boolean;
  addedAt: number;
  listId: string;
}

export const CATEGORIES = [
  "Hortifruti",
  "Açougue e Peixaria",
  "Padaria",
  "Laticínios e Frios",
  "Mercearia",
  "Bebidas",
  "Limpeza",
  "Higiene e Beleza",
  "Outros"
] as const;

export type Category = typeof CATEGORIES[number];
