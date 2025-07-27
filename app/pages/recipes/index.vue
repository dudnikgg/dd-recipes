<script setup lang="ts">
const { data: recipes, status } = useLazyFetch("/api/recipes");

const loading = computed(() => status.value === "pending");
</script>

<template>
  <div class="h-full">
    <AppContentHeader
      title="Recipes"
    >
      <template #buttons>
        <NuxtLink
          :to="{ name: 'recipes-add' }"
          class="btn btn-accent"
        >
          Add recipe
        </NuxtLink>
      </template>
    </AppContentHeader>

    <div
      class="flex flex-wrap gap-6 h-full mt-10"
      :class="loading ? 'items-center' : 'items-start'"
    >
      <AppLoader
        :loading="loading"
        size="large"
      />

      <template v-if="recipes && recipes.length > 0">
        <NuxtLink
          v-for="recipe in recipes"
          :key="recipe.id"
          :to="{
            name: 'recipes-slug',
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

      <div v-if="!loading && !recipes?.length">
        You have no recipes, yet...
      </div>
    </div>
  </div>
</template>
