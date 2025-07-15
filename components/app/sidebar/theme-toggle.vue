<script setup lang="ts">
const { isShrinkView } = defineProps<{
  isShrinkView: boolean;
}>();

const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dracula" || colorMode.value === "dark";
  },
  set(value) {
    colorMode.preference = value ? "dracula" : "nord";
  },
});

const switched = computed(() => {
  return colorMode.value === "dark" || colorMode.value === "dracula";
});
</script>

<template>
  <div class="p-1 overflow-hidden bg-base-100 shrink-0">
    <ColorScheme>
      <template #placeholder>
        <div class="skeleton h-[50px] rounded-none w-full" />
      </template>

      <label
        for="theme-toggle"
        class="flex justify-between relative cursor-pointer before:absolute before:z-0 before:inline-block before:w-1/2 before:h-full bg-base-300 before:bg-secondary before:top-1/2 before:-translate-y-1/2 before:transition-[left] before:duration-300"
        :class="{
          'before:left-1/2': switched && !isShrinkView,
          'before:left-0': !switched,
          'before:w-full': isShrinkView,
        }"
      >
        <input
          id="theme-toggle"
          v-model="isDark"
          class="opacity-0 w-0 h-0 absolute"
          type="checkbox"
        >

        <div
          class="h-[50px] flex items-center justify-center p-2 text-center z-10 shrink-0 leading-5"
          :class="{
            'w-full': isShrinkView,
            'w-1/2': !isShrinkView,
            'hidden': isShrinkView && switched,
          }"
        >
          <NuxtIcon
            name="line-md:sunny-outline"
            :class="{ 'mr-0.5': !isShrinkView }"
            size="18"
          />

          <span
            class="text-sm opacity-100 translate-x-0 whitespace-nowrap overflow-hidden text-ellipsis"
            :class="{
              'w-0 opacity-0 -translate-x-2': isShrinkView,
            }"
          >
            Light
          </span>
        </div>

        <div
          class="h-[50px] flex items-center justify-center p-2 text-center z-10 shrink-0 leading-5"
          :class="{
            'w-full': isShrinkView,
            'w-1/2': !isShrinkView,
            'hidden': isShrinkView && !switched,
          }"
        >
          <NuxtIcon
            name="line-md:moon-simple"
            :class="{ 'mr-1': !isShrinkView }"
            size="18"
          />

          <span
            class="text-sm opacity-100 translate-x-0 whitespace-nowrap overflow-hidden text-ellipsis"
            :class="{
              'w-0 opacity-0 -translate-x-2': isShrinkView,
            }"
          >Dark</span>
        </div>
      </label>
    </ColorScheme>
  </div>
</template>
