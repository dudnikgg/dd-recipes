<script setup lang="ts">
const { loading = false } = defineProps<{
  loading?: boolean;
}>();
</script>

<template>
  <div class="flex flex-wrap gap-6 h-full mt-10" :class="loading ? 'items-center' : 'items-start'">
    <AppLoader :loading="loading" size="large" />

    <slot v-if="$slots.content" name="content" />

    <div v-if="!loading && !$slots.content">
      There is no content here, yet...
    </div>
  </div>
</template>

<style scoped></style>
