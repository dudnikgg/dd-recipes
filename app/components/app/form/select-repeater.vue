<script setup lang="ts">
const { loading = false, name } = defineProps<{
  name: string;
  loading?: boolean;
}>();

const emits = defineEmits<{
  (e: "remove", index: number): void;
  (e: "reset", index: number): void;
}>();

const { remove, push, fields, update } = useFieldArray(name);

function handleAdd() {
  push({
    ingredientId: undefined as number | undefined,
    amount: undefined as number | undefined,
  });
}

function handleRemove(index: number) {
  if (index !== 0) {
    remove(index);
    emits("remove", index);
  }
  else {
    update(index, {});
    emits("reset", index);
  }
}
</script>

<template>
  <div v-show="loading" class="skeleton h-32 w-32" />

  <div>
    <fieldset
      v-for="(field, idx) in fields"
      :key="field.key"
      class="flex flex-col gap-2 mb-2 fieldset p-0"
    >
      <div class="join flex-1">
        <slot
          name="select"
          :index="idx"
          :field="field"
        />

        <slot
          name="input"
          :index="idx"
          :field="field"
        />

        <slot name="endItem" :index="idx" />

        <div class="tooltip join-item flex items-center ml-2" data-tip="Remove">
          <button
            type="button"
            class="flex cursor-pointer text-error"
            @click="handleRemove(idx)"
          >
            <NuxtIcon name="ic:sharp-remove-circle-outline" size="20" />
          </button>
        </div>
      </div>

      <slot name="errors" :index="idx" />
    </fieldset>

    <div class="tooltip join-item flex w-max hover:text-secondary items-center mr-2" data-tip="Add">
      <button
        type="button"
        class="flex cursor-pointer"
        @click="handleAdd()"
      >
        <NuxtIcon name="ic:sharp-add-circle-outline" size="40" />
      </button>
    </div>
  </div>
</template>
