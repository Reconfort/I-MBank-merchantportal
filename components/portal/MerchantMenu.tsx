"use client";

import Link from "next/link";

import { signOut } from "@/app/(portal)/actions";
import {
  BankIcon,
  BuildingIcon,
  ChevronDownIcon,
  InfoIcon,
  LogoutIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { initials } from "@/lib/merchant/format";

import { useDismissable } from "./useDismissable";

/** Each entry is a distinct route — no two items open the same screen. */
const MENU_LINKS = [
  { href: "/profile", label: "Account information", icon: BuildingIcon },
  { href: "/profile/contact", label: "Contact details", icon: UserIcon },
  { href: "/profile/settlement", label: "Settlement", icon: BankIcon },
  { href: "/profile/security", label: "Access & security", icon: ShieldCheckIcon },
  { href: "/help", label: "Help & support", icon: InfoIcon },
];

export function MerchantMenu({
  merchantName,
  merchantId,
}: {
  merchantName: string;
  merchantId: string;
}) {
  const { open, setOpen, close, triggerRef, panelRef } = useDismissable<
    HTMLButtonElement,
    HTMLDivElement
  >();

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "flex h-12 items-center gap-2.5 rounded-full border border-[#e4e9f2] bg-white/95 pl-1.5 pr-2.5 text-left shadow-[0_10px_30px_-20px_rgb(4_19_51/0.5)] backdrop-blur transition-colors hover:border-brand-blue/30 sm:pr-3.5",
          open && "border-brand-blue/40",
        )}
      >
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-identity-gradient text-[13px] font-bold text-white"
        >
          {initials(merchantName)}
        </span>
        <span className="hidden min-w-0 leading-tight sm:block">
          <span className="block max-w-[168px] truncate text-[13px] font-bold text-ink">
            {merchantName}
          </span>
          <span className="block text-[11px] font-medium text-muted">
            {merchantId}
          </span>
        </span>
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 text-muted transition-transform duration-200",
            open && "rotate-180",
          )}
        />
        <span className="sr-only">Merchant account menu</span>
      </button>

      <div
        ref={panelRef}
        role="menu"
        aria-label="Merchant account"
        className={cn(
          "absolute right-0 top-[calc(100%+10px)] z-50 w-72 origin-top-right rounded-2xl border border-[#e4e9f2] bg-white p-2 shadow-[0_30px_60px_-25px_rgb(4_19_51/0.45)] transition-[opacity,transform,visibility] duration-200 ease-out-quint",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0",
        )}
      >
        <div className="rounded-xl bg-surface px-3 py-3">
          <p className="truncate text-sm font-bold text-ink">{merchantName}</p>
          <p className="mt-0.5 text-[12px] font-medium text-muted">
            Merchant ID {merchantId}
          </p>
        </div>

        <ul className="mt-1.5">
          {MENU_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                role="menuitem"
                tabIndex={open ? undefined : -1}
                onClick={() => close()}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-body transition-colors hover:bg-brand-mist hover:text-brand-blue"
              >
                <item.icon className="size-[18px] text-muted" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <form action={signOut} className="mt-1.5 border-t border-line pt-1.5">
          <button
            type="submit"
            role="menuitem"
            tabIndex={open ? undefined : -1}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-danger transition-colors hover:bg-danger-soft"
          >
            <LogoutIcon className="size-[18px]" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
