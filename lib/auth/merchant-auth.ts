import "server-only";

import { contact } from "@/lib/site";

import { isPreviewMode, PREVIEW_MERCHANT, PREVIEW_SESSION_TTL_MS } from "./preview";
import { createSession } from "./session";
import type { SignInInput, SignInResult } from "./types";

/**
 * Merchant authentication — the single integration point for the real API.
 *
 * Configure `MERCHANT_AUTH_API_URL` (server-side only) with the endpoint that
 * verifies merchant credentials. Until it is set, sign-in either fails safely
 * with a "service unavailable" message or, when `MERCHANT_PORTAL_PREVIEW=true`,
 * opens a clearly-labelled preview session backed by sample data.
 *
 * The request/response mapping below is a placeholder contract. Align it with
 * the I&M merchant authentication API once its specification is available.
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

const DEFAULT_REDIRECT = "/dashboard";

/** Only same-site relative paths are accepted as post-sign-in destinations. */
function toSafeRedirect(value: unknown): string {
  if (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
  ) {
    return value;
  }
  return DEFAULT_REDIRECT;
}

async function readJson(
  response: Response,
): Promise<Record<string, unknown> | null> {
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
    if (isPreviewMode()) {
      // Preview mode: no credentials are verified and no live data is shown.
      console.warn(
        "[merchant-auth] Preview mode is enabled — opening a sample-data session.",
      );
      await createSession({
        merchantId: PREVIEW_MERCHANT.merchantId,
        businessName: PREVIEW_MERCHANT.businessName,
        preview: true,
        expiresAt: Date.now() + PREVIEW_SESSION_TTL_MS,
      });
      return { ok: true, redirectTo: DEFAULT_REDIRECT };
    }

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
    const token = typeof body?.token === "string" ? body.token : undefined;
    const expiresIn =
      typeof body?.expiresIn === "number" ? body.expiresIn : 8 * 60 * 60;
    const businessName =
      typeof body?.businessName === "string"
        ? body.businessName
        : credentials.merchantId;
    const merchantId =
      typeof body?.merchantId === "string"
        ? body.merchantId
        : credentials.merchantId;

    await createSession({
      merchantId,
      businessName,
      token,
      preview: false,
      expiresAt:
        Date.now() +
        (credentials.rememberMe ? Math.max(expiresIn, 86_400) : expiresIn) *
          1000,
    });

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
