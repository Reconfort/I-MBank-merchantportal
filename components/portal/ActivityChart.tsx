"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/cn";
import { formatCompactNumber, formatNumber } from "@/lib/merchant/format";
import type { Granularity } from "@/lib/merchant/period";
import type { ActivityBucket } from "@/lib/merchant/types";

type Metric = "count" | "value";

function metricCaption(granularity: Granularity, metric: Metric): string {
  switch (granularity) {
    case "hour":
      return metric === "count" ? "Hourly volume" : "Hourly value";
    case "day":
      return metric === "count" ? "Daily volume" : "Daily value";
    case "month":
      return metric === "count" ? "Monthly volume" : "Monthly value";
    default: {
      const _exhaustive: never = granularity;
      return _exhaustive;
    }
  }
}

function defaultBucketKey(buckets: ActivityBucket[]): string | null {
  for (let index = buckets.length - 1; index >= 0; index -= 1) {
    const bucket = buckets[index];
    if (bucket && (bucket.count > 0 || bucket.value > 0)) return bucket.key;
  }
  return buckets.at(-1)?.key ?? null;
}

export function ActivityChart({
  buckets,
  granularity,
}: {
  buckets: ActivityBucket[];
  granularity: Granularity;
}) {
  const [metric, setMetric] = useState<Metric>("count");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const readoutId = useId();

  const values = buckets.map((bucket) =>
    metric === "count" ? bucket.count : bucket.value,
  );
  const peak = Math.max(1, ...values);
  const resolvedKey =
    selectedKey && buckets.some((bucket) => bucket.key === selectedKey)
      ? selectedKey
      : defaultBucketKey(buckets);
  const selected =
    buckets.find((bucket) => bucket.key === resolvedKey) ?? null;
  const ticks = [1, 0.75, 0.5, 0.25, 0];

  const labelledIndexes = buckets
    .map((bucket, index) => (bucket.axisLabel ? index : -1))
    .filter((index) => index >= 0);
  const shortLabels = buckets.every(
    (bucket) => bucket.axisLabel.length <= 4,
  );
  const showAllLabels = buckets.length <= 12 && shortLabels;
  const step = (perScreen: number) => {
    let value = 1;
    while (value < labelledIndexes.length / perScreen) value *= 2;
    return value;
  };
  const smallStep = step(5);
  const mediumStep = step(11);
  const wideStep = step(16);
  const labelVisibility = new Map<number, string>();
  if (!showAllLabels) {
    labelledIndexes.forEach((index, position) => {
      if (position % smallStep === 0) return;
      if (position % mediumStep === 0) {
        labelVisibility.set(index, "hidden sm:block");
      } else if (position % wideStep === 0) {
        labelVisibility.set(index, "hidden xl:block");
      } else {
        labelVisibility.set(index, "hidden");
      }
    });
  }

  const tickLabel = (ratio: number) => formatCompactNumber(peak * ratio);

  return (
    <div>
      <div className="flex flex-col gap-3 px-6 pb-4 pt-1 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pt-5">
        <div className="min-w-0">
          <h2 className="text-[13px] font-bold tracking-[0.01em] text-white/70">
            Transaction activity
          </h2>
          <p className="mt-1 text-sm text-white/70">
            {metricCaption(granularity, metric)}
          </p>
        </div>
        <div
          role="group"
          aria-label="Chart metric"
          className="grid w-full grid-cols-2 gap-1 rounded-full bg-white/10 p-1 sm:flex sm:w-auto"
        >
          {(
            [
              { key: "count", label: "Volume" },
              { key: "value", label: "Value" },
            ] as const
          ).map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setMetric(option.key)}
              aria-pressed={metric === option.key}
              className={cn(
                "h-9 rounded-full px-4 text-xs font-bold transition-colors sm:h-8",
                metric === option.key
                  ? "bg-white text-brand-blue"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-5 sm:px-8">
        <div className="relative flex gap-2 sm:gap-3">
          <div
            aria-hidden="true"
            className="flex w-9 shrink-0 flex-col justify-between py-0.5 text-right text-[10px] font-medium tabular-nums text-white/65 sm:w-11 sm:text-[11px]"
          >
            {ticks.map((ratio) => (
              <span key={ratio}>{tickLabel(ratio)}</span>
            ))}
          </div>

          <div className="relative min-w-0 flex-1">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex flex-col justify-between"
            >
              {ticks.map((ratio) => (
                <span key={ratio} className="block h-px w-full bg-white/10" />
              ))}
            </div>

            <ul className="relative flex h-[200px] items-end gap-[3px] sm:h-[230px] sm:gap-[0.5%]">
              {buckets.map((bucket) => {
                const raw = metric === "count" ? bucket.count : bucket.value;
                const height = peak ? (raw / peak) * 100 : 0;
                const isSelected = bucket.key === resolvedKey;
                return (
                  <li
                    key={bucket.key}
                    className="flex h-full min-w-0 flex-1 items-end"
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setSelectedKey(bucket.key)}
                      onFocus={() => setSelectedKey(bucket.key)}
                      onClick={() => setSelectedKey(bucket.key)}
                      aria-pressed={isSelected}
                      aria-describedby={readoutId}
                      className="group relative flex h-full w-full items-end justify-center rounded-t-[3px] outline-offset-4"
                    >
                      <span className="sr-only">
                        {bucket.label}: {formatNumber(bucket.count)}{" "}
                        transactions, {bucket.valueLabel}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "w-full max-w-9 rounded-t-[4px] bg-white/70 transition-[background-color,opacity] duration-200 sm:max-w-none",
                          isSelected && "bg-white",
                          resolvedKey && !isSelected
                            ? "opacity-40"
                            : "opacity-100",
                        )}
                        style={{
                          height: `${Math.max(height, raw > 0 ? 3 : 0)}%`,
                        }}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <ul
              aria-hidden="true"
              className="mt-2.5 flex h-4 gap-[3px] text-[10px] font-medium text-white/65 sm:mt-3 sm:gap-[0.5%] sm:text-[11px]"
            >
              {buckets.map((bucket, index) => (
                <li key={bucket.key} className="relative min-w-0 flex-1">
                  <span
                    className={cn(
                      "absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap",
                      labelVisibility.get(index),
                    )}
                  >
                    {bucket.axisLabel}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          id={readoutId}
          role="status"
          className="mt-4 rounded-2xl bg-white/8 px-4 py-3"
        >
          <p className="text-[12px] font-medium text-white/65">
            {selected?.label ?? "No activity"}
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-base font-bold leading-none text-white">
              {selected ? formatNumber(selected.count) : "0"}{" "}
              <span className="text-xs font-bold text-white/65">
                transactions
              </span>
            </p>
            <p className="text-sm font-bold text-brand-teal-200">
              {selected?.valueLabel ?? ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
