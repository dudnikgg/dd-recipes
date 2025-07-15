import "dotenv/config";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";

import { getTableName, sql } from "drizzle-orm";

import db from "~/lib/db";
import { category, ingredient, ingredientToRecipe, recipe, user } from "~/lib/db/schema/index";
import env from "~/lib/env";

import * as seeds from "./seeds";

if (!env.DB_SEEDING) {
  throw new Error("You must set DB_SEEDING to \"true\" when running seeds");
}

async function resetTables(table: SQLiteTable) {
  const tableName = getTableName(table);
  await db.delete(table).run();

  await db.run(
    sql`DELETE FROM sqlite_sequence WHERE name = ${tableName};`,
  );
}

async function main() {
  const tables = [user, ingredient, recipe, ingredientToRecipe, category] as const;

  for (const item of tables) {
    await resetTables(item);
  }

  await seeds.category(db);
  await seeds.user(db);
  await seeds.allRecipes(db);
}

main();
