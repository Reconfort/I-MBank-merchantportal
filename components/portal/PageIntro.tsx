import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function PageIntro({
  title,
  description,
  meta,
  aside,
  className,
}: {
  title: ReactNode;
  description?: string;
  meta?: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 pb-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-balance text-[28px] font-bold leading-[1.15] tracking-[-0.015em] text-ink sm:text-[34px] lg:text-[38px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-base leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      <div className="flex w-full shrink-0 flex-col items-stretch gap-2 sm:w-auto sm:items-start lg:items-end">
        {aside}
        {meta ? (
          <p className="text-[13px] font-medium text-muted sm:px-1.5 lg:pr-1.5">
            {meta}
          </p>
        ) : null}
      </div>
    </div>
  );
}
