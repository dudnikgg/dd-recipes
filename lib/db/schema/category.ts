import { relations } from "drizzle-orm";
import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { recipe } from "./recipe";

export const category = sqliteTable("category", {
  id: int().primaryKey(),
  name: text().notNull(),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
  unique().on(t.name, t.id),
]);

export const insertCategorySchema = createInsertSchema(category, {
  id: z.number(),
  name: z.string().nonempty(),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export const categoryRelations = relations(category, ({ many }) => ({
  recipeCategory: many(recipe),
}));

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type SelectCategory = typeof category.$inferInsert;
