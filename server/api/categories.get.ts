import { findCategories } from "~~/lib/db/queries/categories";
import defineAuthenticatedEventHandler from "~~/server/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async () => {
  return findCategories();
});
