<script setup lang="ts">
const { title = "", showBackButton = false } = defineProps<{
  title?: string;
  showBackButton?: boolean;
}>();
const router = useRouter();
</script>

<template>
  <header class="flex justify-between items-center py-3 border-b border-b-accent">
    <h3>
      {{ title }}
    </h3>

    <div class="flex gap-4">
      <slot name="buttons" />

      <button
        v-if="showBackButton"
        class="btn btn-secondary"
        @click="router.back()"
      >
        Go back
        <NuxtIcon name="ph:key-return" size="24" />
      </button>
    </div>
  </header>
</template>
