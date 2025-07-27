import type { Ref } from "vue";

import { ref } from "vue";

const ingredientKeys = [
  "carrot",
  "cucumber",
  "garlic",
  "salt",
  "tomato",
  "broccoli",
  "egg",
] as const;

type IngredientKey = typeof ingredientKeys[number];

export type IngredientRefs = {
  [K in IngredientKey]: Ref<Element | ComponentPublicInstance | null>
};

export function useIngredientRefs(): IngredientRefs {
  const refs = {} as IngredientRefs;

  for (const key of ingredientKeys) {
    refs[key] = ref(null);
  }

  return refs;
}
