import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth-schema";
import { recipe } from "./recipe";

export const recipeImage = sqliteTable("recipeImage", {
  id: int().primaryKey({ autoIncrement: true }),
  key: text().notNull(),
  userId: int().notNull().references(() => user.id),
  recipeId: int().notNull().references(() => recipe.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});
