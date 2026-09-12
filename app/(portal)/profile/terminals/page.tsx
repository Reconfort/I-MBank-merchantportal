import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { TerminalPanel } from "@/components/portal/TerminalPanel";
import { readSession } from "@/lib/auth/session";
import { getAccount } from "@/lib/merchant/service";

export const metadata: Metadata = {
  title: "Terminals | I&M Merchant Portal",
  description: "Devices assigned to your merchant account.",
};

export default async function ProfileTerminalsPage() {
  const session = await readSession();
  if (!session) redirect("/signin");

  const result = await getAccount(session);
  if (!result.ok) return null;

  return <TerminalPanel terminals={result.data.terminals} />;
}
