"use client";

import { BellIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { Notice } from "@/lib/merchant/types";

import { useDismissable } from "./useDismissable";

export function NotificationBell({
  notices,
  preview = false,
}: {
  notices: Notice[];
  preview?: boolean;
}) {
  const { open, setOpen, panelRef, triggerRef } = useDismissable<
    HTMLButtonElement,
    HTMLDivElement
  >();

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={
          notices.length
            ? `Notices (${notices.length} unread)`
            : "Notices"
        }
        className={cn(
          "relative grid size-12 place-items-center rounded-full border border-[#e4e9f2] bg-white/95 text-ink shadow-[0_10px_30px_-20px_rgb(4_19_51/0.5)] backdrop-blur transition-colors hover:border-brand-blue/30 hover:text-brand-blue",
          open && "border-brand-blue/40 text-brand-blue",
        )}
      >
        <BellIcon className="size-5" />
        {notices.length ? (
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 size-2 rounded-full bg-brand-teal-600 ring-2 ring-white"
          />
        ) : null}
      </button>

      <div
        ref={panelRef}
        role="dialog"
        aria-label="Notices"
        className={cn(
          // Anchored to the viewport on small screens — the bell sits too far
          // from the right edge for a panel anchored to it to stay on screen.
          "fixed inset-x-4 top-[calc(var(--header-h)+8px)] z-50 origin-top rounded-2xl border border-[#e4e9f2] bg-white p-2 shadow-[0_30px_60px_-25px_rgb(4_19_51/0.45)] transition-[opacity,transform,visibility] duration-200 ease-out-quint sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+10px)] sm:w-[22rem] sm:origin-top-right",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0",
        )}
      >
        <p className="px-3 pb-2 pt-2 text-[13px] font-bold text-ink">
          Notices
        </p>
        {notices.length ? (
          <ul className="max-h-[60vh] overflow-y-auto">
            {notices.map((notice) => (
              <li
                key={notice.id}
                className="rounded-xl px-3 py-3 transition-colors hover:bg-surface"
              >
                <div className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      notice.tone === "attention"
                        ? "bg-[#c98a10]"
                        : "bg-brand-blue",
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink">{notice.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">
                      {notice.body}
                    </p>
                    <p className="mt-1.5 text-xs text-muted">{notice.timeLabel}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-3 pb-4 pt-1 text-sm leading-relaxed text-muted">
            You have no notices right now.
          </p>
        )}
        {preview && notices.length ? (
          <p className="mt-1 border-t border-[#f0f3f8] px-3 pb-1 pt-2.5 text-[12px] text-muted">
            Sample notices — the merchant API is not connected.
          </p>
        ) : null}
      </div>
    </div>
  );
}
