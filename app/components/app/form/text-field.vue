<script setup lang="ts">
const { type = "text", addClass = "", name } = defineProps<{
  label?: string;
  disabled?: boolean;
  name: string;
  placeholder?: string;
  type?: string;
  addClass?: string;
  loading?: boolean;
}>();

const emits = defineEmits<{
  (e: "change", value: string): void;
}>();

const { errorMessage, value } = useField(name, undefined, {
  syncVModel: true,
});

const combinedClasses = computed(() => {
  return cn({
    "input w-full": true,
    "input-error": errorMessage.value,
  }, addClass);
});

function onChange(e: Event) {
  const target = e.target as HTMLInputElement;
  emits("change", target.value);
}
</script>

<template>
  <fieldset class="fieldset flex-1">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>

    <div class="relative">
      <input
        v-model.trim="value"
        :type="type ?? 'text'"
        :disabled="disabled"
        :class="combinedClasses"
        :placeholder="placeholder"
        :name="name"
        @change="onChange"
      >

      <AppLoader
        v-if="loading"
        class="absolute top-0 right-4 z-10"
        size="small"
        :loading="loading"
      />
    </div>

    <p v-if="errorMessage" class="fieldset-label text-error">
      {{ errorMessage }}
    </p>
  </fieldset>
</template>

<style scoped></style>
