<script setup lang="ts">
import type { InsertCategory, InsertRecipe, SelectCategory, SelectIngredient } from "~~/lib/db/schema";
import type { FetchError } from "ofetch";
import type { Path } from "vee-validate";

import { toTypedSchema } from "@vee-validate/zod";
import { InsertRecipeWithIngredientsSchema } from "~~/lib/db/schema";
import Multiselect from "vue-multiselect";

const submitError = ref("");
const submitting = ref(false);
const submited = ref(false);
const { $csrfFetch } = useNuxtApp();
const route = useRoute("dashboard-recipes-slug-edit");

const initialFormData: InsertRecipe = {
  name: "",
  instruction: "",
  proteins: 0,
  calories: 0,
  fats: 0,
  carbohydrates: 0,
  category: 0,
  ingredients: [{
    ingredientId: undefined,
    amount: undefined,
  }, {
    ingredientId: undefined,
    amount: undefined,
  }, {
    ingredientId: undefined,
    amount: undefined,
  }],

};

const { resetForm, handleSubmit, errors, meta, setErrors, values, setFieldValue, setFieldError } = useForm<InsertRecipe>({
  validationSchema: toTypedSchema(InsertRecipeWithIngredientsSchema),
  initialValues: initialFormData,
});

const { data: recipe, status: recipeStatus } = useFetch(`/api/recipes/${route.params.slug}`);

const { data: categories, status: categoriesStatus } = useFetch("/api/categories");
const selectedCategory = ref<InsertCategory>();

function handleSelectCategory(cat: InsertCategory) {
  selectedCategory.value = cat;
  setFieldValue("category", selectedCategory.value.id);
}

const { data: ingredients, status: ingredientsStatus } = useFetch("/api/ingredients");
const ingredientUnitMap = computed(() =>
  new Map(ingredients.value?.map(i => [i.id, i.measurement_unit]) ?? []),
);

const loading = computed(() => recipeStatus.value === "pending" || categoriesStatus.value === "pending" || ingredientsStatus.value === "pending");

const onSubmit = handleSubmit(async (values) => {
  if (!values.category) {
    setFieldError("category", "Category is required!");
    return;
  }

  try {
    submitError.value = "";
    submitting.value = true;

    const filteredValues = {
      ...values,
      ingredients: values.ingredients.filter(ing => Object.values(ing).some(val => val != null)),
    };

    await $csrfFetch(`/api/recipes/${recipe.value?.slug}`, {
      method: "PUT",
      body: filteredValues,
    });
    submited.value = true;
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = error.data?.statusMessage || error.statusMessage || "An unknown error occured.";
  }
  submitting.value = false;
});

onBeforeRouteLeave(() => {
  if (!submited.value && meta.value.touched) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you want to leave?");
    if (!confirm) {
      return false;
    }

    return true;
  }
});

const selectedIngredients = ref<SelectIngredient[]>([]);
function handleIngredientSelect(selectedItem: SelectIngredient, index: number) {
  const fieldName = `ingredients[${index}].ingredientId` as Path<InsertRecipe>;
  setFieldValue(fieldName, selectedItem.id);
  selectedIngredients.value[index] = selectedItem;
}

function handleAmountChange(event: Event, index: number) {
  const target = event.target as HTMLInputElement;
  const fieldName = `ingredients[${index}].amount` as Path<InsertRecipe>;
  setFieldValue(fieldName, Number(target.value));
}

function handleIngredientRemove(index: number) {
  selectedIngredients.value.splice(index, 1);
}

function handleIngredientReset(index: number) {
  selectedIngredients.value[index] = undefined as unknown as SelectIngredient;
}

const ingredientsOptions = ref();
watch(ingredients, () => {
  if (recipe.value) {
    const initialFormIngredients = recipe.value?.ingredients.map((ing, index) => {
      selectedIngredients.value[index] = { ...ing };
      selectedCategory.value = recipe.value?.recipeCategory;
      return {
        ingredientId: ing.id,
        amount: ing.amount,

      };
    });

    const initialRecipeCategory = recipe.value?.recipeCategory.id;

    resetForm({ values: { ...recipe.value, ingredients: initialFormIngredients, category: initialRecipeCategory } });
  }
});

ingredientsOptions.value = ingredients.value?.sort((a, b) => a.name.localeCompare(b.name));
watch(selectedIngredients.value, (newSelectedIngredients) => {
  if (newSelectedIngredients) {
    const newSelectedSet = new Set(newSelectedIngredients.map(ing => ing.id));
    ingredientsOptions.value = ingredients.value?.filter(ing => !newSelectedSet.has(ing.id));
  }
});
</script>

