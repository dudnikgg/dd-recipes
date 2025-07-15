<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";

import { insertIngredientSchema } from "~/lib/db/schema";
import { MeasurementUnit } from "~/lib/type";

const submitError = ref("");
const loading = ref(false);
const submited = ref(false);
const { $csrfFetch } = useNuxtApp();

const { handleSubmit, errors, meta, setErrors } = useForm({
  validationSchema: toTypedSchema(insertIngredientSchema),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    await $csrfFetch("/api/ingredients", {
      method: "POST",
      body: values,
    });
    submited.value = true;
    navigateTo("/ingredients");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = error.data?.statusMessage || error.statusMessage || "An unknown error occured.";
  }
  loading.value = false;
});

onBeforeRouteLeave(() => {
  if (!submited.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you want to leave?");
    if (!confirm) {
      return false;
    }

    return true;
  }
});
</script>

<template>
  <main>
    <AppContentHeader
      title="New ingredients"
      show-back-button
    />

    <div class="container mx-auto mt-10">
      <div class="flex flex-col gap-4 max-w-1/3 mx-auto mt-10">
        <div
          v-if="submitError"
          role="alert"
          class="alert alert-error rounded-none"
        >
          <NuxtIcon name="ic:twotone-report-gmailerrorred" size="24" />

          <span>{{ submitError }}</span>
        </div>

        <form
          action=""
          class="flex flex-col gap-4"
          @submit.prevent="onSubmit"
        >
          <div class="join">
            <Field
              :disabled="loading"
              name="name"
              label="Ingredient"
              type="text"
              placeholder="Milk/Meat"
              class="join-item input w-full rounded-none"
              :error="errors.name"
            />

            <Field
              id="measurement_unit"
              as="select"
              :disabled="loading"
              name="measurement_unit"
              label="Measurement Unit"
              class="select join-item rounded-none w-auto min-w-24"
              :error="errors.measurement_unit"
            >
              <option
                v-for="(unit, i) in Object.keys(MeasurementUnit)"
                :key="`${unit}${i}`"
                :selected="i === 0"
                :value="unit"
              >
                {{ unit }}
              </option>
            </Field>
          </div>

          <div class="flex justify-end">
            <button
              :disabled="loading"
              type="submit"
              class="btn btn-accent"
            >
              Add
              <span v-if="loading" class="loading loading-spinner loading-sm" />

              <NuxtIcon
                v-else
                name="bx:bxs-food-menu"
                size="18"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
