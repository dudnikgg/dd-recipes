import { relations } from "drizzle-orm";
import { int, primaryKey, real, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v3";

import { IngredientAmountSchema } from "../../zod-schemas";
import { ingredient } from "./ingredient";
import { recipe } from "./recipe";

export const ingredientToRecipe = sqliteTable("ingredientToRecipe", {
  ingredientId: int().notNull().references(() => ingredient.id, { onDelete: "cascade" }),
  recipeId: int().notNull().references(() => recipe.id, { onDelete: "cascade" }),
  amount: real().notNull(),
}, t => [
  primaryKey({ columns: [t.ingredientId, t.recipeId] }),
]);

export const ingredientToRecipeRelations = relations(ingredientToRecipe, ({ one }) => ({
  recipe: one(recipe, {
    fields: [ingredientToRecipe.recipeId],
    references: [recipe.id],
  }),
  ingredient: one(ingredient, {
    fields: [ingredientToRecipe.ingredientId],
    references: [ingredient.id],
  }),
}));

export const InsertIngredientToRecipeSchema = createInsertSchema(ingredientToRecipe, {
  recipeId: z.number(),
  ingredientId: z.number(),
  amount: IngredientAmountSchema,
});

export type InsertIngredientToRecipe = z.infer<typeof InsertIngredientToRecipeSchema>;
