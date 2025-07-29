<script setup lang="ts">
const { data: ingredients, status } = useLazyFetch("/api/ingredients");
const loading = computed(() => status.value === "pending");
</script>

<template>
  <AppPageWrapper>
    <AppPageHeader
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
    </AppPageHeader>

    <AppPageContentWrapper :loading="loading">
      <template v-if="ingredients && ingredients.length > 0" #content>
        <div class="flex flex-wrap items-start gap-6 h-full mt-10">
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
        </div>
      </template>
    </AppPageContentWrapper>
  </AppPageWrapper>
</template>