<template>
  <AppPageWrapper>
    <AppPageHeader title="Edit recipe" show-back-button>
      <template #buttons>
        <button
          type="submit"
          form="editRecipeForm"
          class="btn btn-accent"
          :disabled="submitting"
        >
          Save
        </button>
      </template>
    </AppPageHeader>

    <AppPageContentWrapper :loading="loading">
      <template v-if="recipe && categories && ingredients && categories.length > 0 && ingredients.length > 0" #content>
        <div class="flex flex-col gap-4 w-1/4 ">
          <div
            v-if="submitError"
            role="alert"
            class="alert alert-error rounded-none"
          >
            <NuxtIcon name="ic:twotone-report-gmailerrorred" size="24" />

            <span>{{ submitError }}</span>
          </div>

          <form
            id="editRecipeForm"
            action=""
            class="flex flex-col gap-4"
            novalidate
            @submit.prevent="onSubmit"
          >
            <AppFormTextField
              v-model.trim="values.name"
              :disabled="submitting"
              name="name"
              label="Recipe Name"
              placeholder="Lasagna"
              :error="errors.name"
            />

            <AppFormTextarea
              v-model="values.instruction"
              :disabled="submitting"
              name="instruction"
              label="Recipe Text"
              placeholder="Content..."
              :error="errors.instruction"
            />

            <div class="flex gap-4 items-center">
              <AppFormNumberField
                :disabled="submitting"
                name="calories"
                label="Calories"
                placeholder="123"
                :error="errors.calories"
              />

              <AppFormNumberField
                :disabled="submitting"
                name="proteins"
                label="Proteins"
                placeholder="12"
                :error="errors.proteins"
              />

              <AppFormNumberField
                :disabled="submitting"
                name="fats"
                label="Fats"
                placeholder="12"
                :error="errors.fats"
              />

              <AppFormNumberField
                :disabled="submitting"
                name="carbohydrates"
                label="Carbohydrates"
                placeholder="12"
                :error="errors.carbohydrates"
              />
            </div>

            <div class="flex flex-col">
              <label class="font-[600] text-xs text-base-content py-2" for="">
                Categories
              </label>

              <Multiselect
                :model-value="selectedCategory"
                :options="categories"
                :custom-label="(item: SelectCategory) => item.name"
                :searchable="true"
                :disabled="categoriesStatus === 'pending'"
                :close-on-select="true"
                :show-labels="true"
                :allow-empty="false"
                open-direction="bottom"
                placeholder="Choose category"
                aria-label="Choose category"
                class="flex-1"
                @select="handleSelectCategory"
              />

              <p class="flex flex-col text-error mt-2">
                {{ errors.category }}
              </p>
            </div>
          </form>
        </div>

        <div class="flex flex-col w-1/4">
          <label class="font-[600] text-xs text-base-content py-2" for="">
            Ingredients
          </label>

          <AppFormSelectRepeater
            name="ingredients"
            @remove="handleIngredientRemove"
            @reset="handleIngredientReset"
          >
            <template #select="{ index }">
              <Multiselect
                :model-value="selectedIngredients[index]"
                :options="ingredientsOptions || []"
                :custom-label="(item: SelectIngredient) => item.name"
                :searchable="true"
                :close-on-select="true"
                :show-labels="true"
                :allow-empty="false"
                open-direction="bottom"
                placeholder="Choose ingredient"
                aria-label="Choose ingredient"
                class="flex-1"
                @select="(item: SelectIngredient) => handleIngredientSelect(item, index)"
              />
            </template>

            <template #input="{ index }">
              <input
                :value="values.ingredients[index]?.amount"
                type="number"
                :disabled="submitting"
                class="join-item rounded-none max-w-20 h-auto input w-full"
                placeholder="200"
                min="0.1"
                max="1000"
                step="0.5"
                @change="handleAmountChange($event, index)"
              >
            </template>

            <template #endItem="{ index }">
              <div class="join-item border flex items-center justify-center rounded-none shrink min-w-10">
                {{
                  values.ingredients[index] && values.ingredients[index].ingredientId && ingredientUnitMap.get(values.ingredients[index].ingredientId)
                }}
              </div>
            </template>

            <template #errors="{ index }">
              <p class="flex flex-col text-error mb-2">
                {{ errors[`ingredients[${index}].ingredientId`] }}
                {{ errors[`ingredients[${index}].amount`] }}
              </p>
            </template>
          </AppFormSelectRepeater>
        </div>
      </template>
    </AppPageContentWrapper>
  </AppPageWrapper>
</template>
