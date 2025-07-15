import { findCategories } from "~/lib/db/queries/categories";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async () => {
  return findCategories();
});
