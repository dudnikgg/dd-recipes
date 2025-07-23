<script setup lang="ts">
import type { UserSignUp } from "~~/lib/types/user";

import { SignUpSchema } from "~~/lib/zod-schemas";

const authStore = useAuthStore();
const submitError = ref();

const { handleSubmit, errors, values } = useForm<UserSignUp>({
  validationSchema: toTypedSchema(SignUpSchema),
  initialValues: {},
});

const onSubmit = handleSubmit(async (values) => {
  authStore.signUp(values);
});
</script>

<template>
  <div class="bg-secondary-content text-secondary p-10">
    <h4 class="text-2xl font-bold mb-10">
      Sign Up
    </h4>

    <form action="" class="flex flex-col gap-4">
      <AppFormTextField
        v-model.trim="values.name"
        name="name"
        label="Name"
        placeholder="Your name"
        :error="errors.name"
      />

      <AppFormTextField
        v-model.trim="values.username"
        name="username"
        label="Username"
        placeholder="Your username"
        :error="errors.username"
      />

      <AppFormTextField
        v-model.trim="values.email"
        name="email"
        label="Email"
        placeholder="Your email"
        :error="errors.email"
      />

      <AppFormTextField
        v-model.trim="values.password"
        type="password"
        name="password"
        label="Password"
        placeholder="Your password"
        :error="errors.password"
      />

      <div
        v-if="submitError"
        role="alert"
        class="alert alert-error rounded-none"
      >
        <NuxtIcon name="ic:twotone-report-gmailerrorred" size="24" />

        <span>{{ submitError }}</span>
      </div>

      <button
        :disabled="authStore.loading"
        class="btn bg-secondary text-secondary-content"
        type="submit"
        @click="onSubmit"
      >
        <span v-if="authStore.loading" class="loading loading-spinner loading-md" />

        Sign Up
      </button>
    </form>
  </div>
</template>

<style scoped></style>
