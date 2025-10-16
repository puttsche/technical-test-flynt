import { getRepository } from "typeorm";
import { Recipe } from "../Entities/Recipe";

export class RecipeService {

  static async list(): Promise<Recipe[]> {
    const recipes = await getRepository(Recipe).find({
      relations: ["ingredients"],
    });
    return recipes;
  }

  static async update(recipe: Recipe): Promise<Recipe> {
    const updatedRecipe = await getRepository(Recipe).save(recipe);
    return updatedRecipe;
  }

  static async delete(id: number): Promise<void> {
    await getRepository(Recipe).delete(id);
  }
}
