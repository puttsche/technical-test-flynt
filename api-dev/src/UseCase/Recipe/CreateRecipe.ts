import { Recipe } from "../../Entities/Recipe";
import { RecipeRepository } from "../../Repository/RecipeRepository";
import { IngredientRepository } from "../../Repository/IngredientRepository";
import { Ingredient, IngredientTag } from "../../Entities/Ingredient";
import { ValidationError } from "../../Errors/ValidationError";


export interface CreateRecipeInput {
    name: string;
    timeToCook: number;
    numberOfPeople: number;
    ingredients: number[];
}

export class CreateRecipe {
    private static recipeRepository: RecipeRepository = new RecipeRepository();
    private static ingredientRepository: IngredientRepository = new IngredientRepository();

    static async execute(input: CreateRecipeInput): Promise<Recipe> {
        const uniqueIngredientIds: number[] = Array.from(new Set(input.ingredients));

        const ingredients: Ingredient[] = await this.ingredientRepository.findByIds(uniqueIngredientIds);
        const countCriteria = getCountCriteria(ingredients);

        if (!countCriteria.proteine) {
            throw new ValidationError("Please select at most one \"protéine\"");
        }

        if(!countCriteria.feculent) {
            throw new ValidationError("Please select one \"féculent\"");
        }

        const proteinIds: number[] = ingredients
            .filter(i => i.tag === IngredientTag.PROTEINE)
            .map(i => i.id);

        if (proteinIds.length > 0) {
            const alreadyUsed = await this.recipeRepository.getUsedProteinIngredientIds(proteinIds);
            if (alreadyUsed.length > 0) {
                throw new ValidationError("Ingredients with the \"protéine\" tag are already used in another recipe");
            }
        }

        const recipe: Recipe = await this.recipeRepository.create({
            ...input,
            ingredients: ingredients
        });


        return this.recipeRepository.save(recipe);
    }
}


function getCountCriteria(ingredients: Ingredient[]) {
    return {
        proteine: ingredients.filter((i) => i.tag === IngredientTag.PROTEINE).length <= 1,
        feculent: ingredients.filter((i) => i.tag === IngredientTag.FECULENT).length === 1,
    };
}

