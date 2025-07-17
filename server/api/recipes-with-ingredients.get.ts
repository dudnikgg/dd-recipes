import { findRecipesWithIngredients } from "~~/lib/db/queries/recipe";
import defineAuthenticatedEventHandler from "~~/server/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const recipesWithIngredients = await findRecipesWithIngredients(event.context.user.id);

  const withMappedIngredients = recipesWithIngredients.map((rec) => {
    const { ingredientToRecipe, ...recipe } = { ...rec };

    return { ...recipe, ingredients: ingredientToRecipe.map(ing => ({ amount: ing.amount, ...ing.ingredient })) };
  });

  return withMappedIngredients;
});
