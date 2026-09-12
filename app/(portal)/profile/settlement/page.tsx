import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  DetailRow,
  ManagedBadge,
  Module,
  ModuleHeader,
} from "@/components/portal/Module";
import { InfoIcon } from "@/components/ui/icons";
import { readSession } from "@/lib/auth/session";
import { getAccount } from "@/lib/merchant/service";

export const metadata: Metadata = {
  title: "Settlement | I&M Merchant Portal",
  description: "Where your collections are paid.",
};

export default async function ProfileSettlementPage() {
  const session = await readSession();
  if (!session) redirect("/signin");

  const result = await getAccount(session);
  if (!result.ok) return null;

  const { account } = result.data;

  return (
    <Module className="max-w-2xl">
      <ModuleHeader
        title="Settlement"
        description="Where your collections are paid"
        action={<ManagedBadge />}
      />
      <div className="px-5 py-1 sm:px-6">
        <dl>
          <DetailRow label="Settlement bank" value={account.settlementBank} />
          <DetailRow
            label="Settlement account"
            value={account.settlementAccountMasked}
            hint="Account number is masked for your security"
          />
          <DetailRow label="Currency" value={account.settlementCurrency} />
          <DetailRow label="Frequency" value={account.settlementFrequency} />
        </dl>
      </div>
      <p className="flex items-start gap-2.5 px-5 pb-5 pt-4 text-[13px] leading-relaxed text-muted sm:px-6">
        <InfoIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-blue" />
        <span>
          Settlement instructions are set by I&amp;M Bank. This portal shows them
          for reference — it cannot move funds or change where they are paid.{" "}
          <Link
            href="/help"
            className="font-bold text-brand-blue underline-offset-2 hover:underline"
          >
            How to request a change
          </Link>
          .
        </span>
      </p>
    </Module>
  );
}
