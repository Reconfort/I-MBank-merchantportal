import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SecurityPanel } from "@/components/portal/SecurityPanel";
import { readSession } from "@/lib/auth/session";
import { getAccount } from "@/lib/merchant/service";

export const metadata: Metadata = {
  title: "Access & security | I&M Merchant Portal",
  description: "How this merchant account is accessed.",
};

export default async function ProfileSecurityPage() {
  const session = await readSession();
  if (!session) redirect("/signin");

  const result = await getAccount(session);
  if (!result.ok) return null;

  return <SecurityPanel account={result.data.account} />;
}
