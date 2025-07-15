import type { UserWithId } from "./auth";
import type { SelectRecipeWithIngredients } from "./db/schema";

declare module "h3" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface H3EventContext {
    user?: UserWithId;
  }
}

export enum MeasurementUnit {
  pcs = "pcs",
  g = "g",
  ml = "ml",
}

export type Meal = "breakfest" | "lunch" | "dinner";
export const Meals = ["breakfest", "lunch", "dinner"] as const;
export type DailyMealsSelection = {
  iso: string;
  meals: Record<Meal, SelectRecipeWithIngredients | null>;
};
export type Days = {
  date: Date;
  iso: string;
  formatted: string;
}[];
