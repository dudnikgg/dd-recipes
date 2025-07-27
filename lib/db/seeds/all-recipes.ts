import slugify from "slug";

import type { DB } from "../index";

import { findUniqueSlug } from "../queries/recipe";
import { ingredient } from "../schema";
import { ingredientToRecipe } from "../schema/ingredient-to-recipe";
import { recipe } from "../schema/recipe";
import allRecipes from "./data/all-recipes.json";

type RawRecipe = typeof allRecipes[number];
type RawIngredient = RawRecipe["ingredients"][number];

type IngredientInsert = Omit<RawIngredient, "amount"> & { name: string; userId: string };

type IngredientToRecipeInsert = {
  recipeId: number;
  ingredientId: number;
  amount: number;
};

function extractUniqueIngredients(recipes: RawRecipe[], userId: string): IngredientInsert[] {
  const raw = recipes.flatMap((rec: RawRecipe) => {
    return rec.ingredients.map((ing: RawIngredient): IngredientInsert => {
      return {
        name: ing.name.trim(),
        measurement_unit: ing.measurement_unit.trim(),
        userId,
      };
    });
  });

  return raw.filter((ing, i, arr) => {
    return i === arr.findIndex(item => item.name === ing.name && item.measurement_unit === ing.measurement_unit);
  });
}

function linkIngredientToRecipe(
  recipe: RawRecipe,
  recipeId: number,
  insertedIngredients: { id: number; name: string; measurement_unit: string }[],
): IngredientToRecipeInsert[] {
  return recipe.ingredients.map((ing) => {
    const matched = insertedIngredients.find(dbIng => dbIng.name === ing.name.trim() && dbIng.measurement_unit === ing.measurement_unit.trim());

    if (!matched) {
      throw new Error(`Ingredient not found in DB: ${ing.name} (${ing.measurement_unit})`);
    }

    return {
      recipeId,
      ingredientId: matched.id,
      amount: Number(ing.amount),
    };
  });
}

async function seedIngredients(db: DB, userId: string) {
  const uniqueIngredients = extractUniqueIngredients(allRecipes, userId);

  return (await Promise.all(
    uniqueIngredients.map((ing) => {
      return db
        .insert(ingredient)
        .values(ing)
        .returning({ id: ingredient.id, name: ingredient.name, measurement_unit: ingredient.measurement_unit });
    }),
  )).flat();
}

export default async function seed(db: DB) {
  try {
    const users = await db.query.user.findMany();

    for (const user of users) {
      const insertedIngredients = await seedIngredients(db, user.id);

      const ingredientToRecipeLinks: IngredientToRecipeInsert[] = [];

      // Insert recipes & gather junction data
      for (const raw of allRecipes) {
        const slug = await findUniqueSlug(slugify(raw.name));

        const [created] = await db
          .insert(recipe)
          .values({
            ...raw,
            slug,
            userId: user.id,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
          .returning({ id: recipe.id });

        const links = linkIngredientToRecipe(raw, created.id, insertedIngredients);
        ingredientToRecipeLinks.push(...links);
      }

      // Insert junction table entries
      if (ingredientToRecipeLinks.length) {
        await db.insert(ingredientToRecipe).values(ingredientToRecipeLinks);
      }
      console.log(`Seeded ${allRecipes.length} recipes and ${insertedIngredients.length} ingredients.`);
    }
  }
  catch (e) {
    console.error(e);
  }
};
