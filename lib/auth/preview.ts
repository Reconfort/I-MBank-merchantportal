import "server-only";

/**
 * Preview mode renders the merchant portal with clearly-labelled sample data
 * so the experience can be reviewed before the merchant API exists.
 *
 * It is on whenever `MERCHANT_AUTH_API_URL` is unset — including the Vercel
 * deploy — and every screen shows a "Preview mode · sample data" badge.
 * Connecting the real authentication API turns it off automatically.
 */
export function isPreviewMode(): boolean {
  return !process.env.MERCHANT_AUTH_API_URL;
}

export const PREVIEW_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
export const PREVIEW_REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000;
