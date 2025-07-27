<script setup lang="ts">
const route = useRoute("dashboard-recipes-slug");

const { data: recipe, status } = useLazyFetch(`/api/recipes/${route.params.slug}`);

const loading = computed(() => status.value === "pending");
</script>

<template>
  <div class="h-full">
    <AppContentHeader title="Recipe" show-back-button>
      <template #buttons>
        <NuxtLink
          :to="{
            name: 'dashboard-recipes-slug-edit',
            params: { slug: 'slug' in route.params ? route.params.slug : '' },
          }"
          class="btn btn-accent"
        >
          Edit recipe
        </NuxtLink>
      </template>
    </AppContentHeader>

    <div class="flex flex-wrap gap-6 h-full mt-10" :class="loading ? 'items-center' : 'items-start'">
      <AppLoader
        :loading="loading"
        size="large"
      />

      <template v-if="recipe">
        <div class="card-body">
          <div class="card-actions">
            {{ recipe.recipeCategory.name }}
          </div>

          <h2 class="card-title">
            {{ recipe.name }}
          </h2>

          <p class="">
            {{ recipe.instruction }}
          </p>

          <div class="flex flex-col mt-10 ">
            <p v-for="ingredient in recipe.ingredients" :key="ingredient.id">
              {{ ingredient.name }}: {{ ingredient.amount }} ({{ ingredient.measurement_unit }})
            </p>
          </div>
        </div>
      </template>

      <div v-if="!loading && !recipe">
        You have no recipes, yet...
      </div>
    </div>
  </div>
</template>
