export default defineNuxtRouteMiddleware((from) => {
  const { authClient } = useAuth();
  const session = authClient.useSession();

  const isRestrictedPage = !from.fullPath.includes("auth");
  if (!session.value.data?.user && isRestrictedPage) {
    return navigateTo("/auth/sign-in");
  }
});
