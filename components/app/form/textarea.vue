<script setup lang="ts">
const { addClass = "", name } = defineProps<{
  label?: string;
  disabled?: boolean;
  name: string;
  placeholder?: string;
  addClass?: string;
}>();

const { errorMessage, value } = useField<string>(name, undefined, {
  syncVModel: true,
});

const combinedClasses = computed(() => {
  return cn({
    "textarea w-full": true,
    "textarea-error": errorMessage.value,
  }, addClass);
});
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>

    <textarea
      v-model.trim="value"
      :disabled="disabled"
      :class="combinedClasses"
      :placeholder="placeholder"
      :name="name"
    />

    <p v-if="errorMessage" class="fieldset-label text-error">
      {{ errorMessage }}
    </p>
  </fieldset>
</template>

<style scoped></style>
