"use client";

import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { formatNumber, formatPercent } from "@/lib/merchant/format";
import type { StatusBreakdown, TransactionStatus } from "@/lib/merchant/types";

import { EmptyState, Module, ModuleHeader } from "./Module";

const STATUS_META: Record<
  TransactionStatus,
  { label: string; bar: string; tile: string; ring: string; text: string; glyph: string }
> = {
  successful: {
    label: "Successful",
    bar: "bg-[#0a8a58]",
    tile: "bg-[#effaf4]",
    ring: "ring-[#0a8a58]/35",
    text: "text-[#0a6b45]",
    glyph: "✓",
  },
  pending: {
    label: "Pending",
    bar: "bg-[#c98a10]",
    tile: "bg-[#fdf6e7]",
    ring: "ring-[#c98a10]/35",
    text: "text-[#7a4f04]",
    glyph: "◔",
  },
  failed: {
    label: "Failed",
    bar: "bg-danger",
    tile: "bg-danger-soft",
    ring: "ring-danger/35",
    text: "text-danger",
    glyph: "✕",
  },
  reversed: {
    label: "Reversed",
    bar: "bg-[#6b7793]",
    tile: "bg-[#eef1f7]",
    ring: "ring-[#6b7793]/35",
    text: "text-[#44506b]",
    glyph: "↺",
  },
};

/**
 * Status composition for the period. The bar and the tiles are two views of
 * the same data: hovering or focusing either highlights the other, and both
 * open the transaction list filtered to that status.
 *
 * Status is carried by label, glyph and number — never by colour alone.
 */
export function TransactionHealth({
  breakdown,
  total,
  transactionsHref,
  className,
}: {
  breakdown: StatusBreakdown[];
  total: number;
  /** Transactions list for the current period; the status filter is appended. */
  transactionsHref: string;
  className?: string;
}) {
  const [active, setActive] = useState<TransactionStatus | null>(null);

  const hrefFor = (status: TransactionStatus) =>
    `${transactionsHref}${transactionsHref.includes("?") ? "&" : "?"}status=${status}`;

  const present = breakdown.filter((entry) => entry.count > 0);
  // Tiny slices are widened so they stay visible and clickable, then the whole
  // set is normalised back to 100% so the bar still fills exactly.
  const rawWidths = present.map((entry) => Math.max(entry.share, 1.6));
  const rawTotal = rawWidths.reduce((sum, width) => sum + width, 0) || 1;

  const segments = present.map((entry, index) => {
    const width = (rawWidths[index] / rawTotal) * 100;
    const before =
      (rawWidths.slice(0, index).reduce((sum, value) => sum + value, 0) / rawTotal) *
      100;
    return { entry, width, centre: before + width / 2 };
  });

  const activeEntry = active
    ? breakdown.find((entry) => entry.status === active)
    : null;
  const activeSegment = segments.find((segment) => segment.entry.status === active);
  const tooltipLeft = Math.min(Math.max(activeSegment?.centre ?? 50, 12), 88);

  const track = (status: TransactionStatus) => ({
    onMouseEnter: () => setActive(status),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(status),
    onBlur: () => setActive(null),
  });

  return (
    <Module className={cn("flex flex-col", className)}>
      <ModuleHeader
        id="health-heading"
        title="Transaction status"
        description={`${formatNumber(total)} transactions in this period`}
      />

      {total > 0 ? (
        <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6">
          <div className="relative">
            <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-[#eef1f7]">
              {segments.map(({ entry, width }) => {
                const meta = STATUS_META[entry.status];
                return (
                  <Link
                    key={entry.status}
                    href={hrefFor(entry.status)}
                    {...track(entry.status)}
                    style={{ width: `${width}%` }}
                    className={cn(
                      // The visible slice stays proportional; the hit area is
                      // taller than the bar so thin slices are still reachable.
                      "relative h-full rounded-[1px] transition-opacity duration-150 before:absolute before:inset-x-0 before:-inset-y-2.5 before:content-[''] first:rounded-l-full last:rounded-r-full",
                      meta.bar,
                      active && active !== entry.status ? "opacity-35" : "opacity-100",
                    )}
                  >
                    <span className="sr-only">
                      {meta.label}: {formatNumber(entry.count)} transactions,{" "}
                      {formatPercent(entry.share)}. View these transactions.
                    </span>
                  </Link>
                );
              })}
            </div>

            {activeEntry ? (
              <p
                aria-hidden="true"
                style={{ left: `${tooltipLeft}%` }}
                className="pointer-events-none absolute top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-white shadow-[0_12px_24px_-12px_rgb(4_19_51/0.6)]"
              >
                {STATUS_META[activeEntry.status].label} ·{" "}
                {formatNumber(activeEntry.count)} · {formatPercent(activeEntry.share)}
              </p>
            ) : null}
          </div>

          <ul className="mt-5 grid flex-1 grid-cols-2 gap-3">
            {breakdown.map((entry) => {
              const meta = STATUS_META[entry.status];
              const isActive = active === entry.status;
              return (
                <li key={entry.status}>
                  <Link
                    href={hrefFor(entry.status)}
                    {...track(entry.status)}
                    className={cn(
                      "flex h-full flex-col justify-between rounded-2xl p-4 ring-1 transition-[box-shadow,transform,background-color] duration-150",
                      entry.count ? meta.tile : "bg-[#f7f9fc]",
                      isActive
                        ? cn("ring-2", entry.count ? meta.ring : "ring-[#c3cbd9]")
                        : "ring-transparent",
                    )}
                  >
                    <span className="flex items-center gap-2 text-[13px] font-bold text-ink">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white",
                          entry.count ? meta.bar : "bg-[#c3cbd9]",
                        )}
                      >
                        {meta.glyph}
                      </span>
                      {meta.label}
                    </span>
                    <span className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <span className="text-[34px] font-bold leading-none tracking-[-0.02em] text-ink sm:text-[40px]">
                        {formatNumber(entry.count)}
                      </span>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          entry.count ? meta.text : "text-muted",
                        )}
                      >
                        {formatPercent(entry.share)}
                      </span>
                      <span className="sr-only">— view these transactions</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <EmptyState
          title="No transactions in this period"
          description="Status breakdown appears once transactions are recorded for the selected period."
        />
      )}
    </Module>
  );
}
