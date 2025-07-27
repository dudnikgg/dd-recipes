import type { z } from "zod/v3";

import { relations } from "drizzle-orm";
import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z as zod } from "zod/v3";

import { MeasurementUnitSchema, NameSchema } from "../../zod-schemas";
import { user } from "./auth-schema";
import { ingredientToRecipe } from "./ingredient-to-recipe";

export const ingredient = sqliteTable("ingredient", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  measurement_unit: text().notNull(),
  userId: text().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
  unique().on(t.name, t.userId, t.measurement_unit),
]);

export const ingredientRelations = relations(ingredient, ({ many }) => ({
  ingredientToRecipe: many(ingredientToRecipe),
}));

export const insertIngredientSchema = createInsertSchema(ingredient, {
  name: NameSchema,
  measurement_unit: MeasurementUnitSchema,
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertIngredient = z.infer<typeof insertIngredientSchema>;

export const selectIngredientSchema = createSelectSchema(ingredient, {
  name: NameSchema,
  measurement_unit: MeasurementUnitSchema,
  id: zod.number,
}).omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type SelectIngredient = z.infer<typeof selectIngredientSchema> & { amount: number };
