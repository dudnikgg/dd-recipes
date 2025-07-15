<script setup lang="ts">
const { type = "text", addClass = "", name } = defineProps<{
  label?: string;
  disabled?: boolean;
  name: string;
  placeholder?: string;
  type?: string;
  addClass?: string;
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
</script>

<template>
  <fieldset class="fieldset flex-1">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>

    <input
      v-model.trim="value"
      :type="type ?? 'text'"
      :disabled="disabled"
      :class="combinedClasses"
      :placeholder="placeholder"
      :name="name"
    >

    <p v-if="errorMessage" class="fieldset-label text-error">
      {{ errorMessage }}
    </p>
  </fieldset>
</template>

<style scoped></style>
