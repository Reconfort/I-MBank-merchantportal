import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ContactDetailsForm } from "@/components/portal/ContactDetailsForm";
import { Module, ModuleHeader } from "@/components/portal/Module";
import { readSession } from "@/lib/auth/session";
import { getAccount } from "@/lib/merchant/service";

export const metadata: Metadata = {
  title: "Contact details | I&M Merchant Portal",
  description: "The contact details I&M Bank uses to reach your business.",
};

export default async function ProfileContactPage() {
  const session = await readSession();
  if (!session) redirect("/signin");

  const result = await getAccount(session);
  if (!result.ok) return null;

  const { account } = result.data;

  return (
    <Module className="max-w-2xl">
      <ModuleHeader
        title="Contact"
        description="How I&M Bank reaches your business"
      />
      <ContactDetailsForm
        initial={{
          contactName: account.contactName,
          contactPhone: account.contactPhone,
          contactEmail: account.contactEmail,
        }}
      />
    </Module>
  );
}
