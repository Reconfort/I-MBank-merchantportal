import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "inverse" | "outline-inverse";
type ButtonSize = "md" | "lg";

type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Allow the label to wrap onto two lines on very narrow screens. */
  wrap?: boolean;
};

const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-full text-center leading-tight font-bold tracking-[0.01em] transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  /** Brand blue — the main action on light backgrounds. */
  primary:
    "bg-brand-blue text-white shadow-cta hover:bg-brand-blue-hover hover:shadow-[0_18px_32px_-14px_rgb(0_51_161/0.8)] active:bg-brand-blue-active",
  /** Outlined — secondary action on light backgrounds. */
  secondary:
    "border border-brand-blue/30 bg-white text-brand-blue hover:border-brand-blue hover:bg-brand-mist active:bg-[#e2eaf8]",
  /** White — the main action on brand-blue backgrounds. */
  inverse:
    "bg-white text-brand-blue shadow-[0_16px_32px_-18px_rgb(0_0_0/0.6)] hover:bg-brand-mist active:bg-[#dfe8f8]",
  /** Outlined white — secondary action on brand-blue backgrounds. */
  "outline-inverse":
    "border border-white/60 text-white hover:border-white hover:bg-white/10 active:bg-white/15",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-12 px-6 py-2.5 text-[15px]",
  lg: "min-h-14 px-8 py-3 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  fullWidth = false,
  wrap = false,
  className,
}: ButtonStyleProps & { className?: string } = {}) {
  return cn(
    base,
    variants[variant],
    sizes[size],
    wrap ? "whitespace-normal text-balance" : "whitespace-nowrap",
    fullWidth && "w-full",
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & ButtonStyleProps;

export function Button({
  variant,
  size,
  fullWidth,
  wrap,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, fullWidth, wrap, className })}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyleProps;

export function ButtonLink({
  variant,
  size,
  fullWidth,
  wrap,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonStyles({ variant, size, fullWidth, wrap, className })}
      {...props}
    />
  );
}
