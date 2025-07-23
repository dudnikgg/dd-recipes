import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";

export function useAuth() {
  const authClient = createAuthClient({
    plugins: [
      usernameClient(),
    ],
  });

  return {
    authClient,
  };
}
