import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignInAside } from "@/components/auth/SignInAside";
import { SignInForm } from "@/components/auth/SignInForm";
import { Logo } from "@/components/ui/Logo";
import { AlertCircleIcon, ArrowLeftIcon, InfoIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { isPreviewMode } from "@/lib/auth/preview";
import { readSession } from "@/lib/auth/session";
import { contact, regulatory, siteConfig } from "@/lib/site";

const title = "Merchant Sign In | I&M Bank Rwanda";
const description = "Securely sign in to your I&M Bank merchant account.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/signin" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: "/signin",
    title,
    description,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.ogImage.url],
  },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await readSession();
  if (session) redirect("/dashboard");

  const params = await searchParams;
  const sessionExpired = params.expired === "1";
  const preview = isPreviewMode();

  return (
    <div className="grid min-h-dvh bg-surface lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:grid-cols-2">
      <div className="flex min-h-dvh flex-col lg:col-start-2 lg:row-start-1">
        <div aria-hidden="true" className="h-[3px] bg-brand-gradient lg:hidden" />

        <header className="px-5 py-4 sm:px-8 lg:px-16 lg:py-7 xl:px-20">
          <div className="mx-auto flex w-full max-w-[460px] items-center justify-between gap-4">
          <Link
            href="/"
            aria-label={"I&M Bank Merchant Services – Home"}
            className="rounded-md"
          >
            <Logo
              alt=""
              loading="eager"
              className="-ml-2.5 w-[156px] sm:w-[188px] lg:-ml-3 lg:w-[210px]"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2.5 text-sm font-bold text-brand-blue transition-colors hover:bg-brand-mist active:bg-[#e2eaf8]"
          >
            <ArrowLeftIcon className="size-4" />
            Back to website
          </Link>
          </div>
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="flex flex-1 items-center justify-center px-5 pb-12 pt-2 outline-none sm:px-8 lg:px-16 xl:px-20"
        >
          <div className="mx-auto w-full max-w-[460px]">
            {sessionExpired ? (
              <div
                role="status"
                className="animate-fade-up mb-5 flex gap-3 rounded-xl border border-[#f2d69a] bg-[#fdf6e7] p-4 text-sm leading-relaxed text-[#7a4f04]"
              >
                <AlertCircleIcon className="mt-0.5 size-5 shrink-0" />
                <p>
                  <span className="font-bold">Your session has expired.</span>{" "}
                  Please sign in again to continue.
                </p>
              </div>
            ) : null}

            <div className="animate-fade-up rounded-2xl border border-line bg-white p-6 shadow-card sm:p-10">
              <h1 className="text-[28px] font-bold leading-tight tracking-[-0.01em] text-ink sm:text-[32px]">
                Welcome Back
              </h1>
              <p className="mt-2 text-base text-muted">
                Sign in to access your merchant account.
              </p>

              {preview ? (
                <div className="mt-6 flex gap-3 rounded-xl bg-brand-mist p-4 text-sm leading-relaxed text-body">
                  <InfoIcon className="mt-0.5 size-5 shrink-0 text-brand-blue" />
                  <p>
                    <span className="font-bold">Preview mode.</span> The merchant
                    API is not connected, so any Merchant ID and password opens a
                    portal session with sample data.
                  </p>
                </div>
              ) : null}

              <SignInForm />

              <p className="mt-8 border-t border-line pt-6 text-center text-sm leading-relaxed text-muted">
                Need help? Contact I&amp;M Bank on{" "}
                <a
                  href={contact.phone.href}
                  className="whitespace-nowrap rounded-sm font-bold text-brand-blue underline-offset-4 hover:underline"
                >
                  {contact.phone.display}
                </a>
              </p>
            </div>

            <p className="mt-6 flex items-start justify-center gap-2 text-center text-[13px] leading-relaxed text-muted">
              <ShieldCheckIcon className="mt-px size-4 shrink-0 text-brand-teal-700" />
              For your security, never share your password with anyone.
            </p>
          </div>
        </main>

        <footer className="px-5 pb-6 text-center text-xs leading-relaxed text-muted sm:px-8 lg:px-16 lg:text-left xl:px-20">
          <p className="mx-auto w-full max-w-[460px]">
            © {siteConfig.copyrightYear} I&amp;M Bank Rwanda. All rights
            reserved.
            <span className="lg:hidden"> {regulatory.regulator}</span>
          </p>
        </footer>
      </div>

      <SignInAside className="hidden lg:col-start-1 lg:row-start-1 lg:flex" />
    </div>
  );
}
