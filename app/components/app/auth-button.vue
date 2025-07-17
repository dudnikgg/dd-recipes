<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <button
    :disabled="authStore.loading"
    class="btn bg-black text-white border-black"
    @click="authStore.signIn"
  >
    <span v-if="authStore.loading" class="loading loading-spinner loading-md" />

    <NuxtIcon v-else name="bi:github" />
    Login with GitHub
  </button>
</template>

<style scoped>

</style>
