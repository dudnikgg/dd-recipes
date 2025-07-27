<script setup lang="ts">
const emits = defineEmits<{
  (e: "changeView", isShrink: boolean): void;
}>();

const authStore = useAuthStore();

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
      :class="isShrinkView ? '' : 'rotate-90'"
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

      <div class="sidebar-profileSection mt-auto">
        <div v-if="!authStore.loading && authStore.user" class="w-full dropdown dropdown-top dropdown-end flex">
          <div
            tabindex="0"
            role="button"
            class="btn btn-accent py-4 px-1 flex-1"
          >
            <div v-if="authStore.user.image" class="avatar">
              <div class="w-8 rounded-full">
                <img :src="authStore.user.image" :alt="authStore.user.name">
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
    </div>
  </div>
</template>

<style scoped></style>
