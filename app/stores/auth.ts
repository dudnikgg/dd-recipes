import type { UserSignIn, UserSignUp } from "~~/lib/types/user";

import { useAuth } from "~/composables/use-auth";

export const useAuthStore = defineStore("useAuthStore", () => {
  const { authClient } = useAuth();

  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);
  const getCsrfHeaders = () => {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);
    return headers;
  };

  async function init() {
    const data = await authClient.useSession(useFetch);
    session.value = data;
  }

  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);

  async function signUp({ email, name, password, username }: UserSignUp) {
    const response = await authClient.signUp.email({
      email,
      name,
      password,
      username,
      fetchOptions: {
        credentials: "include",
        headers: getCsrfHeaders(),
      },
    });

    return response;
  }

  async function signIn({ usernameOrEmail, password }: UserSignIn) {
    const response = await authClient.signIn.email({
      email: usernameOrEmail,
      password,
      fetchOptions: {
        credentials: "include",
        headers: getCsrfHeaders(),
      },
    });

    return response;
  }

  async function loginWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard/home",
      errorCallbackURL: "/error",
      fetchOptions: {
        headers: getCsrfHeaders(),

      },
    });
  }

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        headers: getCsrfHeaders(),
      },
    });
    session.value = null;
    await init();
    navigateTo("/");
  }

  return {
    init,
    loading,
    signIn,
    signUp,
    signOut,
    loginWithGoogle,
    user,
  };
});
