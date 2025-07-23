import type { UserWithId } from "~~/lib/types/user";

import { auth } from "~~/lib/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  event.context.user = session?.user as unknown as UserWithId;

  const restrictedPaths = [
    "/dashboard",
    "/recipes",
    "/ingredients",
    "/planner",
    "/settings",
  ];
  if (restrictedPaths.some(path => event.path.startsWith(path))) {
    if (!session?.user) {
      await sendRedirect(event, "/", 302);
    }
  }
});
