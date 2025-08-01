import { findRecipes } from "~~/lib/db/queries/recipe";
import defineAuthenticatedEventHandler from "~~/server/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  return findRecipes(event.context.user.id);
});
