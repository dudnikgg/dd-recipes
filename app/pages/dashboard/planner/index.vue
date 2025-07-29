<script setup lang="ts">
import type { SelectIngredient, SelectRecipe } from "~~/lib/db/schema";
import type { DailyMealsSelection, Meals } from "~~/lib/types/ingredients";

import Multiselect from "vue-multiselect";

const meals: typeof Meals = ["breakfest", "lunch", "dinner"];

const { data: recipes, status } = await useLazyFetch("/api/recipes-with-ingredients");

const loading = computed(() => status.value === "pending");

const { days, getSelectedRecipes, setSelectedRecipes } = usePlannerStore();
const selections = ref<DailyMealsSelection[]>(getSelectedRecipes());

watch(selections.value, () => {
  setSelectedRecipes(selections.value);
});

const shoppingList = ref<SelectIngredient[]>();
function generateShoppingList() {
  const ingredients: SelectIngredient[] = [];
  for (const day of selections.value) {
    for (const recipe of Object.values(day.meals)) {
      ingredients.push(...(recipe?.ingredients ?? []));
    }
  }

  const ingredientMap = new Map<string, SelectIngredient>();
  for (const ingredient of ingredients) {
    const key = `${ingredient.name}__${ingredient.measurement_unit}`;

    if (ingredientMap.has(key)) {
      ingredientMap.get(key)!.amount += ingredient.amount;
    }
    else {
      ingredientMap.set(key, { ...ingredient });
    }
  }

  shoppingList.value = Array.from(ingredientMap.values()).sort((a, b) => b.amount - a.amount);
}
</script>

<template>
  <AppPageWrapper>
    <AppPageHeader title="Planner">
      <template #buttons>
        <button class="btn btn-accent" @click="generateShoppingList">
          Generate
        </button>
      </template>
    </AppPageHeader>

    <AppPageContentWrapper :loading="loading">
      <template v-if="recipes && recipes.length > 0" #content>
        <div class="flex mt-10" :class="status === 'pending' ? 'h-full' : 'h-auto'">
          <div class="flex-1">
            <div class="grid grid-cols-[150px_1fr_1fr_1fr] text-center">
              <div class="px-2 py-1" />

              <span v-for="meal in meals" :key="meal">
                {{ meal }}
              </span>
            </div>

            <div>
              <div
                v-for="(day, idx) in days"
                :key="day.iso"
                class="grid grid-cols-[150px_1fr_1fr_1fr] gap-10 p-3 items-center"
                :class="{ 'pointer-events-none opacity-50': isPast(day.date) }"
              >
                <div class>
                  {{ day.formatted }}
                </div>

                <div
                  v-for="meal in meals"
                  :key="`${day.iso}-${meal}`"
                  class=""
                >
                  <Multiselect
                    v-if="selections[idx]"
                    v-model="selections[idx].meals[meal]"
                    :options="recipes"
                    :custom-label="(item: SelectRecipe) => item.name"
                    :searchable="true"
                    :close-on-select="true"
                    :show-labels="true"
                    :allow-empty="false"
                    open-direction="bottom"
                    :placeholder="`Choose ${meal} recipe`"
                    :aria-label="`Choose ${meal} recipe`"
                    class=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <template v-if="shoppingList">
          <div class="flex flex-col mt-10">
            <p
              v-for="item in shoppingList"
              :key="item.id"
            >
              {{ item.name }}: {{ item.amount }} ({{ item.measurement_unit }})
            </p>
          </div>
        </template>
      </template>
    </AppPageContentWrapper>
  </AppPageWrapper>
</template>
