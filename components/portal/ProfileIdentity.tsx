import { Chip } from "@/components/ui/StatusPill";
import { cn } from "@/lib/cn";
import { initials } from "@/lib/merchant/format";
import type { MerchantAccount } from "@/lib/merchant/types";

import { ProfileTabs } from "./ProfileTabs";

const ACCOUNT_STATUS: Record<
  MerchantAccount["status"],
  { label: string; tone: "brand" | "attention"; dot: string }
> = {
  active: { label: "Active", tone: "brand", dot: "bg-brand-teal-600" },
  review: { label: "Under review", tone: "attention", dot: "bg-[#c98a10]" },
  suspended: { label: "Suspended", tone: "attention", dot: "bg-[#c98a10]" },
};

/**
 * Identity band for the profile page: who this merchant is, at a glance,
 * with in-page navigation to the record sections underneath.
 */
export function ProfileIdentity({
  account,
  terminalCount,
}: {
  account: MerchantAccount;
  terminalCount: number;
}) {
  const status = ACCOUNT_STATUS[account.status];

  return (
    <section
      aria-label="Merchant identity"
      className="relative isolate overflow-hidden rounded-3xl border border-[#e4e9f2] bg-white shadow-[0_30px_70px_-55px_rgb(4_19_51/0.8)]"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-brand-gradient" />

      <div className="flex flex-col gap-6 px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <span
            aria-hidden="true"
            className="grid size-14 shrink-0 place-items-center rounded-2xl bg-identity-gradient text-lg font-bold text-white sm:size-16 sm:text-xl"
          >
            {initials(account.businessName)}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold tracking-[-0.01em] text-ink sm:text-2xl">
              {account.businessName}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {account.tradingName !== account.businessName
                ? `Trading as ${account.tradingName} · `
                : null}
              {account.category}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Chip tone="brand">{account.merchantId}</Chip>
              <Chip tone={status.tone}>
                <span aria-hidden="true" className={cn("size-1.5 rounded-full", status.dot)} />
                {status.label}
              </Chip>
            </div>
          </div>
        </div>

        <dl className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-4 border-t border-[#eef1f7] pt-5 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:py-1 lg:pl-10 lg:pt-1">
          {[
            { label: "Merchant since", value: account.merchantSince },
            { label: "Service", value: account.serviceType },
            { label: "Terminals", value: String(terminalCount) },
          ].map((item) => (
            <div key={item.label}>
              <dt className="text-[13px] font-medium text-muted">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm font-bold text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ProfileTabs />

    </section>
  );
}
