<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <AppPageWrapper>
    <AppPageHeader title="Home" />

    <AppPageContentWrapper>
      <template #content>
        <div>
          Hello, {{ authStore.user?.name ?? authStore.user?.username }}!
        </div>
      </template>
    </AppPageContentWrapper>
  </AppPageWrapper>
</template>

<style scoped></style>
