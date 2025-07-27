import { findRecipe } from "~~/lib/db/queries/recipe";
import defineAuthenticatedEventHandler from "~~/server/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const recipe = await findRecipe(slug, event.context.user.id);

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found.",
    });
  }

  const { ingredientToRecipe, ...rest } = { ...recipe };
  return { ...rest, ingredients: ingredientToRecipe.map(ing => ({ amount: ing.amount, ...ing.ingredient })) };
});
