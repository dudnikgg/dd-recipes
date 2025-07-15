import { z } from "zod/v3";

export const SearchSchema = z.object({
  q: z.string().min(1, "You must enter a search term."),
});

export type SearchSchema = z.infer<typeof SearchSchema>;

export const NameSchema = z.string().min(1).max(100);
export const InstructionSchema = z.string().min(1).max(1000);
export const CaloriesSchema = z.number().nonnegative();
export const ProteinsSchema = z.number().nonnegative();
export const FatsSchema = z.number().nonnegative();
export const CarbohydratesSchema = z.number().nonnegative();
export const MeasurementUnitSchema = z.string().readonly();
export const IngredientAmountSchema = z.number().min(0.1).max(1000).nonnegative();

export const FormIngredientRow = z
  .object({
    ingredientId: z.number().optional(),
    amount: IngredientAmountSchema.optional(),
  })
  .superRefine((row, ctx) => {
    const hasId = row.ingredientId != null;
    const hasAmount = row.amount != null;
    // if filled exactly one, complain on the missing one
    if (hasId !== hasAmount) {
      if (!hasId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ingredientId"],
          message:
            "Either leave both blank or select an ingredient here.",
        });
      }
      if (!hasAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["amount"],
          message: "Either leave both blank or enter an amount here.",
        });
      }
    }
  });
