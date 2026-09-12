"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { StatusPill } from "@/components/ui/StatusPill";
import { CloseIcon } from "@/components/ui/icons";
import type { Transaction } from "@/lib/merchant/types";

const SETTLEMENT_LABEL: Record<Transaction["settlementStatus"], string> = {
  settled: "Settled",
  pending: "Pending settlement",
  not_settled: "Not settled",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-[#f0f3f8] py-3 last:border-b-0">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="text-right text-sm font-bold text-ink">{value}</dd>
    </div>
  );
}

export function TransactionDrawer({
  transaction,
  closeHref,
}: {
  transaction: Transaction;
  closeHref: string;
}) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.replace(closeHref, { scroll: false });
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = previousOverflow;
    };
  }, [router, closeHref]);

  const close = () => router.replace(closeHref, { scroll: false });

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close transaction details"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-brand-navy/45 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="animate-drawer-in absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-white shadow-[-30px_0_60px_-30px_rgb(4_19_51/0.5)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="text-[12px] font-bold text-muted">
              Transaction details
            </p>
            <h2
              id="drawer-title"
              className="mt-1.5 text-xl font-bold tracking-[-0.01em] text-ink"
            >
              {transaction.reference}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="rounded-2xl bg-surface px-5 py-4">
            <p className="text-[12px] font-medium text-muted">
              Amount
            </p>
            <p className="mt-1.5 text-[28px] font-bold leading-none tracking-[-0.01em] text-ink">
              {transaction.amountLabel}
            </p>
            <p className="mt-3">
              <StatusPill status={transaction.status} />
            </p>
          </div>

          <dl className="mt-5">
            <Row label="Date" value={transaction.dateLabel} />
            <Row label="Time" value={transaction.timeLabel} />
            <Row label="Payment method" value={transaction.method} />
            <Row label="Channel" value={transaction.channel} />
            <Row label="Terminal ID" value={transaction.terminalId ?? "—"} />
            <Row label="Merchant reference" value={transaction.merchantReference} />
            <Row
              label="Authorization reference"
              value={transaction.authorizationReference}
            />
            <Row
              label="Settlement status"
              value={SETTLEMENT_LABEL[transaction.settlementStatus]}
            />
            <Row
              label="Settlement date"
              value={transaction.settlementDateLabel ?? "—"}
            />
          </dl>

          <p className="mt-6 rounded-xl bg-brand-mist px-4 py-3 text-[13px] leading-relaxed text-body">
            This portal is for monitoring and audit only. For disputes,
            reversals or settlement queries, contact I&amp;M Bank.
          </p>
        </div>
      </div>
    </div>
  );
}
