import "server-only";

import { cache } from "react";

import type { MerchantSession } from "@/lib/auth/session";

import { formatAmount, formatMonth, formatShortDate, formatWeekday } from "./format";
import type { ContactDetails, ContactUpdateResult } from "./contact";
import { previousPeriod, type Period } from "./period";
import {
  sampleAccount,
  sampleNotices,
  sampleTerminals,
  sampleTransactions,
} from "./sample-data";
import type {
  ActivityBucket,
  DashboardData,
  DashboardTotals,
  DataResult,
  MerchantAccount,
  Notice,
  StatusBreakdown,
  Terminal,
  Transaction,
  TransactionPage,
  TransactionQuery,
} from "./types";

/**
 * Merchant data access.
 *
 * Integration point: set `MERCHANT_API_URL` to the merchant reporting API.
 * Requests carry the session token; the backend must scope every response to
 * the authenticated merchant — never to an identifier sent by the browser.
 *
 * Without that variable the portal either serves clearly-labelled sample data
 * (preview mode) or returns an error state. It never invents live banking data.
 */

const UNAVAILABLE =
  "Merchant data is not available yet. Please try again later or contact I&M Bank.";

type ApiState = "live" | "preview" | "unavailable";

function apiState(session: MerchantSession): ApiState {
  if (process.env.MERCHANT_API_URL) return "live";
  if (session.preview) return "preview";
  return "unavailable";
}

async function requestApi<T>(
  path: string,
  session: MerchantSession,
  params?: Record<string, string>,
): Promise<DataResult<T>> {
  const base = process.env.MERCHANT_API_URL;
  if (!base) return { ok: false, error: UNAVAILABLE };

  const url = new URL(path, base.endsWith("/") ? base : `${base}/`);
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, value);
  }

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (response.status === 401 || response.status === 403) {
      return { ok: false, error: "SESSION_EXPIRED" };
    }
    if (!response.ok) return { ok: false, error: UNAVAILABLE };
    // TODO(integration): map the merchant API payload onto the portal types.
    return { ok: true, data: (await response.json()) as T };
  } catch {
    return { ok: false, error: UNAVAILABLE };
  }
}

