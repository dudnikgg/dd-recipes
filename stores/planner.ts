import type { DailyMealsSelection, Days } from "~/lib/type";

export const usePlannerStore = defineStore("usePlannerStore", () => {
  const days: Days = getWeekDays().map(d => ({
    date: d,
    iso: d.toISOString(),
    formatted: d.toLocaleDateString("en-US", { weekday: "long" }),
  }));

  const selectedRecipes = ref<DailyMealsSelection[]>(
    days.map(({ iso }) => ({
      iso,
      meals: {
        breakfest: null,
        lunch: null,
        dinner: null,
      },
    })),
  );

  function getSelectedRecipes() {
    return selectedRecipes.value;
  }

  function setSelectedRecipes(selectedDailyRecipes: DailyMealsSelection[]) {
    selectedRecipes.value = selectedDailyRecipes;
  }

  return {
    days,
    getSelectedRecipes,
    setSelectedRecipes,
  };
});
