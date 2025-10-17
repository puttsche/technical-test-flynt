import {OptionsMultiSelectType} from "../Types/OptionsMultiSelect";
import {IngredientTagEnum} from "../Types/Ingredient";

export interface RecipeCriteriaReturnType {
    proteine: boolean;
    feculent: boolean;
}

export const GetRecipeCriteria = (selectedIngredients: OptionsMultiSelectType[]): RecipeCriteriaReturnType => {
    const hasProteineCriteria: boolean = selectedIngredients.filter((ingredient) => ingredient.tag === IngredientTagEnum.PROTEINE).length <= 1;
    const hastFeculentCriteria: boolean = selectedIngredients.filter((ingredient) => ingredient.tag === IngredientTagEnum.FECULENT).length === 1;

    return {
        proteine: hasProteineCriteria,
        feculent: hastFeculentCriteria,
    }
}