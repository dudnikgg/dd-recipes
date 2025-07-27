<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <div>
    Hello, {{ authStore.user?.name ?? authStore.user?.username }}!
  </div>
</template>

<style scoped></style>
