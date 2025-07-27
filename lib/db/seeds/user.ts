import type { DB } from "../index";

import { user } from "../schema/auth-schema";
import users from "./data/users.json";

export default async function seed(db: DB) {
  await Promise.all(
    users.map(async (u) => {
      await db.insert(user).values({ ...u, createdAt: new Date(), updatedAt: new Date() });
    }),
  );
}
