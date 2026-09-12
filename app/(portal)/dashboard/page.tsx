import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ErrorState, Module } from "@/components/portal/Module";
import { PageIntro } from "@/components/portal/PageIntro";
import { PerformanceCanvas } from "@/components/portal/PerformanceCanvas";
import { PeriodSelector } from "@/components/portal/PeriodSelector";
import { RecentActivity } from "@/components/portal/RecentActivity";
import { TerminalPanel } from "@/components/portal/TerminalPanel";
import { TransactionHealth } from "@/components/portal/TransactionHealth";
import { readSession } from "@/lib/auth/session";
import { toInputDate } from "@/lib/merchant/format";
import { greetingForNow } from "@/lib/merchant/greeting";
import { periodSearchParams, resolvePeriod } from "@/lib/merchant/period";
import { getDashboard } from "@/lib/merchant/service";

export const metadata: Metadata = {
  title: "Dashboard | I&M Merchant Portal",
  description: "Monitor your I&M merchant activity.",
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardPage({
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
  const result = await getDashboard(session, period);

  if (!result.ok && result.error === "SESSION_EXPIRED") {
    redirect("/signin?expired=1");
  }

  const transactionsHref = `/transactions?${periodSearchParams(period)}`;

  return (
    <>
      <PageIntro
        title={
          <>
            {greetingForNow()},{" "}
            <span className="text-brand-blue">{session.businessName}</span>.
          </>
        }
        description="Here is your merchant activity overview."
        meta={`Showing activity · ${period.rangeLabel}`}
        aside={
          <PeriodSelector
            periodKey={period.key}
            from={toInputDate(period.from)}
            to={toInputDate(period.to)}
          />
        }
      />

      {result.ok ? (
        <div className="space-y-5">
          <PerformanceCanvas
            totals={result.data.totals}
            change={result.data.change}
            activity={result.data.activity}
            period={period}
          />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <TransactionHealth
              breakdown={result.data.breakdown}
              total={result.data.totals.count}
              transactionsHref={transactionsHref}
              className="lg:col-span-5"
            />
            <RecentActivity
              rows={result.data.recent}
              transactionsHref={transactionsHref}
              className="lg:col-span-7"
            />
          </div>

          <TerminalPanel
            terminals={result.data.terminals}
            profileHref="/profile"
          />
        </div>
      ) : (
        <Module>
          <ErrorState description={result.error} />
        </Module>
      )}
    </>
  );
}
