import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

/**
 * Merchant session.
 *
 * The cookie is httpOnly and carries the opaque token issued by the merchant
 * API. The frontend is NOT the authorization boundary: every data request must
 * be re-authorised on the server against this token, and merchant data must be
 * scoped by the authenticated identity by the backend.
 */

export const SESSION_COOKIE = "im_merchant_session";

export type MerchantSession = {
  merchantId: string;
  businessName: string;
  /** Opaque token issued by the merchant API. Absent in preview mode. */
  token?: string;
  /** True when the session serves sample data instead of live banking data. */
  preview: boolean;
  /** Epoch milliseconds. */
  expiresAt: number;
};

function encode(session: MerchantSession): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

function decode(value: string): MerchantSession | null {
  try {
    const raw: unknown = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    );
    if (typeof raw !== "object" || raw === null) return null;
    const candidate = raw as Record<string, unknown>;
    if (
      typeof candidate.merchantId !== "string" ||
      typeof candidate.businessName !== "string" ||
      typeof candidate.expiresAt !== "number"
    ) {
      return null;
    }
    return {
      merchantId: candidate.merchantId,
      businessName: candidate.businessName,
      token: typeof candidate.token === "string" ? candidate.token : undefined,
      preview: candidate.preview === true,
      expiresAt: candidate.expiresAt,
    };
  } catch {
    return null;
  }
}

export async function createSession(session: MerchantSession): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, encode(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expiresAt),
  });
}

/** Memoised per request: repeat reads in one render share a single result. */
export const readSession = cache(async function readSession(): Promise<MerchantSession | null> {
  const store = await cookies();
  const cookie = store.get(SESSION_COOKIE);
  if (!cookie) return null;
  const session = decode(cookie.value);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) return null;
  return session;
});

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
