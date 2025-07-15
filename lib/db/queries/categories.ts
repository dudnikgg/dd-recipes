import { and, eq } from "drizzle-orm/sql";

import type { SelectCategory } from "../schema";

import db from "..";
import { category } from "../schema";

export async function findCategories() {
  return db.query.category.findMany();
}

export async function findCategoryByName(existing: SelectCategory) {
  return db.query.category.findFirst({
    where:
      and(
        eq(category.name, existing.name),
      ),
  });
}
