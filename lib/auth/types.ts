export type SignInInput = {
  merchantId: string;
  password: string;
  rememberMe: boolean;
};

export type SignInField = "merchantId" | "password";

export type SignInFieldErrors = Partial<Record<SignInField, string>>;

export type SignInErrorCode =
  | "validation"
  | "invalid_credentials"
  | "account_locked"
  | "rate_limited"
  | "unavailable";

export type SignInResult =
  | { ok: true; redirectTo: string }
  | {
      ok: false;
      code: SignInErrorCode;
      message: string;
      fieldErrors?: SignInFieldErrors;
    };
