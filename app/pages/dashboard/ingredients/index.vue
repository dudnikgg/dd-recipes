<script setup lang="ts">
const { data: ingredients, status } = useFetch("/api/ingredients");
</script>

<template>
  <main>
    <AppContentHeader
      title="Ingredients"
    >
      <template #buttons>
        <NuxtLink
          :to="{ name: 'dashboard-ingredients-add' }"
          class="btn btn-accent"
        >
          Add ingredients
        </NuxtLink>
      </template>
    </AppContentHeader>

    <div class="flex flex-wrap items-start gap-6 h-full mt-10">
      <div v-if="status === 'pending'" class="flex h-full flex-1 justify-center items-center">
        <span class="loading loading-spinner text-secondary w-24" />
      </div>

      <template v-else-if="ingredients && ingredients.length > 0">
        <NuxtLink
          v-for="ingredient in ingredients"
          :key="ingredient.id"
          :to="{
            name: 'dashboard-ingredients-id',
            params: { id: ingredient.id },
          }"
          class="card bg-base-300 w-80 shadow-sm"
        >
          <figure>
            <img
              src="~/assets/images/ingredient-placeholder.png"
              :alt="ingredient.name"
            >
          </figure>

          <div class="card-body">
            <h2 class="card-title">
              {{ ingredient.name }}
              <div class="badge badge-secondary">
                NEW
              </div>
            </h2>

            <div class="card-actions justify-end">
              <div class="badge badge-outline">
                {{ ingredient.measurement_unit }}
              </div>
            </div>
          </div>
        </NuxtLink>
      </template>

      <div v-else>
        You have no ingredients, yet...
      </div>
    </div>
  </main>
</template>
