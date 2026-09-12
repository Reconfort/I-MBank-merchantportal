import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/PortalShell";
import { readSession } from "@/lib/auth/session";
import { getNotices } from "@/lib/merchant/service";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await readSession();
  if (!session) redirect("/signin");

  const notices = await getNotices(session);

  return (
    <PortalShell
      merchantName={session.businessName}
      merchantId={session.merchantId}
      preview={session.preview}
      notices={notices}
    >
      {children}
    </PortalShell>
  );
}
