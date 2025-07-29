<script setup lang="ts">
const route = useRoute("dashboard-recipes-slug");

const { data: recipe, status } = useFetch(`/api/recipes/${route.params.slug}`);

const loading = computed(() => status.value === "pending");
</script>

<template>
  <AppPageWrapper>
    <AppPageHeader :title="recipe?.name" show-back-button>
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
    </AppPageHeader>

    <AppPageContentWrapper :loading="loading">
      <template v-if="recipe" #content>
        <div class="">
          <p class="whitespace-pre-line">
            {{ recipe.instruction }}
          </p>

          <div class="flex flex-col mt-10 ">
            <p v-for="ingredient in recipe.ingredients" :key="ingredient.id">
              {{ ingredient.name }}: {{ ingredient.amount }} ({{ ingredient.measurement_unit }})
            </p>
          </div>

          <div class="card-actions mt-20">
            {{ recipe.recipeCategory.name }}
          </div>
        </div>
      </template>
    </AppPageContentWrapper>
  </AppPageWrapper>
</template>
