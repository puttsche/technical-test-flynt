import { Ingredient, IngredientTag } from "../../Entities/Ingredient";
import { RecipeRepository } from "../../Repository/RecipeRepository";
import { IngredientRepository } from "../../Repository/IngredientRepository";
import { ValidationError } from "../../Errors/ValidationError";
import { Recipe } from "../../Entities/Recipe";

export interface UpdateIngredientTagInput  {
    id: number;
    newTag: IngredientTag;
}

export class UpdateIngredientTag {
    private static recipeRepository: RecipeRepository = new RecipeRepository();
    private static ingredientRepository: IngredientRepository = new IngredientRepository();

    static async execute(input: UpdateIngredientTagInput): Promise<string> {
        const ingredient: Ingredient = await this.ingredientRepository.findById(input.id);
        if (!ingredient) throw new ValidationError("Ingredient not found");

        ingredient.tag = input.newTag;
        await this.ingredientRepository.save(ingredient);

        const relatedRecipes: Recipe[] = await this.recipeRepository.findByIngredientId(input.id);

        const invalidRecipes = new Set<Recipe>();

        if (input.newTag === IngredientTag.PROTEINE && relatedRecipes.length > 1) {
            relatedRecipes.forEach(r => invalidRecipes.add(r));
        }

        for (const recipe of relatedRecipes) {
            if (!isRecipeValid(recipe)) {
                invalidRecipes.add(recipe);
            }
        }

        if (invalidRecipes.size === 0) {
            return "Tag updated successfully. All related recipes are valid.";
        }

        const names = [...invalidRecipes].map(r => r.name).join(", ");
        return `Tag updated, but these recipes are no longer valid: ${names}`;
    }
}

function isRecipeValid(recipe: Recipe) {
    const proteines: Ingredient[] = recipe.ingredients.filter(i => i.tag === IngredientTag.PROTEINE);
    const feculent: Ingredient[] = recipe.ingredients.filter(i => i.tag === IngredientTag.FECULENT);

    console.log('feculent');
    console.log(feculent.length);

    if (proteines.length > 1) return false;
    return feculent.length === 1;
}