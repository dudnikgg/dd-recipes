import type { DrizzleError } from "drizzle-orm";

import { findIngredientByName, insertIngredient } from "~/lib/db/queries/ingredient";
import { insertIngredientSchema } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, insertIngredientSchema.safeParse);

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

  const existingIngredient = await findIngredientByName(result.data, event.context.user.id);

  if (existingIngredient) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "An ingredient with that name already exists!",
    }));
  }

  try {
    return insertIngredient(result.data, event.context.user.id);
  }
  catch (e) {
    const error = e as DrizzleError;

    throw error;
  }
});
