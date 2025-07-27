<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <div>
    <div v-if="authStore.user">
      <h2 class="mb-5 text-5xl font-bold">
        Hello there
      </h2>

      <p class="mb-5">
        You are already logged in!
      </p>

      <NuxtLink class="btn btn-secondary" to="/dashboard/home">
        Go To Dashboard
      </NuxtLink>
    </div>

    <div v-else-if="!authStore.user && !authStore.loading" class="bg-secondary-content p-10">
      <h2 class="mb-5 text-lg font-bold">
        Please Sign In or Sign Up first
      </h2>

      <div class="flex justify-center gap-2">
        <NuxtLink class="btn btn-secondary m-2" to="/auth/sign-in">
          Sign In
        </NuxtLink>

        <NuxtLink class="btn btn-secondary m-2" to="/auth/sign-up">
          Sign Up
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
