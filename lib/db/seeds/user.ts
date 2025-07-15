import type { db } from "~/lib/db/index";

import { user } from "~/lib/db/schema/auth-schema";

import users from "./data/users.json";

export default async function seed(db: db) {
  await Promise.all(
    users.map(async (u) => {
      await db.insert(user).values({ ...u, createdAt: Date.now(), updatedAt: Date.now() });
    }),
  );
}
