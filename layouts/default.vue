<script setup lang="ts">
const authStore = useAuthStore();
await authStore.init();
</script>

<template>
  <div class="grid grid-rows-[auto_1fr_auto] min-h-dvh">
    <AppNavbar />

    <main class="row-span-1 grid grid-cols-1 min-h-0">
      <slot />
    </main>

    <footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
      <aside>
        <p>Copyright © {{ new Date().getFullYear() }} - Denys Dudnik &lt;dudnik.gg@gmail.com&gt; </p>
      </aside>
    </footer>
  </div>
</template>
