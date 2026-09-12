import Link from "next/link";

import { StatusPill } from "@/components/ui/StatusPill";
import { ArrowUpRightIcon, ChevronRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { Transaction } from "@/lib/merchant/types";

import { EmptyState, Module, ModuleHeader } from "./Module";

export function RecentActivity({
  rows,
  transactionsHref,
  className,
}: {
  rows: Transaction[];
  transactionsHref: string;
  className?: string;
}) {
  return (
    <Module className={cn("flex flex-col", className)}>
      <ModuleHeader
        id="recent-heading"
        title="Recent activity"
        description="The latest transactions recorded on your merchant account"
        action={
          <Link
            href={transactionsHref}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold text-brand-blue transition-colors hover:bg-brand-mist"
          >
            View all
            <ArrowUpRightIcon className="size-4" />
          </Link>
        }
      />

      {rows.length ? (
        <ul className="flex-1 divide-y divide-[#f0f3f8]">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`${transactionsHref}${transactionsHref.includes("?") ? "&" : "?"}txn=${row.reference}`}
                className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-surface sm:px-6"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-ink">
                    {row.reference}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-muted">
                    {row.timeLabel} · {row.method} · {row.channel}
                  </span>
                </span>
                <span className="w-24 shrink-0 text-right text-sm font-bold text-ink sm:w-28">
                  {row.amountLabel}
                </span>
                <span className="hidden w-[104px] shrink-0 justify-end sm:flex">
                  <StatusPill status={row.status} />
                </span>
                <ChevronRightIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-[#c3cbd9]"
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No recent activity"
          description="No transactions were recorded for the selected period. Try another date range."
        />
      )}
    </Module>
  );
}
