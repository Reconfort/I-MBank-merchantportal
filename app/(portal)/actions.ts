"use server";

import { redirect } from "next/navigation";

import { clearSession } from "@/lib/auth/session";

/** Ends the merchant session and returns the user to the sign-in screen. */
export async function signOut(): Promise<void> {
  await clearSession();
  redirect("/signin");
}
