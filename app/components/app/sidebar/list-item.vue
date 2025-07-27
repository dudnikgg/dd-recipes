<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

const { isShrinkView, icon = "", href = "", to = "" } = defineProps<{
  icon?: string;
  text: string;
  to?: RouteLocationRaw;
  href?: string;
  isShrinkView: boolean;
}>();

const listItemTextShrinkedView = computed(() => {
  return isShrinkView ? "absolute p-2 left-full opacity-0 invisible bg-secondary text-sm rounded transition-[left] transition-position" : "";
});
</script>

<template>
  <li class="animate-fade-in-item flex items-center opacity-0 py-2 relative border-t border-base-100 first:border-none">
    <div
      class="w-full rounded-none"
      :class="{ 'tooltip tooltip-right': isShrinkView }"
      :data-tip="text"
    >
      <NuxtLink
        :to="to || href"
        class="w-full p-3.5 rounded-none flex items-center cursor-pointer hover:bg-base-100"
        :class="[
          isShrinkView ? 'justify-center' : 'justify-start',
        ]"
        active-class="bg-base-200"
      >
        <NuxtIcon
          class="size-5 inline-block shrink-0"
          :class="isShrinkView ? 'mr-0' : 'mr-2'"
          :name="icon"
          size="24"
        />

        <span class="whitespace-nowrap overflow-hidden text-ellipsis leading-5" :class="listItemTextShrinkedView">
          {{ text }}
        </span>
      </NuxtLink>
    </div>
  </li>
</template>

<style scoped></style>
