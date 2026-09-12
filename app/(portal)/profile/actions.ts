"use server";

import { readSession } from "@/lib/auth/session";
import {
  validateContactDetails,
  type ContactUpdateResult,
} from "@/lib/merchant/contact";
import { submitContactUpdate } from "@/lib/merchant/service";

/**
 * Updates the contact details I&M Bank holds for the signed-in merchant.
 *
 * Authorisation is resolved from the session cookie on the server. Nothing the
 * browser sends identifies which merchant record is written.
 */
export async function updateContactDetails(
  input: unknown,
): Promise<ContactUpdateResult> {
  const session = await readSession();
  if (!session) {
    return {
      ok: false,
      code: "session_expired",
      message: "Your session has expired. Please sign in again.",
    };
  }

  const { values, errors } = validateContactDetails(input);
  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      code: "invalid",
      message: "Please check the highlighted details.",
      fieldErrors: errors,
    };
  }

  return submitContactUpdate(session, values);
}
