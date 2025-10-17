export enum IngredientTagEnum {
  LEGUMES = "légumes",
  PROTEINE = "protéine",
  FECULENT = "féculent",
}

export interface Ingredient {
  id: number;
  name: string;
  price: number;
  tag: IngredientTagEnum
}
