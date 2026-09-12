import "server-only";

/**
 * Preview mode renders the merchant portal with clearly-labelled sample data
 * so the experience can be reviewed before the merchant API exists.
 *
 * It is OFF unless `MERCHANT_PORTAL_PREVIEW=true`, it is ignored as soon as
 * `MERCHANT_AUTH_API_URL` is configured, and every screen shows a
 * "Preview mode · sample data" badge. It must not be enabled in production.
 */
export function isPreviewMode(): boolean {
  return (
    !process.env.MERCHANT_AUTH_API_URL &&
    process.env.MERCHANT_PORTAL_PREVIEW === "true"
  );
}

export const PREVIEW_MERCHANT = {
  merchantId: "IMR-0004821",
  businessName: "Kigali Fresh Mart",
} as const;

export const PREVIEW_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
