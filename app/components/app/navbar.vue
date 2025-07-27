<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <div class="navbar row-span-1 bg-base-300 shadow-sm h-16">
    <div class="navbar-start">
      <NuxtLink :to="authStore.user ? '/dashboard/home' : '/'" class="btn btn-ghost text-xl">
        DD Recipes
      </NuxtLink>
    </div>

    <div class="navbar-end gap-4" />
  </div>
</template>
