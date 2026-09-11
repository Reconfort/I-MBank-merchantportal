import type { SignInFieldErrors, SignInInput } from "./types";

export const MERCHANT_ID_MAX_LENGTH = 64;
export const PASSWORD_MAX_LENGTH = 128;

type ValidationResult =
  | { success: true; data: SignInInput }
  | { success: false; errors: SignInFieldErrors };

/**
 * Validates sign-in input on both the client and the server.
 *
 * Only presence and length are checked here: whether the credentials are
 * correct is decided by the authentication service, never by the browser.
 */
export function validateSignIn(input: unknown): ValidationResult {
  const raw =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const merchantId =
    typeof raw.merchantId === "string" ? raw.merchantId.trim() : "";
  const password = typeof raw.password === "string" ? raw.password : "";
  const rememberMe = raw.rememberMe === true;

  const errors: SignInFieldErrors = {};

  if (!merchantId) {
    errors.merchantId = "Enter your Merchant ID.";
  } else if (merchantId.length > MERCHANT_ID_MAX_LENGTH) {
    errors.merchantId = `Merchant ID must be ${MERCHANT_ID_MAX_LENGTH} characters or fewer.`;
  }

  if (!password) {
    errors.password = "Enter your password.";
  } else if (password.length > PASSWORD_MAX_LENGTH) {
    errors.password = `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`;
  }

  if (errors.merchantId || errors.password) {
    return { success: false, errors };
  }

  return { success: true, data: { merchantId, password, rememberMe } };
}
