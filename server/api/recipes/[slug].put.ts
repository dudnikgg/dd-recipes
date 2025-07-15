import { findRecipeByName, updateRecipeBySlug } from "~/lib/db/queries/recipe";
import { InsertRecipeWithIngredientsSchema } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const result = await readValidatedBody(event, InsertRecipeWithIngredientsSchema.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  const existingRecipe = await findRecipeByName(result.data, event.context.user.id);

  if (existingRecipe && existingRecipe.slug !== slug) {
    throw createError({
      statusCode: 409,
      statusMessage: "A recipe with that name already exists!",
    });
  }

  return updateRecipeBySlug(result.data, slug, event.context.user.id);
});
