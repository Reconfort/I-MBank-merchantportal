"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { CalendarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { toInputDate } from "@/lib/merchant/format";
import { PERIOD_OPTIONS, type PeriodKey } from "@/lib/merchant/period";

import { useDismissable } from "./useDismissable";

export function PeriodSelector({
  periodKey,
  from,
  to,
  extraParams = {},
}: {
  periodKey: PeriodKey;
  /** ISO date strings (yyyy-mm-dd) for the custom range inputs. */
  from: string;
  to: string;
  extraParams?: Record<string, string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [customFrom, setCustomFrom] = useState(from);
  const [customTo, setCustomTo] = useState(to);
  const { open, setOpen, close, triggerRef, panelRef } = useDismissable<
    HTMLButtonElement,
    HTMLDivElement
  >();

  const push = (params: Record<string, string>) => {
    const search = new URLSearchParams({ ...extraParams, ...params });
    // A new period always restarts paging.
    search.delete("page");
    router.replace(`${pathname}?${search.toString()}`, { scroll: false });
  };

  const selectPeriod = (key: PeriodKey) => {
    if (key === "custom") {
      setOpen((value) => !value);
      return;
    }
    close();
    push({ period: key });
  };

  const applyCustom = () => {
    if (!customFrom || !customTo) return;
    close(true);
    push({ period: "custom", from: customFrom, to: customTo });
  };

  const today = toInputDate(new Date());

  return (
    <div className="relative">
      <div
        role="group"
        aria-label="Reporting period"
        className="flex flex-wrap items-center gap-1 rounded-full border border-[#e4e9f2] bg-white/95 p-1.5 shadow-[0_10px_30px_-24px_rgb(4_19_51/0.6)]"
      >
        {PERIOD_OPTIONS.map((option) => {
          const active = option.key === periodKey;
          const isCustom = option.key === "custom";
          return (
            <button
              key={option.key}
              ref={isCustom ? triggerRef : undefined}
              type="button"
              onClick={() => selectPeriod(option.key)}
              aria-pressed={active}
              aria-expanded={isCustom ? open : undefined}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-bold transition-colors duration-200",
                active
                  ? "bg-brand-blue text-white shadow-[0_8px_18px_-10px_rgb(0_51_161/0.9)]"
                  : "text-body hover:bg-brand-mist hover:text-brand-blue",
              )}
            >
              {isCustom ? <CalendarIcon className="size-4" /> : null}
              {option.label}
            </button>
          );
        })}
      </div>

      <div
        ref={panelRef}
        className={cn(
          "absolute right-0 top-[calc(100%+10px)] z-30 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-[#e4e9f2] bg-white p-4 shadow-[0_30px_60px_-25px_rgb(4_19_51/0.45)] transition-[opacity,transform,visibility] duration-200 ease-out-quint",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0",
        )}
      >
        <p className="text-[13px] font-bold text-ink">
          Custom range
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block font-bold text-ink">From</span>
            <input
              type="date"
              value={customFrom}
              max={customTo || today}
              tabIndex={open ? undefined : -1}
              onChange={(event) => setCustomFrom(event.target.value)}
              className="h-11 w-full rounded-lg border border-line-strong bg-white px-3 text-sm text-ink outline-none transition-[border-color,box-shadow] focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-bold text-ink">To</span>
            <input
              type="date"
              value={customTo}
              min={customFrom}
              max={today}
              tabIndex={open ? undefined : -1}
              onChange={(event) => setCustomTo(event.target.value)}
              className="h-11 w-full rounded-lg border border-line-strong bg-white px-3 text-sm text-ink outline-none transition-[border-color,box-shadow] focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={applyCustom}
          tabIndex={open ? undefined : -1}
          disabled={!customFrom || !customTo}
          className="mt-4 h-11 w-full rounded-full bg-brand-blue text-sm font-bold text-white transition-colors hover:bg-brand-blue-hover disabled:opacity-50"
        >
          Apply range
        </button>
      </div>
    </div>
  );
}
