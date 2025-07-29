<script setup lang="ts">
const route = useRoute();

const ingredient = "Some ingredient";
</script>

<template>
  <main>
    <AppPageHeader
      title="Ingredient"
      show-back-button
    >
      <template #buttons>
        <NuxtLink
          :to="{
            name: 'dashboard-ingredients-id-edit',
            params: { id: 'id' in route.params ? route.params.id : '' },
          }"
          class="btn btn-accent"
        >
          Edit ingredient
        </NuxtLink>
      </template>
    </AppPageHeader>

    {{ ingredient }}
  </main>
</template>
