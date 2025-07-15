import type { DrizzleError } from "drizzle-orm";

import slugify from "slug";

import { findRecipeByName, findUniqueSlug, insertRecipe } from "~/lib/db/queries/recipe";
import { InsertRecipeWithIngredientsSchema } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertRecipeWithIngredientsSchema.safeParse);

  if (!result.success) {
    const statusMessage = result.error.issues.map(issue => `${issue.path.join()}: ${issue.message}`).join("; ");

    const data = result.error.issues.reduce((errors, issue) => {
      errors[issue.path.join("")] = issue.message;
      return errors;
    }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  const existingRecipe = await findRecipeByName(result.data, event.context.user.id);

  if (existingRecipe) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "A recipe with that name already exists!",
    }));
  }

  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    return await insertRecipe(result.data, slug, event.context.user.id);
  }
  catch (e) {
    const error = e as DrizzleError;
    if (error.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: recipe.slug") {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: "Slug must be unique (the recipe title is used to generate the slug)",
      }));
    }

    if (error.message?.includes("ingredientToRecipe")) {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: "Each ingredient can only appear once in a recipe.",
      }));
    }

    throw error;
  }
});
