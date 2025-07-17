<script setup lang="ts">
const { addClass = "", name, showError = false } = defineProps<{
  label?: string;
  disabled?: boolean;
  name: string;
  placeholder?: string;
  addClass?: string;
  showError?: boolean;
}>();

const { errorMessage, value } = useField(name);

const combinedClasses = computed(() => {
  return cn({
    "input w-full": true,
    "input-error": errorMessage.value,
  }, addClass);
});
</script>

<template>
  <fieldset class="fieldset flex-1 flex p-0">
    <legend v-if="label" class="fieldset-legend">
      {{ label }}
    </legend>

    <input
      v-model.trim="value"
      type="number"
      :disabled="disabled"
      :class="combinedClasses"
      :placeholder="placeholder"
      :name="name"
      min="1"
      max="1000"
    >

    <p v-if="showError && errorMessage" class="fieldset-label text-error">
      {{ errorMessage }}
    </p>
  </fieldset>
</template>

<style scoped></style>
