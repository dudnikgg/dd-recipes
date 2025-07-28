<script setup lang="ts">
import type { UserSignIn } from "~~/lib/types/user";
import type { FetchError } from "ofetch";

import { SignInSchema } from "~~/lib/zod-schemas";

const authStore = useAuthStore();
const submitError = ref();

const { handleSubmit, errors, values, setErrors } = useForm<UserSignIn>({
  validationSchema: toTypedSchema(SignInSchema),
  initialValues: {},
});

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    const { data, error } = await authStore.signIn(values);
    if (!data && error) {
      submitError.value = error.message || "An unknown error occurred.";
    }
    else {
      navigateTo("/dashboard/home");
    }
  }
  catch (e) {
    const error = e as FetchError;

    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = error.data?.statusMessage || error.statusMessage || "An unknown error occured.";
  }
});
</script>

<template>
  <form action="" class="flex flex-col gap-4">
    <div
      v-if="submitError"
      role="alert"
      class="alert alert-error rounded-none"
    >
      <NuxtIcon name="ic:twotone-report-gmailerrorred" size="24" />

      <span>{{ submitError }}</span>
    </div>

    <AppFormTextField
      v-model.trim="values.usernameOrEmail"
      name="usernameOrEmail"
      label="Username or Email"
      placeholder="Your username or email"
      :error="errors.usernameOrEmail"
    />

    <AppFormTextField
      v-model.trim="values.password"
      type="password"
      name="password"
      label="Password"
      placeholder="Your password"
      :error="errors.password"
    />

    <button
      :disabled="authStore.loading"
      class="btn bg-secondary text-secondary-content "
      type="submit"
      @click="onSubmit"
    >
      <span v-if="authStore.loading" class="loading loading-spinner loading-md" />

      Sign In
    </button>
  </form>
</template>

<style scoped></style>
