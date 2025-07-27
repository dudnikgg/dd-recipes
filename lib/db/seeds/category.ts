import type { DB } from "../index";

import { category } from "../schema/category";
import categories from "./data/categories.json";

export default async function seed(db: DB) {
  await Promise.all(
    categories.map(async (cat) => {
      await db.insert(category).values({ ...cat });
    }),
  );
}
