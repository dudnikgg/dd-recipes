<script setup lang="ts">
const authStore = useAuthStore();
await authStore.init();

const isShrinkView = ref();
</script>

<template>
  <div class="grid grid-rows-[auto_1fr_auto] h-dvh">
    <AppNavbar />

    <main
      class="grid transition-[grid-template-columns] row-span-1 min-h-0"
      :class="isShrinkView ? 'grid-cols-[100px_1fr]' : 'grid-cols-[240px_1fr]'"
    >
      <AppSidebar @change-view="(isShrink: boolean) => isShrinkView = isShrink" />

      <div class="transition-all duration-300 py-2 px-10 flex-1 overflow-x-auto">
        <slot />
      </div>
    </main>
  </div>
</template>
