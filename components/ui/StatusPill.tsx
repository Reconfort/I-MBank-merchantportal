import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { TransactionStatus } from "@/lib/merchant/types";

const STATUS_STYLES: Record<
  TransactionStatus,
  { label: string; className: string; dot: string }
> = {
  successful: {
    label: "Successful",
    className: "bg-[#e7f6ef] text-[#0a6b45]",
    dot: "bg-[#0a8a58]",
  },
  pending: {
    label: "Pending",
    className: "bg-[#fdf3e2] text-[#7a4f04]",
    dot: "bg-[#c98a10]",
  },
  failed: {
    label: "Failed",
    className: "bg-danger-soft text-danger",
    dot: "bg-danger",
  },
  reversed: {
    label: "Reversed",
    className: "bg-[#eef1f7] text-[#44506b]",
    dot: "bg-[#6b7793]",
  },
};

export function StatusPill({
  status,
  className,
}: {
  status: TransactionStatus;
  className?: string;
}) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold",
        style.className,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
}

export function statusLabel(status: TransactionStatus): string {
  return STATUS_STYLES[status].label;
}

/** Small neutral chip used for metadata such as "Preview mode". */
export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "attention";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
        tone === "brand" && "bg-brand-mist text-brand-blue",
        tone === "attention" && "bg-[#fdf3e2] text-[#7a4f04]",
        tone === "neutral" && "bg-[#eef1f7] text-[#44506b]",
        className,
      )}
    >
      {children}
    </span>
  );
}
