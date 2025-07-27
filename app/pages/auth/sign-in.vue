<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <div
    v-if="!authStore.user"
    class="bg-secondary-content text-secondary p-10 flex flex-col gap-4"
  >
    <h4 class="text-2xl font-bold mb-10">
      Sign In
    </h4>

    <AppAuthSigninForm />

    <AppAuthButton />
  </div>
</template>

<style scoped>

</style>
