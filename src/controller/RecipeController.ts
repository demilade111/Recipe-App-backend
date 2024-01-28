// src/controller/RecipeController.ts
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Recipe } from "../entity/Recipe";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { CustomError } from "../utils/CustomError";
import { v2 as cloudinary } from "cloudinary";
import upload from "../utils/multerConfig";

// Middleware for handling file upload
export const uploadImage = upload.single("recipeImage");

export async function getAllRecipes(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const recipeRepository = getRepository(Recipe);
    const recipes = await recipeRepository.find({
      where: { user: { id: userId } },
      relations: ["user"],
      select: { user: { id: true, fullname: true, email: true } },
    });

    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getRecipeById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const recipeRepository = getRepository(Recipe);
    const recipe = await recipeRepository.findOne({
      where: { id: numericId },
      relations: ["user"],
      select: { user: { id: true, fullname: true, email: true } },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function createRecipe(req: AuthenticatedRequest, res: Response) {
  try {
    const recipeRepository = getRepository(Recipe);
    console.log(req.file);

    let imageUrl = "";
    if (req.file) {
      // Using upload method instead of upload_stream
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${req.file.buffer.toString("base64")}`
      );
      imageUrl = result.url; // Now you can access the url property
    }

    const newRecipe = recipeRepository.create({
      ...req.body,
      photo: imageUrl, // Add the image URL to the recipe
      user: req.user?.userId,
    });

    await recipeRepository.save(newRecipe);
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function updateRecipe(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const recipeRepository = getRepository(Recipe);
    const recipe = await recipeRepository.findOne({
      where: { id: Number(id), user: { id: userId } },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    recipeRepository.merge(recipe, req.body);
    const updatedRecipe = await recipeRepository.save(recipe);

    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteRecipe(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const recipeRepository = getRepository(Recipe);
    const recipe = await recipeRepository.findOne({
      where: { id: Number(id), user: { id: userId } },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    await recipeRepository.remove(recipe);
    res.status(204).send("Recipe deleted successfully");
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
