import { getRepository, Repository } from "typeorm";
import { Recipe } from "../Entities/Recipe";
import { IngredientTag } from "../Entities/Ingredient";

export class RecipeRepository {
    async save(recipe: Recipe): Promise<Recipe> {
        try {
            const repo: Repository<Recipe> = getRepository(Recipe);
            return await repo.save(recipe);
        } catch (error) {
            console.error("Error when saving the recipe:", error);
            throw error;
        }
    }

    async create(recipeData: Partial<Recipe>): Promise<Recipe> {
        try {
            const repo: Repository<Recipe> = getRepository(Recipe);
            return repo.create(recipeData);
        } catch (error) {
            console.error("Error when creating the recipe:", error);
            throw error;
        }
    }

    async getUsedProteinIngredientIds(proteinIds: number[]): Promise<number[]> {
        if (!proteinIds?.length) return [];

        const rows = await getRepository(Recipe)
            .createQueryBuilder("r")
            .leftJoin("r.ingredients", "i")
            .where("i.id IN (:...ids)", { ids: proteinIds })
            .andWhere("i.tag = :tag", { tag: IngredientTag.PROTEINE })
            .select("i.id", "ingredientId")
            .distinct(true)
            .getRawMany<{ ingredientId: string }>();

        return rows.map(r => Number(r.ingredientId));
    }

    async findByIngredientId(ingredientId: number) {
        return getRepository(Recipe)
            .createQueryBuilder('recipe')
            .innerJoin('recipe.ingredients', 'filter', 'filter.id = :id', { id: ingredientId })
            .leftJoinAndSelect('recipe.ingredients', 'ingredients')
            .getMany();
    }
}