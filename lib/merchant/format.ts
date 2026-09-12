const DEFAULT_CURRENCY = "RWF";

const numberFormatter = new Intl.NumberFormat("en-GB");
const compactFormatter = new Intl.NumberFormat("en-GB", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export function formatNumber(value: number): string {
  return numberFormatter.format(Math.round(value));
}

export function formatAmount(value: number, currency = DEFAULT_CURRENCY): string {
  return `${currency} ${numberFormatter.format(Math.round(value))}`;
}

export function formatCompactAmount(
  value: number,
  currency = DEFAULT_CURRENCY,
): string {
  return `${currency} ${compactFormatter.format(value)}`;
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatSignedPercent(value: number): string {
  const rounded = Math.abs(value) < 0.05 ? 0 : value;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "−" : "";
  return `${sign}${Math.abs(rounded).toFixed(1)}%`;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "short" });
const weekdayFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "short" });

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

export function formatShortDate(date: Date): string {
  return shortDateFormatter.format(date);
}

export function formatTime(date: Date): string {
  return timeFormatter.format(date);
}

export function formatMonth(date: Date): string {
  return monthFormatter.format(date);
}

export function formatWeekday(date: Date): string {
  return weekdayFormatter.format(date);
}

export function toInputDate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Up to two uppercase initials for an avatar, e.g. "Kigali Fresh Mart" -> "KF". */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
