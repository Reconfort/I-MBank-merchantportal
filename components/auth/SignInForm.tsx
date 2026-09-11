"use client";

import {
  useId,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { signIn } from "@/app/signin/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  LockIcon,
  SpinnerIcon,
} from "@/components/ui/icons";
import type { SignInField, SignInFieldErrors } from "@/lib/auth/types";
import {
  MERCHANT_ID_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  validateSignIn,
} from "@/lib/auth/validation";
import { contact } from "@/lib/site";

type FormValues = {
  merchantId: string;
  password: string;
  rememberMe: boolean;
};

const INITIAL_VALUES: FormValues = {
  merchantId: "",
  password: "",
  rememberMe: false,
};

const CONNECTION_ERROR =
  "We couldn't reach the sign-in service. Check your internet connection and try again.";

export function SignInForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState<SignInFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetHelp, setShowResetHelp] = useState(false);
  const [isPending, startTransition] = useTransition();

  const merchantIdRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordId = useId();
  const resetHelpId = useId();
  const formErrorId = useId();

  const handleTextChange =
    (field: SignInField) => (event: ChangeEvent<HTMLInputElement>) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      // After the first attempt, keep field errors in sync as the user types.
      if (hasSubmitted) {
        const result = validateSignIn(next);
        setFieldErrors(result.success ? {} : result.errors);
      }
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    setHasSubmitted(true);
    setFormError(null);

    const result = validateSignIn(values);
    if (!result.success) {
      setFieldErrors(result.errors);
      (result.errors.merchantId ? merchantIdRef : passwordRef).current?.focus();
      return;
    }
    setFieldErrors({});

    startTransition(async () => {
      try {
        const response = await signIn(result.data);
        if (response.ok) {
          window.location.assign(response.redirectTo);
          return;
        }
        setFieldErrors(response.fieldErrors ?? {});
        setFormError(response.message);
        setValues((current) => ({ ...current, password: "" }));
      } catch {
        setFormError(CONNECTION_ERROR);
      }
    });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-describedby={formError ? formErrorId : undefined}
      className="mt-8"
    >
      {formError ? (
        <div
          id={formErrorId}
          role="alert"
          className="mb-6 flex gap-3 rounded-xl border border-danger-line bg-danger-soft p-4 text-sm leading-relaxed text-danger"
        >
          <AlertCircleIcon className="mt-0.5 size-5 shrink-0" />
          <p>{formError}</p>
        </div>
      ) : null}

      <div className="space-y-5">
        <TextField
          ref={merchantIdRef}
          label="Merchant ID"
          name="merchantId"
          value={values.merchantId}
          onChange={handleTextChange("merchantId")}
          error={fieldErrors.merchantId}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={MERCHANT_ID_MAX_LENGTH}
          readOnly={isPending}
          required
        />

        <TextField
          ref={passwordRef}
          id={passwordId}
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={values.password}
          onChange={handleTextChange("password")}
          error={fieldErrors.password}
          autoComplete="current-password"
          maxLength={PASSWORD_MAX_LENGTH}
          readOnly={isPending}
          required
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label="Show password"
              aria-pressed={showPassword}
              aria-controls={passwordId}
              className="grid size-11 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-mist hover:text-brand-blue active:bg-[#e2eaf8]"
            >
              {showPassword ? (
                <EyeOffIcon className="size-5" />
              ) : (
                <EyeIcon className="size-5" />
              )}
            </button>
          }
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-body">
          <input
            type="checkbox"
            name="rememberMe"
            checked={values.rememberMe}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                rememberMe: event.target.checked,
              }))
            }
            disabled={isPending}
            className="size-[18px] cursor-pointer accent-brand-blue disabled:cursor-not-allowed"
          />
          Remember me
        </label>
        <button
          type="button"
          onClick={() => setShowResetHelp((open) => !open)}
          aria-expanded={showResetHelp}
          aria-controls={resetHelpId}
          className="rounded-sm text-sm font-bold text-brand-blue underline-offset-4 transition-colors hover:text-brand-blue-hover hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <div
        id={resetHelpId}
        hidden={!showResetHelp}
        className="mt-4 rounded-xl bg-brand-mist p-4 text-sm leading-relaxed text-body"
      >
        <p className="flex gap-3">
          <InfoIcon className="mt-0.5 size-5 shrink-0 text-brand-blue" />
          <span>
            To reset your password, contact I&amp;M Bank on{" "}
            <a
              href={contact.phone.href}
              className="whitespace-nowrap font-bold text-brand-blue underline underline-offset-2"
            >
              {contact.phone.display}
            </a>{" "}
            or email{" "}
            <a
              href={contact.email.href}
              className="font-bold text-brand-blue underline underline-offset-2"
            >
              {contact.email.display}
            </a>
            .
          </span>
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        fullWidth
        className="mt-7"
        aria-disabled={isPending || undefined}
      >
        {isPending ? (
          <>
            <SpinnerIcon className="size-5 animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            <LockIcon className="size-[18px]" />
            Sign In
          </>
        )}
      </Button>
      <p aria-live="polite" className="sr-only">
        {isPending ? "Signing in, please wait." : ""}
      </p>
    </form>
  );
}
