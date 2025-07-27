import { relations } from "drizzle-orm";
import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import type { SelectIngredient } from "./ingredient";

import { CaloriesSchema, CarbohydratesSchema, FatsSchema, FormIngredientRow, InstructionSchema, NameSchema, ProteinsSchema } from "../../zod-schemas";
import { user } from "./auth-schema";
import { category } from "./category";
import { ingredientToRecipe } from "./ingredient-to-recipe";

export const recipe = sqliteTable("recipe", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  calories: int().notNull(),
  proteins: int().notNull(),
  fats: int().notNull(),
  carbohydrates: int().notNull(),
  slug: text().notNull().unique(),
  category: int().notNull().references(() => category.id, { onDelete: "cascade" }),
  userId: text().notNull().references(() => user.id, { onDelete: "cascade" }),
  instruction: text().notNull(),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
  unique().on(t.name, t.userId),
]);

export const RecipeRelations = relations(recipe, ({ many, one }) => ({
  ingredientToRecipe: many(ingredientToRecipe),
  recipeCategory: one(category, {
    fields: [recipe.category],
    references: [category.id],
  }),
}));

export const InsertRecipeSchema = createInsertSchema(recipe, {
  name: NameSchema,
  instruction: InstructionSchema,
  calories: CaloriesSchema,
  proteins: ProteinsSchema,
  fats: FatsSchema,
  carbohydrates: CarbohydratesSchema,
  category: z.number(),
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const InsertRecipeWithIngredientsSchema = InsertRecipeSchema.extend({
  ingredients: z.array(FormIngredientRow),
});

export type SelectRecipe = typeof recipe.$inferSelect;
export type SelectRecipeWithIngredients = SelectRecipe & {
  ingredients: SelectIngredient[];
};

export type InsertRecipe = z.infer<
  typeof InsertRecipeWithIngredientsSchema
>;
