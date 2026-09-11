import { useId, type ComponentProps, type ReactNode } from "react";

import { AlertCircleIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type TextFieldProps = Omit<ComponentProps<"input">, "size"> & {
  label: string;
  error?: string;
  hint?: string;
  /** Element rendered inside the field on the right, e.g. a visibility toggle. */
  endAdornment?: ReactNode;
};

/** Labelled text input with accessible hint and error messaging. */
export function TextField({
  label,
  error,
  hint,
  endAdornment,
  id,
  className,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="block text-sm font-bold text-ink">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      <div className="relative mt-2">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "block h-[52px] w-full rounded-lg border bg-white px-4 text-base text-ink shadow-[0_1px_2px_rgb(4_19_51/0.05)] outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-[#8a93a5] read-only:bg-[#f9fafc] focus-visible:outline-none",
            error
              ? "border-danger focus:border-danger focus:ring-4 focus:ring-danger/15"
              : "border-line-strong hover:border-muted focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15",
            endAdornment ? "pr-14" : null,
          )}
          {...inputProps}
        />
        {endAdornment ? (
          <div className="absolute inset-y-0 right-1 flex items-center">
            {endAdornment}
          </div>
        ) : null}
      </div>
      {error ? (
        <p
          id={errorId}
          className="mt-2 flex items-start gap-1.5 text-sm font-bold text-danger"
        >
          <AlertCircleIcon className="mt-px size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
