import { findIngredients } from "~~/lib/db/queries/ingredient";
import defineAuthenticatedEventHandler from "~~/server/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  return findIngredients(event.context.user.id);
});
