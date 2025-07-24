<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <div class="navbar row-span-1 bg-base-300 shadow-sm h-16">
    <div class="navbar-start">
      <NuxtLink to="/" class="btn btn-ghost text-xl">
        DD Recipes
      </NuxtLink>
    </div>

    <div class="navbar-end gap-4">
      <div>
        <div v-if="!authStore.loading && authStore.user" class="dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            class="btn btn-accent m-2 mr-0"
          >
            <div v-if="authStore.user.image" class="avatar">
              <div class="w-8 rounded-full">
                <img :src="authStore.user.image" :alt="authStore.user.name">
              </div>
            </div>
            {{ authStore.user.name }}
          </div>

          <ul tabindex="0" class="w-fit dropdown-content menu text-accent-content bg-accent z-1 p-1 shadow-sm">
            <li>
              <NuxtLink to="/sign-out" class="rounded-none">
                Sign Out
                <NuxtIcon name="ic:baseline-logout" size="18" />
              </nuxtlink>
            </li>
          </ul>
        </div>

        <div
          v-else-if="!authStore.user && !authStore.loading"
          class="flex gap-2"
        >
          <NuxtLink
            class="btn btn-secondary m-2"
            to="/auth/sign-in"
          >
            Sign In
          </NuxtLink>

          <NuxtLink
            class="btn btn-secondary m-2"
            to="/auth/sign-up"
          >
            Sign Up
          </NuxtLink>
        </div>

        <div v-else-if="authStore.loading" class="skeleton h-10 w-32 m-2 bg-base-200 rounded-none" />
      </div>
    </div>
  </div>
</template>
