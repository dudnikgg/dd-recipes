<script setup lang="ts">
import type { UserSignUp } from "~~/lib/types/user";
import type { FetchError } from "ofetch";

import { useAuth } from "#imports";
import { SignUpSchema } from "~~/lib/zod-schemas";

const authStore = useAuthStore();
const { authClient } = useAuth();
const loadingUsernameCheck = ref(false);
const submitError = ref();

const { handleSubmit, errors, values, setErrors } = useForm<UserSignUp>({
  validationSchema: toTypedSchema(SignUpSchema),
  initialValues: {},
});

async function checkIfUsernameAvailable(username: string) {
  const { csrf } = useCsrf();
  const headers = new Headers();
  headers.append("csrf-token", csrf);

  const { data: isUsernameAvailable, error } = await authClient.isUsernameAvailable({
    username,
    fetchOptions: {
      credentials: "include",
      headers,
    },
  });

  if (!isUsernameAvailable?.available || error) {
    return new Error("This username is already taken");
  }
}

const usernameDebounced = debounceFn(async () => {
  const error = await checkIfUsernameAvailable(values.username);
  if (error) {
    setErrors({ username: error.message });
  }
  else {
    setErrors({ username: "" });
  }
}, 1000);

async function handleUsernameChange(value: string) {
  if (!value.length) {
    return;
  }
  loadingUsernameCheck.value = true;
  await usernameDebounced();
  loadingUsernameCheck.value = false;
}

const onSubmit = handleSubmit(async (values) => {
  authStore.signUp(values);
});
</script>

<template>
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
      :loading="loadingUsernameCheck"
      @change="handleUsernameChange"
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
</template>

<style scoped></style>
