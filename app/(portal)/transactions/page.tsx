import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  EmptyState,
  ErrorState,
  Module,
  ModuleHeader,
} from "@/components/portal/Module";
import { PageIntro } from "@/components/portal/PageIntro";
import { PeriodSelector } from "@/components/portal/PeriodSelector";
import { TransactionDrawer } from "@/components/portal/TransactionDrawer";
import { TransactionFilters } from "@/components/portal/TransactionFilters";
import { TransactionTable } from "@/components/portal/TransactionTable";
import { ChevronRightIcon } from "@/components/ui/icons";
import { readSession } from "@/lib/auth/session";
import { formatNumber, toInputDate } from "@/lib/merchant/format";
import { periodSearchParams, resolvePeriod } from "@/lib/merchant/period";
import { getTransaction, getTransactionPage } from "@/lib/merchant/service";
import type { TransactionQuery, TransactionStatus } from "@/lib/merchant/types";

export const metadata: Metadata = {
  title: "Transactions | I&M Merchant Portal",
  description: "Review and audit your I&M merchant transactions.",
};

const PAGE_SIZE = 15;
const STATUSES = ["successful", "pending", "failed", "reversed"];

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toAmount(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await readSession();
  if (!session) redirect("/signin");

  const params = await searchParams;
  const period = resolvePeriod({
    period: first(params.period),
    from: first(params.from),
    to: first(params.to),
  });

  const statusParam = first(params.status);
  const query: TransactionQuery = {
    search: first(params.q) ?? "",
    status:
      statusParam && STATUSES.includes(statusParam)
        ? (statusParam as TransactionStatus)
        : "all",
    method: first(params.method) ?? "all",
    channel: first(params.channel) ?? "all",
    minAmount: toAmount(first(params.min)),
    maxAmount: toAmount(first(params.max)),
    page: Number(first(params.page)) || 1,
    pageSize: PAGE_SIZE,
  };

  const result = await getTransactionPage(session, period, query);
  if (!result.ok && result.error === "SESSION_EXPIRED") {
    redirect("/signin?expired=1");
  }

  const filterValues = {
    q: query.search,
    status: query.status,
    method: query.method,
    channel: query.channel,
    min: first(params.min) ?? "",
    max: first(params.max) ?? "",
  };

  const periodParams = Object.fromEntries(
    new URLSearchParams(periodSearchParams(period)),
  );

  const buildHref = (overrides: Record<string, string | null>) => {
    const search = new URLSearchParams(periodSearchParams(period));
    if (query.search) search.set("q", query.search);
    if (query.status !== "all") search.set("status", query.status);
    if (query.method !== "all") search.set("method", query.method);
    if (query.channel !== "all") search.set("channel", query.channel);
    if (filterValues.min) search.set("min", filterValues.min);
    if (filterValues.max) search.set("max", filterValues.max);
    if (result.ok && result.data.page > 1) {
      search.set("page", `${result.data.page}`);
    }
    for (const [key, value] of Object.entries(overrides)) {
      if (value === null) search.delete(key);
      else search.set(key, value);
    }
    return `/transactions?${search.toString()}`;
  };

  const selectedReference = first(params.txn);
  const selected = selectedReference
    ? await getTransaction(session, period, selectedReference)
    : null;

  const filterParams = Object.fromEntries(
    new URLSearchParams(buildHref({ page: null, txn: null }).split("?")[1]),
  );

  return (
    <>
      <PageIntro
        title="Transactions"
        description="Review and audit your merchant activity."
        meta={`Showing ${period.rangeLabel}`}
        aside={
          <PeriodSelector
            periodKey={period.key}
            from={toInputDate(period.from)}
            to={toInputDate(period.to)}
            extraParams={filterParams}
          />
        }
      />

      <Module>
        <TransactionFilters
          values={filterValues}
          methods={result.ok ? result.data.methods : []}
          channels={result.ok ? result.data.channels : []}
          baseParams={periodParams}
        />
      </Module>

      <Module className="mt-5">
        {result.ok ? (
          <>
            <ModuleHeader
              title={`${formatNumber(result.data.total)} transaction${result.data.total === 1 ? "" : "s"}`}
              description={`${result.data.totalValueLabel} successful value in this view`}
            />
            {result.data.rows.length ? (
              <>
                <TransactionTable
                  rows={result.data.rows.map((transaction) => ({
                    transaction,
                    href: buildHref({ txn: transaction.reference }),
                  }))}
                />
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eef1f7] px-5 py-4 sm:px-6">
                  <p className="text-[13px] text-muted">
                    Page {result.data.page} of {result.data.pageCount} ·{" "}
                    {formatNumber(result.data.total)} results
                  </p>
                  <div className="flex items-center gap-2">
                    {result.data.page > 1 ? (
                      <Link
                        href={buildHref({
                          page: `${result.data.page - 1}`,
                          txn: null,
                        })}
                        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#dfe4ee] px-4 text-[13px] font-bold text-body transition-colors hover:border-brand-blue/40 hover:text-brand-blue"
                      >
                        <ChevronRightIcon className="size-4 rotate-180" />
                        Previous
                      </Link>
                    ) : null}
                    {result.data.page < result.data.pageCount ? (
                      <Link
                        href={buildHref({
                          page: `${result.data.page + 1}`,
                          txn: null,
                        })}
                        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#dfe4ee] px-4 text-[13px] font-bold text-body transition-colors hover:border-brand-blue/40 hover:text-brand-blue"
                      >
                        Next
                        <ChevronRightIcon className="size-4" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                title="No transactions found"
                description="No transactions match this period and filter combination. Try a different date range or clear the filters."
              />
            )}
          </>
        ) : (
          <ErrorState
            title="Unable to load your transactions"
            description={result.error}
          />
        )}
      </Module>

      {selected ? (
        <TransactionDrawer
          transaction={selected}
          closeHref={buildHref({ txn: null })}
        />
      ) : null}
    </>
  );
}
