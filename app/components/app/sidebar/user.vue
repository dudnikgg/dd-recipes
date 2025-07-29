<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <div class="sidebar-profileSection mt-auto">
    <div v-if="!authStore.loading && authStore.user" class="w-full dropdown dropdown-top dropdown-end flex">
      <div
        tabindex="0"
        role="button"
        class="flex justify-start btn btn-accent h-13 px-3.5 flex-1"
      >
        <div class="avatar">
          <div class="w-8 rounded-full">
            <img
              v-if="authStore.user.image"
              :src="authStore.user.image"
              :alt="authStore.user.name"
            >

            <NuxtIcon
              v-else
              name="stash:user-avatar"
              class="size-full"
              size="28"
            />
          </div>
        </div>
        {{ authStore.user.name }}
      </div>

      <ul tabindex="0" class="w-full dropdown-content menu menu-md mb-2 text-accent-content bg-accent z-1 p-1 shadow-sm">
        <li>
          <NuxtLink to="/auth/sign-out" class="rounded-none justify-between">
            Sign Out
            <NuxtIcon name="ic:baseline-logout" size="18" />
          </nuxtlink>
        </li>
      </ul>
    </div>

    <div v-else-if="authStore.loading" class="skeleton h-10 w-32 m-2 bg-base-200 rounded-none" />
  </div>
</template>

<style scoped></style>
