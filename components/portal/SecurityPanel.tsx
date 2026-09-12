import { signOut } from "@/app/(portal)/actions";
import { Chip } from "@/components/ui/StatusPill";
import { LockIcon, LogoutIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { MerchantAccount } from "@/lib/merchant/types";

import { DetailRow, Module, ModuleHeader } from "./Module";

export function SecurityPanel({
  account,
  className,
}: {
  account: MerchantAccount;
  className?: string;
}) {
  return (
    <Module className={cn("flex flex-col", className)} id="security">
      <ModuleHeader
        title="Access & security"
        description="How this merchant account is accessed"
      />

      <div className="grid grid-cols-1 gap-x-10 px-5 py-5 sm:px-6 lg:grid-cols-2">
        <dl className="self-start">
          <DetailRow label="Last sign-in" value={account.lastLogin} />
          <DetailRow
            label="Active sessions"
            value={account.activeSessions === 1 ? "1 session" : `${account.activeSessions} sessions`}
          />
          <DetailRow label="Password last updated" value={account.passwordUpdated} managed />
          <DetailRow
            label="Two-step verification"
            value={
              <Chip tone={account.twoFactorEnabled ? "brand" : "attention"}>
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 rounded-full",
                    account.twoFactorEnabled ? "bg-brand-teal-600" : "bg-[#c98a10]",
                  )}
                />
                {account.twoFactorEnabled ? "On" : "Off"}
              </Chip>
            }
            managed
          />
        </dl>

        <div className="mt-6 space-y-3 lg:mt-0">
        <p className="flex items-start gap-2.5 rounded-xl bg-[#f7f9fc] px-4 py-3 text-[13px] leading-relaxed text-muted">
          <LockIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-blue" />
          <span>
            This portal never shows your password, PIN, full account number or
            card details. Never share them with anyone.
          </span>
        </p>
        <p className="flex items-start gap-2.5 rounded-xl bg-[#f7f9fc] px-4 py-3 text-[13px] leading-relaxed text-muted">
          <ShieldCheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-blue" />
          <span>
            Sign-in credentials and two-step verification are managed by I&amp;M
            Bank. Contact the bank to change how you sign in.
          </span>
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-[#e4e9f2] px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-danger/40 hover:bg-danger-soft hover:text-danger"
          >
            <LogoutIcon className="size-4" />
            Sign out of this session
          </button>
        </form>
        </div>
      </div>
    </Module>
  );
}
