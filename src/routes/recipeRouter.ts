import express from "express";
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
} from "../controller/RecipeController";
import { authenticateJWT } from "../middlewear/authMiddlewear";

const router = express.Router();

router.post("/", authenticateJWT, createRecipe);
router.get("/", authenticateJWT, getAllRecipes);
router.get("/:id", authenticateJWT, getRecipeById);
router.patch("/:id", authenticateJWT, updateRecipe);
router.delete("/:id", authenticateJWT, deleteRecipe);

export default router;
