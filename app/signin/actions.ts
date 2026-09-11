"use server";

import { authenticateMerchant } from "@/lib/auth/merchant-auth";
import type { SignInResult } from "@/lib/auth/types";
import { validateSignIn } from "@/lib/auth/validation";

/**
 * Server Action behind the merchant sign-in form. Input is re-validated on
 * the server because Server Actions can be called directly with any payload.
 */
export async function signIn(input: unknown): Promise<SignInResult> {
  const parsed = validateSignIn(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "validation",
      message: "Please check the highlighted fields and try again.",
      fieldErrors: parsed.errors,
    };
  }

  return authenticateMerchant(parsed.data);
}
