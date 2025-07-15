import type { db } from "~/lib/db/index";

import { category } from "~/lib/db/schema/category";

import categories from "./data/categories.json";

export default async function seed(db: db) {
  await Promise.all(
    categories.map(async (cat) => {
      await db.insert(category).values({ ...cat });
    }),
  );
}
