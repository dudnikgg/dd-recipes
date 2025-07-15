<script setup lang="ts">
const route = useRoute();

const { data: ingredient } = useFetch("test", {
});
</script>

<template>
  <main>
    <AppContentHeader
      title="Ingredient"
      show-back-button
    >
      <template #buttons>
        <NuxtLink
          :to="{
            name: 'ingredients-id-edit',
            params: { id: 'id' in route.params ? route.params.id : '' },
          }"
          class="btn btn-accent"
        >
          Edit ingredient
        </NuxtLink>
      </template>
    </AppContentHeader>

    {{ ingredient }}
  </main>
</template>
