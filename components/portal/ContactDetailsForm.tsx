"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateContactDetails } from "@/app/(portal)/profile/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
  SpinnerIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { contact as bankContact } from "@/lib/site";
import {
  CONTACT_EMAIL_MAX_LENGTH,
  CONTACT_NAME_MAX_LENGTH,
  CONTACT_PHONE_MAX_LENGTH,
  validateContactDetails,
  type ContactDetails,
  type ContactFieldErrors,
} from "@/lib/merchant/contact";

const PHONE = bankContact.phone.display.replace(/ /g, "\u00a0");

type Status =
  | { kind: "idle" }
  | { kind: "saved"; message: string }
  | { kind: "notice"; message: string }
  | { kind: "error"; message: string };

export function ContactDetailsForm({ initial }: { initial: ContactDetails }) {
  const [values, setValues] = useState<ContactDetails>(initial);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const dirty =
    values.contactName !== initial.contactName ||
    values.contactPhone !== initial.contactPhone ||
    values.contactEmail !== initial.contactEmail;

  const set = (field: keyof ContactDetails) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus({ kind: "idle" });
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
    setStatus({ kind: "idle" });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending || !dirty) return;

    const checked = validateContactDetails(values);
    if (Object.keys(checked.errors).length > 0) {
      setErrors(checked.errors);
      setStatus({ kind: "error", message: "Please check the highlighted details." });
      return;
    }

    setErrors({});
    setStatus({ kind: "idle" });

    startTransition(async () => {
      const result = await updateContactDetails(checked.values);

      if (result.ok) {
        setStatus({ kind: "saved", message: result.message });
        return;
      }

      if (result.code === "session_expired") {
        router.push("/signin?expired=1");
        return;
      }

      if (result.fieldErrors) setErrors(result.fieldErrors);
      setStatus({
        kind: result.code === "unavailable" ? "notice" : "error",
        message: result.message,
      });
    });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="px-5 py-5 sm:px-6">
      <div className="grid gap-4">
        <TextField
          label="Contact name"
          name="contactName"
          value={values.contactName}
          onChange={(event) => set("contactName")(event.target.value)}
          autoComplete="name"
          maxLength={CONTACT_NAME_MAX_LENGTH}
          error={errors.contactName}
          disabled={pending}
        />
        <TextField
          label="Contact phone"
          name="contactPhone"
          type="tel"
          inputMode="tel"
          value={values.contactPhone}
          onChange={(event) => set("contactPhone")(event.target.value)}
          autoComplete="tel"
          maxLength={CONTACT_PHONE_MAX_LENGTH}
          error={errors.contactPhone}
          disabled={pending}
        />
        <TextField
          label="Contact email"
          name="contactEmail"
          type="email"
          inputMode="email"
          value={values.contactEmail}
          onChange={(event) => set("contactEmail")(event.target.value)}
          autoComplete="email"
          maxLength={CONTACT_EMAIL_MAX_LENGTH}
          error={errors.contactEmail}
          disabled={pending}
        />
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-muted">
        These are the details I&amp;M Bank uses to reach your business about your
        merchant account. Your registered business details and settlement
        instructions can only be changed by I&amp;M Bank.
      </p>

      <div
        role="status"
        aria-live="polite"
        className={cn(status.kind === "idle" && "sr-only")}
      >
        {status.kind === "idle" ? null : (
          <div
            className={cn(
              "mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed",
              status.kind === "saved" && "border-[#bfe4d3] bg-[#effaf4] text-[#0a6b45]",
              status.kind === "notice" && "border-[#cfdcf3] bg-brand-mist text-ink",
              status.kind === "error" && "border-danger/30 bg-danger-soft text-danger",
            )}
          >
            <span aria-hidden="true" className="mt-0.5 shrink-0">
              {status.kind === "saved" ? (
                <CheckCircleIcon className="size-5" />
              ) : status.kind === "notice" ? (
                <InfoIcon className="size-5 text-brand-blue" />
              ) : (
                <AlertCircleIcon className="size-5" />
              )}
            </span>
            <div>
              <p className={status.kind === "notice" ? "font-normal" : "font-bold"}>
                {status.message}
              </p>
              {status.kind === "notice" ? (
                <p className="mt-1 text-muted">
                  Call{" "}
                  <a
                    href={bankContact.phone.href}
                    className="font-bold text-brand-blue underline-offset-2 hover:underline"
                  >
                    {PHONE}
                  </a>
                  , email{" "}
                  <a
                    href={bankContact.email.href}
                    className="font-bold text-brand-blue underline-offset-2 hover:underline"
                  >
                    {bankContact.email.display}
                  </a>{" "}
                  or visit any I&amp;M Bank branch.{" "}
                  <Link
                    href="/help"
                    className="font-bold text-brand-blue underline-offset-2 hover:underline"
                  >
                    More ways to get help
                  </Link>
                  .
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="submit" aria-disabled={pending || !dirty} className="min-w-40">
          {pending ? (
            <>
              <SpinnerIcon className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
        {dirty && !pending ? (
          <button
            type="button"
            onClick={reset}
            className="rounded-full px-4 py-2 text-sm font-bold text-muted transition-colors hover:bg-[#eef1f7] hover:text-ink"
          >
            Discard changes
          </button>
        ) : null}
      </div>
    </form>
  );
}
