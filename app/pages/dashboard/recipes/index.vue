<script setup lang="ts">
const { data: recipes, status } = useFetch("/api/recipes");

const loading = computed(() => status.value === "pending");
</script>

<template>
  <AppPageWrapper>
    <AppPageHeader
      title="Recipes"
    >
      <template #buttons>
        <NuxtLink
          :to="{ name: 'dashboard-recipes-add' }"
          class="btn btn-accent"
        >
          Add recipe
        </NuxtLink>
      </template>
    </AppPageHeader>

    <AppPageContentWrapper :loading="loading">
      <template v-if="recipes && recipes.length" #content>
        <NuxtLink
          v-for="recipe in recipes"
          :key="recipe.id"
          :to="{
            name: 'dashboard-recipes-slug',
            params: { slug: recipe.slug },
          }"
          class="card bg-base-300 w-80 shadow-sm"
        >
          <figure>
            <img
              src="~/assets/images/recipe-placeholder.png"
              :alt="recipe.name"
            >
          </figure>

          <div class="card-body">
            <h2 class="card-title">
              {{ recipe.name }}
            </h2>

            <p class="line-clamp-3">
              {{ recipe.instruction }}
            </p>

            <div class="card-actions justify-end">
              <div class="badge badge-outline">
                {{ recipe.recipeCategory?.name }}
              </div>
            </div>
          </div>
        </NuxtLink>
      </template>
    </AppPageContentWrapper>
  </AppPageWrapper>
</template>
