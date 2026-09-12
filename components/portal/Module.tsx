import type { ReactNode } from "react";

import { AlertCircleIcon, LockIcon, RefreshIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/** Shared surface for portal modules. Used sparingly — not every block is a card. */
export function Module({
  className,
  children,
  as: Tag = "section",
  ...props
}: {
  className?: string;
  children: ReactNode;
  as?: "section" | "div" | "article";
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-[#e4e9f2] bg-white shadow-[0_24px_60px_-50px_rgb(4_19_51/0.7)]",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function ModuleHeader({
  title,
  description,
  action,
  id,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-[#eef1f7] px-5 py-4 sm:px-6",
        className,
      )}
    >
      <div>
        <h2
          id={id}
          className="text-[15px] font-bold tracking-[-0.005em] text-ink"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/** Marks a whole module as maintained by the bank and read-only here. */
export function ManagedBadge({ label = "Managed by I&M Bank" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef1f7] px-2.5 py-1 text-[11px] font-bold text-[#44506b]">
      <LockIcon aria-hidden="true" className="size-3" />
      {label}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-5 py-10 text-center sm:px-6", className)}>
      <p className="text-sm font-bold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "We couldn't load this information",
  description,
  className,
}: {
  title?: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 px-5 py-10 text-center sm:px-6",
        className,
      )}
    >
      <span className="grid size-11 place-items-center rounded-full bg-danger-soft text-danger">
        <AlertCircleIcon className="size-5" />
      </span>
      <div>
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          {description}
        </p>
      </div>
      <a
        href="."
        className="inline-flex items-center gap-2 rounded-full border border-brand-blue/30 px-4 py-2 text-sm font-bold text-brand-blue transition-colors hover:border-brand-blue hover:bg-brand-mist"
      >
        <RefreshIcon className="size-4" />
        Try again
      </a>
    </div>
  );
}

/** Key/value row used across account and profile modules. */
export function DetailRow({
  label,
  value,
  hint,
  managed = false,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  managed?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[#f0f3f8] py-3 last:border-b-0">
      <dt className="text-[13px] text-muted">
        {label}
        {managed ? (
          <span className="ml-2 rounded-full bg-[#eef1f7] px-2 py-0.5 text-[11px] font-bold text-[#5a6478]">
            I&amp;M managed
          </span>
        ) : null}
      </dt>
      <dd className="text-right text-sm font-bold text-ink">
        {value}
        {hint ? (
          <span className="mt-0.5 block text-[12px] font-normal text-muted">
            {hint}
          </span>
        ) : null}
      </dd>
    </div>
  );
}
