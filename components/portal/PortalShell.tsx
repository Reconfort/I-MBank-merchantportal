import type { ReactNode } from "react";

import { legalLinks, regulatory, siteConfig } from "@/lib/site";
import type { Notice } from "@/lib/merchant/types";

import { FloatingNav } from "./FloatingNav";

export function PortalShell({
  merchantName,
  merchantId,
  preview,
  notices,
  children,
}: {
  merchantName: string;
  merchantId: string;
  preview: boolean;
  notices: Notice[];
  children: ReactNode;
}) {
  return (
    <div className="portal-canvas flex min-h-dvh flex-col">
      <FloatingNav
        merchantName={merchantName}
        merchantId={merchantId}
        preview={preview}
        notices={notices}
      />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="border-t border-[#e2e7f1] bg-white/60">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-4 py-6 text-xs leading-relaxed text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {siteConfig.copyrightYear} I&amp;M Bank Rwanda.{" "}
            <span className="hidden sm:inline">{regulatory.regulator}</span>
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm font-bold text-body underline-offset-4 transition-colors hover:text-brand-blue hover:underline"
                >
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href="/help"
                className="rounded-sm font-bold text-body underline-offset-4 transition-colors hover:text-brand-blue hover:underline"
              >
                Support
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
