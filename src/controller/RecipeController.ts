import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Recipe } from "../entity/Recipe";
import { CustomError } from "../utils/CustomError";

export async function getAllRecipes(req: Request, res: Response) {
  try {
    const recipeRepository = getRepository(Recipe);
    const recipes = await recipeRepository.find();
    res.json(recipes).status(200);
  } catch (error) {
    throw new CustomError(500, "Internal Server Error");
  }
}

export async function getRecipeById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const recipeRepository = getRepository(Recipe);
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return res.status(400).send("Invalid ID format");
    }

    const recipe = await recipeRepository.findOne({ where: { id: numericId } });
    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }
    res.status(200).json(recipe);
  } catch (error) {
    throw new CustomError(500, "Internal Server Error");
  }
}

export async function createRecipe(req: Request, res: Response) {
  try {
    const { title, ingredients, instructions } = req.body;
    const recipeRepository = getRepository(Recipe);
    const newRecipe = recipeRepository.create({
      title,
      ingredients,
      instructions,
    });
    await recipeRepository.save(newRecipe);
    res.status(201).json(newRecipe);
  } catch (error) {
    throw new CustomError(500, "Internal Server Error");
  }
}

// export async function updateRecipe(req: Request, res: Response) {
//   const { id } = req.params;
//   const { name, ingredients, instructions } = req.body;
//   const recipeRepository = getRepository(Recipe);
//   const recipe = await recipeRepository.findOne(id);
//   if (recipe) {
//     recipe.name = name;
//     recipe.ingredients = ingredients;
//     recipe.instructions = instructions;
//     await recipeRepository.save(recipe);
//     res.send(recipe);
//   } else {
//     res.status(404).send("Recipe not found");
//   }
// }

// export async function deleteRecipe(req: Request, res: Response) {
//   const { id } = req.params;
//   const recipeRepository = getRepository(Recipe);
//   const recipe = await recipeRepository.findOne(id);
//   if (recipe) {
//     await recipeRepository.remove(recipe);
//     res.send(`Deleted recipe with ID ${id}`);
//   } else {
//     res.status(404).send("Recipe not found");
//   }
// }
