/**
 * Contact-detail validation shared by the browser and the server action.
 *
 * The browser copy only improves the experience — the server action always
 * revalidates, and the merchant the change applies to is taken from the
 * authenticated session, never from anything the browser sends.
 */

export type ContactDetails = {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactDetails, string>>;

export type ContactUpdateResult =
  | { ok: true; message: string }
  | {
      ok: false;
      code: "invalid" | "unavailable" | "session_expired";
      message: string;
      fieldErrors?: ContactFieldErrors;
    };

export const CONTACT_NAME_MAX_LENGTH = 80;
export const CONTACT_PHONE_MAX_LENGTH = 24;
export const CONTACT_EMAIL_MAX_LENGTH = 254;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+0-9()\-.\s]+$/;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactDetails(input: unknown): {
  values: ContactDetails;
  errors: ContactFieldErrors;
} {
  const source = (input ?? {}) as Record<string, unknown>;
  const values: ContactDetails = {
    contactName: asString(source.contactName),
    contactPhone: asString(source.contactPhone),
    contactEmail: asString(source.contactEmail),
  };
  const errors: ContactFieldErrors = {};

  if (!values.contactName) {
    errors.contactName = "Enter a contact name.";
  } else if (values.contactName.length > CONTACT_NAME_MAX_LENGTH) {
    errors.contactName = `Use ${CONTACT_NAME_MAX_LENGTH} characters or fewer.`;
  }

  const phoneDigits = values.contactPhone.replace(/\D/g, "");
  if (!values.contactPhone) {
    errors.contactPhone = "Enter a contact phone number.";
  } else if (values.contactPhone.length > CONTACT_PHONE_MAX_LENGTH) {
    errors.contactPhone = `Use ${CONTACT_PHONE_MAX_LENGTH} characters or fewer.`;
  } else if (!PHONE_PATTERN.test(values.contactPhone) || phoneDigits.length < 9) {
    errors.contactPhone = "Enter a valid phone number.";
  }

  if (!values.contactEmail) {
    errors.contactEmail = "Enter a contact email address.";
  } else if (values.contactEmail.length > CONTACT_EMAIL_MAX_LENGTH) {
    errors.contactEmail = `Use ${CONTACT_EMAIL_MAX_LENGTH} characters or fewer.`;
  } else if (!EMAIL_PATTERN.test(values.contactEmail)) {
    errors.contactEmail = "Enter a valid email address.";
  }

  return { values, errors };
}
