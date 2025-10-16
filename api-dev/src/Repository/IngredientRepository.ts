import {getRepository, In, Repository} from "typeorm";
import { Ingredient } from "../Entities/Ingredient";
import {Recipe} from "../Entities/Recipe";

export class IngredientRepository {
    async findByIds(ids: number[]): Promise<Ingredient[]> {
        if (!ids?.length) return [];
        const found: Ingredient[] = await getRepository(Ingredient).find({ where: { id: In(ids) } });
        if (found.length !== ids.length) {
            const foundIds = new Set(found.map(i => i.id));
            const missing: number[] = ids.filter(id => !foundIds.has(id));
            throw new Error(`Ingredient(s) not found: [${missing.join(", ")}]`);
        }
        return found;
    }

    async findById(id: number): Promise<Ingredient> {
        const found: Ingredient | undefined = await getRepository(Ingredient).findOne(id);
        if (!found) throw new Error(`Ingredient not found: ${id}`);
        return found;
    }

    async save(ingredient: Ingredient): Promise<Ingredient> {
        try {
            const repo: Repository<Ingredient> = getRepository(Ingredient);
            return await repo.save(ingredient);
        } catch (error) {
            console.error("Error when saving the ingredient:", error);
            throw error;
        }
    }
}
