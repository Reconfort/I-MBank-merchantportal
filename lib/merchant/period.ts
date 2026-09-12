import { formatDate, formatShortDate, toInputDate } from "./format";

export type PeriodKey = "today" | "week" | "month" | "year" | "custom";

export type Granularity = "hour" | "day" | "month";

export type Period = {
  key: PeriodKey;
  from: Date;
  to: Date;
  granularity: Granularity;
  /** e.g. "01 Sep — 12 Sep 2026" */
  rangeLabel: string;
  /** e.g. "this month" — used in comparison copy. */
  comparisonLabel: string;
};

export const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
  { key: "custom", label: "Custom" },
];

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function parseDate(value: string | undefined): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function rangeLabel(from: Date, to: Date): string {
  if (toInputDate(from) === toInputDate(to)) return formatDate(from);
  if (from.getFullYear() === to.getFullYear()) {
    return `${formatShortDate(from)} — ${formatDate(to)}`;
  }
  return `${formatDate(from)} — ${formatDate(to)}`;
}

function granularityFor(from: Date, to: Date): Granularity {
  const days = (to.getTime() - from.getTime()) / 86_400_000;
  if (days <= 1.5) return "hour";
  if (days <= 120) return "day";
  return "month";
}

/**
 * Resolves the dashboard period from URL search params so a view can be
 * shared, bookmarked and re-rendered on the server.
 */
export function resolvePeriod(params: {
  period?: string;
  from?: string;
  to?: string;
}): Period {
  const now = new Date();
  const key = (PERIOD_OPTIONS.map((option) => option.key) as string[]).includes(
    params.period ?? "",
  )
    ? (params.period as PeriodKey)
    : "month";

  if (key === "custom") {
    const parsedFrom = parseDate(params.from);
    const parsedTo = parseDate(params.to);
    if (parsedFrom && parsedTo) {
      const from = startOfDay(parsedFrom <= parsedTo ? parsedFrom : parsedTo);
      const to = endOfDay(parsedTo >= parsedFrom ? parsedTo : parsedFrom);
      return {
        key,
        from,
        to,
        granularity: granularityFor(from, to),
        rangeLabel: rangeLabel(from, to),
        comparisonLabel: "the previous period",
      };
    }
  }

  if (key === "today") {
    const from = startOfDay(now);
    return {
      key,
      from,
      to: endOfDay(now),
      granularity: "hour",
      rangeLabel: formatDate(now),
      comparisonLabel: "yesterday",
    };
  }

  if (key === "week") {
    const day = (now.getDay() + 6) % 7; // Monday-first
    const from = startOfDay(new Date(now.getTime() - day * 86_400_000));
    return {
      key,
      from,
      to: endOfDay(now),
      granularity: "day",
      rangeLabel: rangeLabel(from, now),
      comparisonLabel: "last week",
    };
  }

  if (key === "year") {
    const from = startOfDay(new Date(now.getFullYear(), 0, 1));
    return {
      key,
      from,
      to: endOfDay(now),
      granularity: "month",
      rangeLabel: `01 Jan — ${formatDate(now)}`,
      comparisonLabel: "last year",
    };
  }

  const from = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
  return {
    key: key === "custom" ? "month" : key,
    from,
    to: endOfDay(now),
    granularity: "day",
    rangeLabel: rangeLabel(from, now),
    comparisonLabel: "last month",
  };
}

/** The equally-long window immediately before the given period. */
export function previousPeriod(period: Period): { from: Date; to: Date } {
  const span = period.to.getTime() - period.from.getTime();
  return {
    from: new Date(period.from.getTime() - span - 1),
    to: new Date(period.from.getTime() - 1),
  };
}

export function periodSearchParams(period: Period): string {
  const params = new URLSearchParams({ period: period.key });
  if (period.key === "custom") {
    params.set("from", toInputDate(period.from));
    params.set("to", toInputDate(period.to));
  }
  return params.toString();
}
