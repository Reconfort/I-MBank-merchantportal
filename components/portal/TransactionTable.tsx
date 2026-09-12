"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { StatusPill } from "@/components/ui/StatusPill";
import type { Transaction } from "@/lib/merchant/types";

/** A row plus the link to its detail view, both resolved on the server. */
export type TransactionRow = {
  transaction: Transaction;
  href: string;
};

export function TransactionTable({ rows }: { rows: TransactionRow[] }) {
  const router = useRouter();

  return (
    <>
      {/* Desktop: dense audit table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <caption className="sr-only">
            Merchant transactions for the selected period
          </caption>
          <thead>
            <tr className="border-b border-[#eef1f7] text-[12px] font-bold text-muted">
              <th scope="col" className="px-6 py-3 font-bold">
                Date &amp; time
              </th>
              <th scope="col" className="px-3 py-3 font-bold">
                Transaction ID
              </th>
              <th scope="col" className="px-3 py-3 text-right font-bold">
                Amount
              </th>
              <th scope="col" className="px-3 py-3 font-bold">
                Method
              </th>
              <th scope="col" className="px-3 py-3 font-bold">
                Channel
              </th>
              <th scope="col" className="px-3 py-3 font-bold">
                Status
              </th>
              <th scope="col" className="px-6 py-3 font-bold">
                Reference
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f3f8]">
            {rows.map(({ transaction: row, href }) => (
              <tr
                key={row.id}
                onClick={() => router.push(href)}
                className="cursor-pointer transition-colors hover:bg-surface"
              >
                <td className="whitespace-nowrap px-6 py-3.5 text-sm text-body">
                  <span className="font-bold text-ink">{row.dateLabel}</span>
                  <span className="ml-2 text-muted">{row.timeLabel}</span>
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-sm">
                  <Link
                    href={href}
                    onClick={(event) => event.stopPropagation()}
                    className="rounded-sm font-bold text-brand-blue underline-offset-4 hover:underline"
                  >
                    {row.reference}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-right text-sm font-bold text-ink">
                  {row.amountLabel}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-sm text-body">
                  {row.method}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-sm text-body">
                  {row.channel}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5">
                  <StatusPill status={row.status} />
                </td>
                <td className="whitespace-nowrap px-6 py-3.5 text-sm text-muted">
                  {row.merchantReference}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: transaction cards */}
      <ul className="divide-y divide-[#f0f3f8] md:hidden">
        {rows.map(({ transaction: row, href }) => (
          <li key={row.id}>
            <Link
              href={href}
              className="block px-5 py-4 transition-colors hover:bg-surface"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">{row.reference}</p>
                  <p className="mt-1 text-[13px] text-muted">
                    {row.dateLabel} · {row.timeLabel}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-ink">
                  {row.amountLabel}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusPill status={row.status} />
                <span className="text-[12px] text-muted">
                  {row.method} · {row.channel}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
