import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum IngredientTag {
  LEGUMES = "légumes",
  PROTEINE = "protéine",
  FECULENT = "féculent",
}

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({
    type: "enum",
    enum: IngredientTag,
  })
  tag: IngredientTag;
}
