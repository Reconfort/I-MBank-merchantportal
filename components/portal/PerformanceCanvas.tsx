import { TrendDownIcon, TrendUpIcon } from "@/components/ui/icons";
import { formatNumber, formatSignedPercent } from "@/lib/merchant/format";
import type { Period } from "@/lib/merchant/period";
import type { ActivityBucket, DashboardTotals } from "@/lib/merchant/types";

import { ActivityChart } from "./ActivityChart";

/**
 * The primary analytical surface: headline value, supporting counts and the
 * transaction activity chart, all inside one branded canvas.
 */
export function PerformanceCanvas({
  totals,
  change,
  activity,
  period,
}: {
  totals: DashboardTotals;
  change: { count: number; value: number } | null;
  activity: ActivityBucket[];
  period: Period;
}) {
  const valueChange = change?.value ?? 0;
  const rising = valueChange >= 0;
  const hasActivity = totals.count > 0;

  return (
    <section
      aria-labelledby="performance-heading"
      className="on-dark overflow-hidden rounded-3xl bg-brand-blue text-white shadow-[0_30px_70px_-55px_rgb(0_51_161/0.8)]"
    >
      <div className="grid grid-cols-1 gap-8 px-6 pb-2 pt-6 sm:px-8 sm:pt-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 lg:border-r lg:border-white/12 lg:pr-12">
          <h2
            id="performance-heading"
            className="text-[13px] font-bold tracking-[0.01em] text-white/70"
          >
            Transaction value · {period.rangeLabel}
          </h2>
          <p className="mt-3 text-[38px] font-bold leading-none tracking-[-0.02em] sm:text-[46px]">
            {totals.valueLabel}
          </p>

          {change ? (
            <p className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold">
              {rising ? (
                <TrendUpIcon className="size-4 text-white/70" />
              ) : (
                <TrendDownIcon className="size-4 text-[#ffb4a8]" />
              )}
              <span className={rising ? "text-white" : "text-[#ffb4a8]"}>
                {formatSignedPercent(valueChange)}
              </span>
              <span className="font-medium text-white/65">
                vs {period.comparisonLabel}
              </span>
            </p>
          ) : null}

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/12 pt-6 sm:grid-cols-4 lg:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-[13px] font-medium text-white/70">
                Transactions
              </dt>
              <dd className="mt-1.5 truncate text-2xl font-bold tracking-[-0.01em] text-white">
                {formatNumber(totals.count)}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[13px] font-medium text-white/70">
                Successful
              </dt>
              <dd className="mt-1.5 truncate text-2xl font-bold tracking-[-0.01em] text-white">
                {formatNumber(totals.successful)}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[13px] font-medium text-white/70">
                Failed
              </dt>
              <dd className="mt-1.5 truncate text-2xl font-bold tracking-[-0.01em] text-white">
                {formatNumber(totals.failed)}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[13px] font-medium text-white/70">
                Average sale
              </dt>
              <dd className="mt-1.5 truncate text-2xl font-bold tracking-[-0.01em] text-white">
                {totals.averageLabel}
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          {hasActivity ? (
            <div className="-mx-6 sm:-mx-8 lg:-mr-2">
              <ActivityChart
                buckets={activity}
                granularity={period.granularity}
              />
            </div>
          ) : (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-10 text-center">
              <p className="text-sm font-bold text-white">
                No transactions in this period
              </p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/70">
                Nothing was recorded for {period.rangeLabel}. Try another date
                range.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="h-6 sm:h-8 lg:h-4" />
    </section>
  );
}
