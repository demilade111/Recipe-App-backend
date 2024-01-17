import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
} from "../controller/RecipeController";
import authenticateJWT from "../middlewear/authMiddlewear";
const router = express.Router();

router.post("/", authenticateJWT, createRecipe);
router.post("/", authenticateJWT, getAllRecipes);
router.get("/:id", authenticateJWT, getRecipeById);
// router.get("/:id",authenticateJWT, getRecipeById);
// router.get("/:id", authenticateJWT,getRecipeById);

export default router;
