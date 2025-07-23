import type { User as AuthUser } from "better-auth";
import type z from "zod";

import type { SignInSchema, SignUpSchema } from "../zod-schemas";

export type UserWithId = Omit<AuthUser, "id"> & {
  id: number;
};

export type UserSignIn = z.infer<typeof SignInSchema>;
export type UserSignUp = z.infer<typeof SignUpSchema>;

declare module "h3" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface H3EventContext {
    user?: UserWithId;
  }
}
