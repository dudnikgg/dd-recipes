<script setup lang="ts">
const { size = "medium" } = defineProps<{
  loading: boolean;
  size?: "small" | "medium" | "large";
}>();

const sizesMap = computed(() => {
  const sizes = {
    small: "w-4",
    medium: "w-16",
    large: "w-24",
  };

  return sizes[size];
});
</script>

<template>
  <div v-if="loading" class="flex h-full flex-1 justify-center items-center">
    <span
      class="loading loading-spinner text-secondary"
      :class="sizesMap"
    />
  </div>
</template>
