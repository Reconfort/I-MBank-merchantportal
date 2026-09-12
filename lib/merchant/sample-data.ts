import {
  formatAmount,
  formatDate,
  formatTime,
} from "./format";
import type {
  MerchantAccount,
  Notice,
  Terminal,
  Transaction,
  TransactionStatus,
} from "./types";

/**
 * Deterministic sample data for preview mode.
 *
 * This is illustrative material for design review only — it is never used when
 * `MERCHANT_AUTH_API_URL` is configured, and the UI labels it as sample data.
 */

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

const METHODS = ["Card", "Mobile", "Bank transfer"] as const;
const CHANNELS = ["POS terminal", "Online", "QR"] as const;

const STATUS_WEIGHTS: { status: TransactionStatus; weight: number }[] = [
  { status: "successful", weight: 0.962 },
  { status: "failed", weight: 0.024 },
  { status: "pending", weight: 0.011 },
  { status: "reversed", weight: 0.003 },
];

function pickStatus(random: number): TransactionStatus {
  let threshold = 0;
  for (const entry of STATUS_WEIGHTS) {
    threshold += entry.weight;
    if (random <= threshold) return entry.status;
  }
  return "successful";
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/** Transactions for one day, shaped like real retail trading hours. */
function transactionsForDay(day: Date, merchantId: string): Transaction[] {
  const random = mulberry32(hash(`${merchantId}:${dayKey(day)}`));
  const weekday = day.getDay();
  const base = weekday === 0 ? 18 : weekday === 6 ? 52 : 38;
  const count = Math.max(0, Math.round(base + (random() - 0.5) * 16));
  const rows: Transaction[] = [];

  for (let index = 0; index < count; index += 1) {
    const hourRandom = random();
    // Two trading peaks: late morning and early evening.
    const hour =
      hourRandom < 0.45
        ? 8 + Math.floor(random() * 5)
        : hourRandom < 0.85
          ? 13 + Math.floor(random() * 5)
          : 18 + Math.floor(random() * 3);
    const minute = Math.floor(random() * 60);
    const occurred = new Date(day);
    occurred.setHours(hour, minute, Math.floor(random() * 60), 0);

    const magnitude = random();
    const amount =
      magnitude > 0.96
        ? 80_000 + Math.round(random() * 90_000)
        : magnitude > 0.75
          ? 25_000 + Math.round(random() * 45_000)
          : 1_500 + Math.round(random() * 22_000);

    const status = pickStatus(random());
    const method = METHODS[Math.floor(random() * METHODS.length)];
    const channel =
      method === "Card"
        ? CHANNELS[random() > 0.2 ? 0 : 1]
        : CHANNELS[Math.floor(random() * CHANNELS.length)];
    const serial = 400_000 + Math.floor(random() * 99_999);
    const terminalId = channel === "POS terminal" ? "POS-004821-01" : null;
    const settled = status === "successful" && random() > 0.25;
    const settlementDate = new Date(occurred.getTime() + 86_400_000);

    rows.push({
      id: `TXN-${serial}`,
      reference: `TXN-${serial}`,
      occurredAt: occurred.toISOString(),
      dateLabel: formatDate(occurred),
      timeLabel: formatTime(occurred),
      amount,
      amountLabel: formatAmount(amount),
      currency: "RWF",
      status,
      method,
      channel,
      terminalId,
      merchantReference: `MRC-${serial % 10_000}`.padEnd(8, "0"),
      authorizationReference: `AUTH-${(serial * 7) % 1_000_000}`,
      settlementStatus:
        status !== "successful" ? "not_settled" : settled ? "settled" : "pending",
      settlementDateLabel:
        status === "successful" && settled ? formatDate(settlementDate) : null,
    });
  }

  return rows.sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
}

export function sampleTransactions(
  from: Date,
  to: Date,
  merchantId: string,
): Transaction[] {
  const rows: Transaction[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);

  while (cursor <= to) {
    for (const row of transactionsForDay(cursor, merchantId)) {
      const occurred = new Date(row.occurredAt);
      if (occurred >= from && occurred <= to) rows.push(row);
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return rows.sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
}

export function sampleAccount(
  merchantId: string,
  businessName: string,
): MerchantAccount {
  return {
    merchantId,
    businessName,
    tradingName: businessName,
    status: "active",
    merchantSince: "January 2025",
    serviceType: "Merchant Payments",
    category: "Retail — Supermarket",
    businessType: "Private Limited Company",
    registrationNumber: "RW-1029384756",
    taxId: "TIN-104938271",
    address: "KG 11 Ave, Kimihurura, Kigali",
    branch: "Kigali Main Branch",
    contactName: "Sandrine Uwase",
    contactPhone: "+250 788 000 000",
    contactEmail: "accounts@kigalifreshmart.rw",
    settlementBank: "I&M Bank (Rwanda) Plc",
    settlementAccountMasked: "**** 4821",
    settlementCurrency: "RWF",
    settlementFrequency: "Daily (next working day)",
    lastLogin: "Today, 08:14",
    twoFactorEnabled: true,
    activeSessions: 1,
    passwordUpdated: "12 June 2026",
  };
}

export function sampleTerminals(): Terminal[] {
  return [
    {
      id: "POS-004821-01",
      label: "Main counter",
      status: "active",
      location: "Kimihurura store",
      deviceType: "Countertop terminal",
      lastActivity: "Today, 14:32",
    },
    {
      id: "POS-004821-02",
      label: "Express lane",
      status: "inactive",
      location: "Kimihurura store",
      deviceType: "Portable terminal",
      lastActivity: "28 Aug 2026, 17:05",
    },
  ];
}

export function sampleNotices(): Notice[] {
  return [
    {
      id: "ntc-1",
      title: "Monthly statement available",
      body: "Your monthly merchant statement is ready at your branch.",
      timeLabel: "2 days ago",
      tone: "info",
    },
    {
      id: "ntc-2",
      title: "Statement period closed",
      body: "Last month's activity is now final and available under Transactions.",
      timeLabel: "1 week ago",
      tone: "attention",
    },
    {
      id: "ntc-3",
      title: "Scheduled maintenance",
      body: "Merchant services maintenance is planned for Sunday, 02:00–04:00.",
      timeLabel: "1 week ago",
      tone: "info",
    },
  ];
}