function bucketKey(date: Date, granularity: Period["granularity"]): string {
  if (granularity === "hour") return `${date.getHours()}`;
  if (granularity === "month") return `${date.getFullYear()}-${date.getMonth()}`;
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function buildBuckets(period: Period, rows: Transaction[]): ActivityBucket[] {
  const buckets = new Map<string, ActivityBucket>();
  const cursor = new Date(period.from);

  if (period.granularity === "hour") {
    for (let hour = 0; hour < 24; hour += 1) {
      const label = `${`${hour}`.padStart(2, "0")}:00`;
      buckets.set(`${hour}`, {
        key: `${hour}`,
        label,
        axisLabel: hour % 3 === 0 ? label.slice(0, 2) : "",
        count: 0,
        value: 0,
        valueLabel: formatAmount(0),
      });
    }
  } else if (period.granularity === "month") {
    const month = new Date(period.from.getFullYear(), period.from.getMonth(), 1);
    while (month <= period.to) {
      const key = `${month.getFullYear()}-${month.getMonth()}`;
      buckets.set(key, {
        key,
        label: `${formatMonth(month)} ${month.getFullYear()}`,
        axisLabel: formatMonth(month),
        count: 0,
        value: 0,
        valueLabel: formatAmount(0),
      });
      month.setMonth(month.getMonth() + 1);
    }
  } else {
    cursor.setHours(0, 0, 0, 0);
    const days: Date[] = [];
    while (cursor <= period.to) {
      days.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    const step = Math.ceil(days.length / 12);
    days.forEach((day, index) => {
      const key = bucketKey(day, "day");
      buckets.set(key, {
        key,
        label: `${formatWeekday(day)} ${formatShortDate(day)}`,
        axisLabel:
          days.length <= 8 || index % step === 0 ? formatShortDate(day) : "",
        count: 0,
        value: 0,
        valueLabel: formatAmount(0),
      });
    });
  }

  for (const row of rows) {
    const key = bucketKey(new Date(row.occurredAt), period.granularity);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.count += 1;
    if (row.status === "successful") bucket.value += row.amount;
  }

  return [...buckets.values()].map((bucket) => ({
    ...bucket,
    valueLabel: formatAmount(bucket.value),
  }));
}

function buildTotals(rows: Transaction[]): DashboardTotals {
  const successfulRows = rows.filter((row) => row.status === "successful");
  const value = successfulRows.reduce((sum, row) => sum + row.amount, 0);
  return {
    count: rows.length,
    value,
    valueLabel: formatAmount(value),
    successful: successfulRows.length,
    failed: rows.filter((row) => row.status === "failed").length,
    pending: rows.filter((row) => row.status === "pending").length,
    reversed: rows.filter((row) => row.status === "reversed").length,
    averageLabel: formatAmount(
      successfulRows.length ? value / successfulRows.length : 0,
    ),
  };
}

function buildBreakdown(rows: Transaction[]): StatusBreakdown[] {
  const statuses: StatusBreakdown["status"][] = [
    "successful",
    "pending",
    "failed",
    "reversed",
  ];
  return statuses.map((status) => {
    const count = rows.filter((row) => row.status === status).length;
    return {
      status,
      count,
      share: rows.length ? (count / rows.length) * 100 : 0,
    };
  });
}

function percentChange(current: number, previous: number): number {
  if (!previous) return current ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export async function getDashboard(
  session: MerchantSession,
  period: Period,
): Promise<DataResult<DashboardData>> {
  const state = apiState(session);

  if (state === "live") {
    return requestApi<DashboardData>("dashboard", session, {
      from: period.from.toISOString(),
      to: period.to.toISOString(),
    });
  }

  if (state === "unavailable") return { ok: false, error: UNAVAILABLE };

  const rows = sampleTransactions(period.from, period.to, session.merchantId);
  const previous = previousPeriod(period);
  const previousRows = sampleTransactions(
    previous.from,
    previous.to,
    session.merchantId,
  );
  const totals = buildTotals(rows);
  const previousTotals = buildTotals(previousRows);

  return {
    ok: true,
    data: {
      totals,
      change: {
        count: percentChange(totals.count, previousTotals.count),
        value: percentChange(totals.value, previousTotals.value),
      },
      activity: buildBuckets(period, rows),
      breakdown: buildBreakdown(rows),
      recent: rows.slice(0, 6),
      account: sampleAccount(session.merchantId, session.businessName),
      terminals: sampleTerminals(),
      notices: sampleNotices(),
    },
  };
}

function matchesQuery(row: Transaction, query: TransactionQuery): boolean {
  if (query.status !== "all" && row.status !== query.status) return false;
  if (query.method !== "all" && row.method !== query.method) return false;
  if (query.channel !== "all" && row.channel !== query.channel) return false;
  if (query.minAmount !== null && row.amount < query.minAmount) return false;
  if (query.maxAmount !== null && row.amount > query.maxAmount) return false;
  if (query.search) {
    const needle = query.search.toLowerCase();
    const haystack = [
      row.reference,
      row.merchantReference,
      row.authorizationReference,
      row.terminalId ?? "",
      row.amountLabel,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export async function getTransactionPage(
  session: MerchantSession,
  period: Period,
  query: TransactionQuery,
): Promise<DataResult<TransactionPage>> {
  const state = apiState(session);

  if (state === "live") {
    return requestApi<TransactionPage>("transactions", session, {
      from: period.from.toISOString(),
      to: period.to.toISOString(),
      page: `${query.page}`,
      pageSize: `${query.pageSize}`,
    });
  }

  if (state === "unavailable") return { ok: false, error: UNAVAILABLE };

  const all = sampleTransactions(period.from, period.to, session.merchantId);
  const filtered = all.filter((row) => matchesQuery(row, query));
  const pageCount = Math.max(1, Math.ceil(filtered.length / query.pageSize));
  const page = Math.min(Math.max(1, query.page), pageCount);
  const start = (page - 1) * query.pageSize;
  const totalValue = filtered
    .filter((row) => row.status === "successful")
    .reduce((sum, row) => sum + row.amount, 0);

  return {
    ok: true,
    data: {
      rows: filtered.slice(start, start + query.pageSize),
      total: filtered.length,
      totalValueLabel: formatAmount(totalValue),
      page,
      pageCount,
      pageSize: query.pageSize,
      methods: [...new Set(all.map((row) => row.method))].sort(),
      channels: [...new Set(all.map((row) => row.channel))].sort(),
    },
  };
}

export async function getTransaction(
  session: MerchantSession,
  period: Period,
  reference: string,
): Promise<Transaction | null> {
  if (apiState(session) !== "preview") return null;
  const rows = sampleTransactions(period.from, period.to, session.merchantId);
  return rows.find((row) => row.reference === reference) ?? null;
}

export const getAccount = cache(async function getAccount(
  session: MerchantSession,
): Promise<DataResult<{ account: MerchantAccount; terminals: Terminal[] }>> {
  const state = apiState(session);

  if (state === "live") {
    return requestApi<{ account: MerchantAccount; terminals: Terminal[] }>(
      "account",
      session,
    );
  }

  if (state === "unavailable") return { ok: false, error: UNAVAILABLE };

  return {
    ok: true,
    data: {
      account: sampleAccount(session.merchantId, session.businessName),
      terminals: sampleTerminals(),
    },
  };
});

export async function getNotices(
  session: MerchantSession,
): Promise<Notice[]> {
  return apiState(session) === "preview" ? sampleNotices() : [];
}

/**
 * Submits updated contact details for the authenticated merchant.
 *
 * The merchant is resolved from the session on the server; the browser cannot
 * choose which merchant record is written. Without a configured API the portal
 * says so plainly rather than pretending the change was saved.
 */
export async function submitContactUpdate(
  session: MerchantSession,
  values: ContactDetails,
): Promise<ContactUpdateResult> {
  const base = process.env.MERCHANT_API_URL;

  if (!base) {
    return {
      ok: false,
      code: "unavailable",
      message:
        "Contact details cannot be updated from this environment yet. Please contact I&M Bank to change the details we hold for your business.",
    };
  }

  try {
    const url = new URL("account/contact", base.endsWith("/") ? base : `${base}/`);
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}),
      },
      body: JSON.stringify(values),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    if (response.status === 401 || response.status === 403) {
      return {
        ok: false,
        code: "session_expired",
        message: "Your session has expired. Please sign in again.",
      };
    }
    if (response.status === 400 || response.status === 422) {
      return {
        ok: false,
        code: "invalid",
        message: "Some of the details could not be accepted. Please check them and try again.",
      };
    }
    if (!response.ok) {
      return {
        ok: false,
        code: "unavailable",
        message:
          "We could not update your contact details right now. Please try again later.",
      };
    }

    return {
      ok: true,
      message: "Your contact details have been sent to I&M Bank for updating.",
    };
  } catch {
    return {
      ok: false,
      code: "unavailable",
      message:
        "We could not update your contact details right now. Please try again later.",
    };
  }
}
