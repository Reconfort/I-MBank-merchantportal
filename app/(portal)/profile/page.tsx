import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  DetailRow,
  ManagedBadge,
  Module,
  ModuleHeader,
} from "@/components/portal/Module";
import { readSession } from "@/lib/auth/session";
import { getAccount } from "@/lib/merchant/service";

export const metadata: Metadata = {
  title: "Account information | I&M Merchant Portal",
  description: "Your registered business and merchant record.",
};

const ACCOUNT_STATUS_LABEL = {
  active: "Active",
  review: "Under review",
  suspended: "Suspended",
} as const;

function GroupHeading({ children }: { children: string }) {
  return (
    <h3 className="pb-1 text-[13px] font-bold text-brand-blue">
      {children}
    </h3>
  );
}

export default async function ProfileAccountPage() {
  const session = await readSession();
  if (!session) redirect("/signin");

  const result = await getAccount(session);
  if (!result.ok) return null;

  const { account } = result.data;

  return (
    <Module>
      <ModuleHeader
        title="Account information"
        description="Your registered business and merchant record"
        action={<ManagedBadge />}
      />
      <div className="grid grid-cols-1 gap-x-10 px-5 pb-5 pt-5 sm:px-6 lg:grid-cols-2">
        <div>
          <GroupHeading>Business</GroupHeading>
          <dl>
            <DetailRow label="Registered name" value={account.businessName} />
            <DetailRow label="Trading name" value={account.tradingName} />
            <DetailRow label="Business type" value={account.businessType} />
            <DetailRow label="Business category" value={account.category} />
            <DetailRow label="Registration number" value={account.registrationNumber} />
            <DetailRow label="Tax identification" value={account.taxId} />
            <DetailRow label="Registered address" value={account.address} />
          </dl>
        </div>
        <div className="mt-6 lg:mt-0">
          <GroupHeading>Merchant</GroupHeading>
          <dl>
            <DetailRow label="Merchant ID" value={account.merchantId} />
            <DetailRow label="Service" value={account.serviceType} />
            <DetailRow label="Merchant since" value={account.merchantSince} />
            <DetailRow
              label="Account status"
              value={ACCOUNT_STATUS_LABEL[account.status]}
            />
            <DetailRow label="Assigned branch" value={account.branch} />
          </dl>
        </div>
      </div>
    </Module>
  );
}
