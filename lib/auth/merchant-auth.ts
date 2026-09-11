import "server-only";

import { contact } from "@/lib/site";

import type { SignInInput, SignInResult } from "./types";

/**
 * Merchant authentication — the single integration point for the real API.
 *
 * Configure `MERCHANT_AUTH_API_URL` (server-side only) with the endpoint that
 * verifies merchant credentials. Until it is set, sign-in fails safely with a
 * "service unavailable" message: no credentials are ever accepted locally.
 *
 * The request/response mapping below is a placeholder contract. Align it with
 * the I&M merchant authentication API once its specification is available,
 * and establish the session there (for example an httpOnly, Secure cookie).
 */

const REQUEST_TIMEOUT_MS = 15_000;

/** Keeps the phone number on one line inside wrapped messages. */
const PHONE = contact.phone.display.replace(/ /g, "\u00a0");

const MESSAGES = {
  unavailable: `Merchant sign-in is currently unavailable. Please try again later or contact I&M Bank on ${PHONE}.`,
  invalidCredentials:
    "The Merchant ID or password you entered is incorrect. Please try again.",
  accountLocked: `Your merchant account is locked. Please contact I&M Bank on ${PHONE} for assistance.`,
  rateLimited:
    "Too many sign-in attempts. Please wait a few minutes before trying again.",
} as const;

/** Only same-site relative paths are accepted as post-sign-in destinations. */
function toSafeRedirect(value: unknown): string {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/";
}

async function readJson(response: Response): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await response.json();
    return typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export async function authenticateMerchant(
  credentials: SignInInput,
): Promise<SignInResult> {
  const endpoint = process.env.MERCHANT_AUTH_API_URL;

  if (!endpoint) {
    console.warn(
      "[merchant-auth] MERCHANT_AUTH_API_URL is not configured — merchant sign-in is unavailable.",
    );
    return { ok: false, code: "unavailable", message: MESSAGES.unavailable };
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        merchantId: credentials.merchantId,
        password: credentials.password,
        rememberMe: credentials.rememberMe,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    return { ok: false, code: "unavailable", message: MESSAGES.unavailable };
  }

  if (response.ok) {
    const body = await readJson(response);
    return { ok: true, redirectTo: toSafeRedirect(body?.redirectTo) };
  }

  switch (response.status) {
    case 400:
    case 401:
      return {
        ok: false,
        code: "invalid_credentials",
        message: MESSAGES.invalidCredentials,
      };
    case 403:
    case 423:
      return { ok: false, code: "account_locked", message: MESSAGES.accountLocked };
    case 429:
      return { ok: false, code: "rate_limited", message: MESSAGES.rateLimited };
    default:
      return { ok: false, code: "unavailable", message: MESSAGES.unavailable };
  }
}
