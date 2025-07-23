import type { UserSignUp } from "~~/lib/types/user";

import { useAuth } from "~/composables/use-auth";

export const useAuthStore = defineStore("useAuthStore", () => {
  const { authClient } = useAuth();

  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);
  const whichAuthForm = ref("signup");

  function setWhichAuthFrom(formType: string) {
    whichAuthForm.value = formType;
  }

  async function init() {
    const data = await authClient.useSession(useFetch);
    session.value = data;
  }

  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);

  async function signUp({ email, name, password, username }: UserSignUp) {
    const { csrf } = useCsrf();

    await authClient.signUp.email({
      email,
      name,
      password,
      username,
      fetchOptions: {
        credentials: "include",
        headers: {
          "csrf-token": csrf,
        },
      },
    });
  }

  async function signIn() {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);

    await authClient.signIn.email({

    });
  }

  async function loginWithGoogle() {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);

    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      errorCallbackURL: "/error",
      fetchOptions: {
        headers,
      },
    });
  }

  async function signOut() {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);

    await authClient.signOut({
      fetchOptions: {
        headers,
      },
    });
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
    whichAuthForm,
    setWhichAuthFrom,
  };
});
