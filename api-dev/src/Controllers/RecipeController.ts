import { RecipeService } from "../Services/RecipeService";
import { NextFunction, Request, Response } from "express";
import { CreateRecipe } from "../UseCase/Recipe/CreateRecipe";
import { Recipe } from "../Entities/Recipe";

export class RecipeController {
  public static async list(req: any, res: any, next: any): Promise<void> {
    try {
      const recipes = await RecipeService.list();
      res.send(recipes);
    } catch (err) {
      console.error("[RecipeController.list] Error listing recipes", err);
      res.send(500);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recipe: Recipe = await CreateRecipe.execute(req.body);

      res.send(recipe);
    } catch (err: any) {
      console.error("[RecipeController.create] Error creating recipe", err);

      const status: any = err.statusCode || 500;
      res.status(status).json({
        message: err.message || "Unknown error."
      });
    }
  }

  public static async update(req: any, res: any, next: any): Promise<void> {
    try {
      const recipe = await RecipeService.update(req.body);
      res.send(recipe);
    } catch (err) {
      console.error("[RecipeController.update] Error updating recipe", err);
      res.send(500);
    }
  }

  public static async delete(req: any, res: any, next: any): Promise<void> {
    try {
      await RecipeService.delete(req.params.id);
      res.send();
    } catch (err) {
      console.error("[RecipeController.delete] Error deleting recipe", err);
      res.send(500);
    }
  }
}
