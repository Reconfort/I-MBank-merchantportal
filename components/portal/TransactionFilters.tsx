"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ChevronDownIcon, CloseIcon, SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export type FilterValues = {
  q: string;
  status: string;
  method: string;
  channel: string;
  min: string;
  max: string;
};

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "successful", label: "Successful" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "reversed", label: "Reversed" },
];

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-[#dfe4ee] bg-white pl-3.5 pr-9 text-sm font-medium text-ink outline-none transition-[border-color,box-shadow] hover:border-muted focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
      />
    </label>
  );
}

export function TransactionFilters({
  values,
  methods,
  channels,
  baseParams,
}: {
  values: FilterValues;
  methods: string[];
  channels: string[];
  /** Period parameters that must survive a filter change. */
  baseParams: Record<string, string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(values.q);
  const searchTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimer.current) window.clearTimeout(searchTimer.current);
    };
  }, []);

  const apply = (next: Partial<FilterValues>) => {
    const merged = { ...values, ...next };
    const params = new URLSearchParams(baseParams);
    if (merged.q) params.set("q", merged.q);
    if (merged.status !== "all") params.set("status", merged.status);
    if (merged.method !== "all") params.set("method", merged.method);
    if (merged.channel !== "all") params.set("channel", merged.channel);
    if (merged.min) params.set("min", merged.min);
    if (merged.max) params.set("max", merged.max);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    if (searchTimer.current) window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => apply({ q: value }), 350);
  };

  const activeCount =
    (values.q ? 1 : 0) +
    (values.status !== "all" ? 1 : 0) +
    (values.method !== "all" ? 1 : 0) +
    (values.channel !== "all" ? 1 : 0) +
    (values.min ? 1 : 0) +
    (values.max ? 1 : 0);

  const clearAll = () => {
    setSearch("");
    router.replace(`${pathname}?${new URLSearchParams(baseParams).toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-3 px-5 py-4 sm:px-6 lg:grid-cols-12">
      <div className="relative lg:col-span-4">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted"
        />
        <label htmlFor="txn-search" className="sr-only">
          Search transactions
        </label>
        <input
          id="txn-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search reference, amount or terminal"
          className="h-11 w-full rounded-xl border border-[#dfe4ee] bg-white pl-10 pr-3 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#8a93a5] hover:border-muted focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
        />
      </div>

      <div className="lg:col-span-2">
        <Select
          label="Status"
          value={values.status}
          options={STATUS_OPTIONS}
          onChange={(value) => apply({ status: value })}
        />
      </div>
      <div className="lg:col-span-2">
        <Select
          label="Payment method"
          value={values.method}
          options={[
            { value: "all", label: "All methods" },
            ...methods.map((method) => ({ value: method, label: method })),
          ]}
          onChange={(value) => apply({ method: value })}
        />
      </div>
      <div className="lg:col-span-2">
        <Select
          label="Channel"
          value={values.channel}
          options={[
            { value: "all", label: "All channels" },
            ...channels.map((channel) => ({ value: channel, label: channel })),
          ]}
          onChange={(value) => apply({ channel: value })}
        />
      </div>

      <div className="flex gap-2 lg:col-span-2">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Minimum amount</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={values.min}
            onBlur={(event) => apply({ min: event.target.value })}
            placeholder="Min"
            className="h-11 w-full rounded-xl border border-[#dfe4ee] bg-white px-3 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#8a93a5] hover:border-muted focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
          />
        </label>
        <label className="min-w-0 flex-1">
          <span className="sr-only">Maximum amount</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={values.max}
            onBlur={(event) => apply({ max: event.target.value })}
            placeholder="Max"
            className="h-11 w-full rounded-xl border border-[#dfe4ee] bg-white px-3 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#8a93a5] hover:border-muted focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
          />
        </label>
      </div>

      <div
        className={cn(
          "lg:col-span-12",
          activeCount ? "block" : "hidden",
        )}
      >
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-mist px-3 py-1.5 text-[13px] font-bold text-brand-blue transition-colors hover:bg-[#e2eaf8]"
        >
          <CloseIcon className="size-3.5" />
          Clear {activeCount} filter{activeCount === 1 ? "" : "s"}
        </button>
      </div>
    </div>
  );
}
