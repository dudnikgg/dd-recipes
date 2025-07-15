import { and, eq, inArray } from "drizzle-orm/sql";
import { customAlphabet } from "nanoid";

import type { InsertIngredientToRecipe, InsertRecipe } from "../schema";

import db from "..";
import { ingredientToRecipe, recipe } from "../schema";

const nanoid = customAlphabet("1234567890abcdifghijklmnopqrstuvwxyz");

export async function findRecipe(slug: string, userId: number) {
  return db.query.recipe.findFirst({
    where: and(
      eq(recipe.slug, slug),
      eq(recipe.userId, userId),
    ),
    with: {
      recipeCategory: true,
      ingredientToRecipe: {
        columns: {
          ingredientId: false,
          recipeId: false,
        },
        with: {
          ingredient: {
            columns: {
              id: true,
              name: true,
              measurement_unit: true,
            },
          },
        },
      },
    },
  });
}

export async function findRecipeBySlug(slug: string) {
  return db.query.recipe.findFirst({
    where:
      eq(recipe.slug, slug),
  });
}

export async function findUniqueSlug(slug: string) {
  let existing = !!(await findRecipeBySlug(slug));

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = !!(await findRecipeBySlug(idSlug));
    if (!existing) {
      return idSlug;
    }
  }

  return slug;
}

export async function findRecipeByName(existing: InsertRecipe, userId: number) {
  return db.query.recipe.findFirst({
    where:
      and(
        eq(recipe.name, existing.name),
        eq(recipe.userId, userId),
      ),
  });
}

export async function findRecipes(userId: number) {
  return db.query.recipe.findMany({
    where: eq(recipe.userId, userId),
    with: {
      recipeCategory: true,
    },
  });
}

export async function findRecipesWithIngredients(userId: number) {
  return db.query.recipe.findMany({
    where: eq(recipe.userId, userId),
    with: {
      recipeCategory: true,
      ingredientToRecipe: {
        columns: {
          ingredientId: false,
          recipeId: false,
        },
        with: {
          ingredient: {
            columns: {
              id: true,
              name: true,
              measurement_unit: true,
            },
          },
        },
      },
    },

  });
}

export async function insertRecipe(insertable: InsertRecipe, slug: string, userId: number) {
  return await db.transaction(async (tx) => {
    const newRecipe = await tx.insert(recipe).values({
      ...insertable,
      slug,
      userId,
    }).returning({ id: recipe.id });

    if (insertable.ingredients.length) {
      const prepareIngredientsToRecipe = insertable.ingredients.map((item) => {
        return {
          recipeId: newRecipe[0].id,
          ingredientId: item.ingredientId,
          amount: item.amount,
        } as InsertIngredientToRecipe;
      });

      await tx.insert(ingredientToRecipe).values(prepareIngredientsToRecipe);
    }
  });
}

export async function updateRecipeBySlug(updates: InsertRecipe, slug: string, userId: number) {
  function isValidIngredient(i: any): i is InsertIngredientToRecipe {
    return typeof i.ingredientId === "number" && typeof i.amount === "number";
  }

  /*
  * Here I'm doing few actions since drizzle does not support updating many-to-many
  *
  * Get the {recipeId} from the slug sent from front-end
  * Then do diff and create three lists of ingredients that needs to be updated/inserted/removed
  * Then perform db operation accordinly
  * Then update other recipe fields
  */
  return await db.transaction(async (tx) => {
    const [{ id: recipeId }] = await tx.select({
      id: recipe.id,
    }).from(recipe).where(
      eq(recipe.slug, slug),
    );

    const incomming = updates.ingredients;
    const current = await tx.select().from(ingredientToRecipe).where(
      eq(ingredientToRecipe.recipeId, recipeId),
    );

    const currentMap = new Map(current.map(ing => [ing.ingredientId, ing.amount]));
    const incommingMap = new Map(incomming.map(ing => [ing.ingredientId, ing.amount]));

    const toInsert: InsertIngredientToRecipe[] = [];
    const toUpdate: InsertIngredientToRecipe[] = [];
    const toDelete: number[] = [];

    for (const ing of incomming) {
      if (!isValidIngredient(ing))
        return;

      if (!currentMap.has(ing.ingredientId)) {
        toInsert.push(ing);
      }
      else if (currentMap.get(ing.ingredientId) !== ing.amount) {
        toUpdate.push(ing);
      }
    }

    for (const ing of current) {
      if (!isValidIngredient(ing))
        return;

      if (!incommingMap.has(ing.ingredientId)) {
        toDelete.push(ing.ingredientId);
      }
    }

    for (const ing of toUpdate) {
      await tx.update(ingredientToRecipe)
        .set({ amount: ing.amount })
        .where(and(
          eq(ingredientToRecipe.recipeId, recipeId),
          eq(ingredientToRecipe.ingredientId, ing.ingredientId),
        ));
    }

    if (toInsert.length) {
      await tx.insert(ingredientToRecipe).values(
        toInsert.map(i => ({
          recipeId,
          ingredientId: i.ingredientId,
          amount: i.amount,
        })),
      );
    }

    if (toDelete.length) {
      await tx.delete(ingredientToRecipe)
        .where(and(
          eq(ingredientToRecipe.recipeId, recipeId),
          inArray(ingredientToRecipe.ingredientId, toDelete),
        ));
    }

    await tx.update(recipe).set(updates).where(
      and(
        eq(recipe.id, recipeId),
        eq(recipe.userId, userId),
      ),
    ).returning();
  });
}
