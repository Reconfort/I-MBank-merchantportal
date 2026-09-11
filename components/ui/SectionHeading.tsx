import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cn(centered && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.16em] text-brand-teal-700",
            centered && "justify-center",
          )}
        >
          <span
            aria-hidden="true"
            className="h-0.5 w-7 rounded-full bg-brand-gradient"
          />
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="mt-4 text-balance text-[32px] font-bold leading-[1.15] tracking-[-0.01em] text-ink sm:text-4xl lg:text-[40px]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-pretty text-lg leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
