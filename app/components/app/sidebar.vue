<script setup lang="ts">
const emits = defineEmits<{
  (e: "changeView", isShrink: boolean): void;
}>();

const isShrinkView = ref(false);
function handleSidebarView() {
  isShrinkView.value = !isShrinkView.value;
  localStorage.setItem("isShrinkView", isShrinkView.value.toString());
  emits("changeView", isShrinkView.value);
}

onMounted(() => {
  isShrinkView.value = localStorage.getItem("isShrinkView") === "true";
  emits("changeView", isShrinkView.value);
});
</script>

<template>
  <div class="flex flex-col bg-base-300 ronded p-2 transition-[width] duration-300 relative">
    <button
      class="absolute rounded-[50%] border-none -right-2.5 top-20 flex items-center p-0 cursor-pointer justify-center hover:opacity-85"
      :class="isShrinkView ? '' : 'rotate-180'"
      type="button"
      :aria-label="isShrinkView ? 'Expand Sidebar' : 'Shrink Sidebar'"
      :title="isShrinkView ? 'Expand' : 'Shrink'"
      @click="handleSidebarView"
    >
      <NuxtIcon name="material-symbols:expand-circle-right-outline-rounded" size="32" />
    </button>

    <AppSidebarThemeToggle :is-shrink-view="isShrinkView" />

    <div class="flex flex-col h-full">
      <ul class="list-none p-0 m-0 mt-12">
        <AppSidebarListItem
          icon="material-symbols:dashboard"
          text="Dashboard"
          to="/dashboard/home"
          :is-shrink-view="isShrinkView"
        />

        <AppSidebarListItem
          icon="bx:bxs-food-menu"
          text="Recipes"
          to="/dashboard/recipes"
          :is-shrink-view="isShrinkView"
        />

        <AppSidebarListItem
          icon="material-symbols:grocery"
          text="Ingredients"
          to="/dashboard/ingredients"
          :is-shrink-view="isShrinkView"
        />

        <AppSidebarListItem
          icon="material-symbols:list-alt-outline-sharp"
          text="Planner"
          to="/dashboard/planner"
          :is-shrink-view="isShrinkView"
        />

        <AppSidebarListItem
          icon="material-symbols:settings"
          text="Settings"
          to="/dashboard/settings"
          :is-shrink-view="isShrinkView"
        />
      </ul>

      <AppSidebarUser />
    </div>
  </div>
</template>

<style scoped></style>
