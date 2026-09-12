"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

export const PROFILE_TABS = [
  { href: "/profile", label: "Account information" },
  { href: "/profile/contact", label: "Contact" },
  { href: "/profile/settlement", label: "Settlement" },
  { href: "/profile/security", label: "Access & security" },
  { href: "/profile/terminals", label: "Terminals" },
] as const;

/**
 * Section navigation for the merchant profile. Each section is its own route,
 * so the address bar, the back button and the active tab always agree.
 */
export function ProfileTabs() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  // Keep the current section in view when the strip scrolls horizontally,
  // e.g. when a section is opened directly from the merchant menu on a phone.
  useEffect(() => {
    const list = listRef.current;
    const item = activeRef.current;
    if (!list || !item) return;
    list.scrollLeft = Math.max(
      0,
      item.offsetLeft - (list.clientWidth - item.clientWidth) / 2,
    );
  }, [pathname]);

  return (
    <nav aria-label="Profile sections" className="border-t border-[#eef1f7] bg-[#fbfcfe]">
      <ul
        ref={listRef}
        className="flex gap-1 overflow-x-auto px-3 sm:px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PROFILE_TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.href} className="shrink-0">
              <Link
                ref={active ? activeRef : undefined}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-12 items-center whitespace-nowrap px-3 text-[13px] font-bold transition-colors sm:px-4",
                  active
                    ? "text-brand-blue"
                    : "text-muted hover:text-ink",
                )}
              >
                {tab.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-2 bottom-0 h-[3px] rounded-t-full transition-colors sm:inset-x-3",
                    active ? "bg-brand-gradient" : "bg-transparent",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
