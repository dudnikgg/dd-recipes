import { and, eq } from "drizzle-orm/sql";

import type { InsertIngredient } from "../schema";

import db from "..";
import { ingredient } from "../schema";

export async function findIngredients(userId: number) {
  return db.query.ingredient.findMany({
    where: eq(ingredient.userId, userId),
  });
}

export async function findIngredientByName(existing: InsertIngredient, userId: number) {
  return db.query.ingredient.findFirst({
    where:
      and(
        eq(ingredient.name, existing.name),
        eq(ingredient.userId, userId),
      ),
  });
}

export async function findIngredientById(id: number) {
  return db.query.ingredient.findFirst({
    where:
      eq(ingredient.id, id),
  });
}

export async function insertIngredient(insertable: InsertIngredient, userId: number) {
  const [created] = await db.insert(ingredient).values({
    ...insertable,
    userId,
  }).returning();

  return created;
}
