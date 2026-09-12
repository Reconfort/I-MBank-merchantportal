"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "@/app/(portal)/actions";
import { Logo } from "@/components/ui/Logo";
import { CloseIcon, LogoutIcon, MenuIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { Notice } from "@/lib/merchant/types";

import { MerchantMenu } from "./MerchantMenu";
import { NotificationBell } from "./NotificationBell";
import { useDismissable } from "./useDismissable";

/** Primary destinations. The merchant profile is reached from the identity menu. */
const PORTAL_NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/help", label: "Help" },
];

export function FloatingNav({
  merchantName,
  merchantId,
  preview,
  notices,
}: {
  merchantName: string;
  merchantId: string;
  preview: boolean;
  notices: Notice[];
}) {
  const pathname = usePathname();
  const { open, setOpen, close, triggerRef, panelRef } = useDismissable<
    HTMLButtonElement,
    HTMLDivElement
  >();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-[#eef1f8] via-[#eef1f8]/92 to-transparent pb-5 pt-4 sm:pt-5">
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          aria-label={"I&M Bank Merchant Portal – Dashboard"}
          className="shrink-0 rounded-md"
        >
          <Logo alt="" loading="eager" className="w-[132px] sm:w-[152px]" />
        </Link>

        <nav
          aria-label="Portal"
          className="mx-auto hidden rounded-full border border-[#e4e9f2] bg-white/95 p-1.5 shadow-[0_10px_30px_-20px_rgb(4_19_51/0.5)] backdrop-blur lg:block"
        >
          <ul className="flex items-center gap-1">
            {PORTAL_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center rounded-full px-5 text-[13px] font-bold tracking-[0.02em] transition-colors duration-200",
                      active
                        ? "bg-brand-blue text-white shadow-[0_10px_20px_-12px_rgb(0_51_161/0.8)]"
                        : "text-body hover:bg-brand-mist hover:text-brand-blue",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <NotificationBell notices={notices} preview={preview} />
          <MerchantMenu merchantName={merchantName} merchantId={merchantId} />

          <div className="relative lg:hidden">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "grid size-12 place-items-center rounded-full border border-[#e4e9f2] bg-white/95 text-ink shadow-[0_10px_30px_-20px_rgb(4_19_51/0.5)] backdrop-blur transition-colors hover:border-brand-blue/30 hover:text-brand-blue",
                open && "border-brand-blue/40 text-brand-blue",
              )}
            >
              {open ? (
                <CloseIcon className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </button>

            <div
              ref={panelRef}
              className={cn(
                "absolute right-0 top-[calc(100%+10px)] z-50 w-[min(17rem,calc(100vw-2rem))] origin-top-right rounded-2xl border border-[#e4e9f2] bg-white p-2 shadow-[0_30px_60px_-25px_rgb(4_19_51/0.45)] transition-[opacity,transform,visibility] duration-200 ease-out-quint",
                open
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-1 opacity-0",
              )}
            >
              <nav aria-label="Portal (mobile)">
                <ul>
                  {PORTAL_NAV.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          tabIndex={open ? undefined : -1}
                          onClick={() => close()}
                          className={cn(
                            "flex h-12 items-center rounded-xl px-3 text-sm font-bold transition-colors",
                            active
                              ? "bg-brand-blue text-white"
                              : "text-body hover:bg-brand-mist hover:text-brand-blue",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <form action={signOut} className="mt-1.5 border-t border-line pt-1.5">
                <button
                  type="submit"
                  tabIndex={open ? undefined : -1}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-danger transition-colors hover:bg-danger-soft"
                >
                  <LogoutIcon className="size-[18px]" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
