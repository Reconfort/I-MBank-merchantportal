import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { ErrorState, Module } from "@/components/portal/Module";
import { PageIntro } from "@/components/portal/PageIntro";
import { ProfileIdentity } from "@/components/portal/ProfileIdentity";
import { readSession } from "@/lib/auth/session";
import { getAccount } from "@/lib/merchant/service";

/**
 * Shared frame for every profile section: identity band and section tabs.
 * Each section below is its own route, so the URL always names what is shown.
 */
export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await readSession();
  if (!session) redirect("/signin");

  const result = await getAccount(session);
  if (!result.ok && result.error === "SESSION_EXPIRED") {
    redirect("/signin?expired=1");
  }

  return (
    <>
      <PageIntro
        title="Merchant profile"
        description="The details I&M Bank holds for your business, and the contact information you can keep up to date."
      />

      {result.ok ? (
        <div className="space-y-5">
          <ProfileIdentity
            account={result.data.account}
            terminalCount={result.data.terminals.length}
          />
          {children}
        </div>
      ) : (
        <Module>
          <ErrorState description={result.error} />
        </Module>
      )}
    </>
  );
}
