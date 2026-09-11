"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import {
  ChevronRightIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { contact, mainNav, type NavItem, type SectionKey } from "@/lib/site";

const SPY_SECTIONS: readonly Exclude<SectionKey, "top">[] = ["about", "process"];

function subscribeToViewport(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

const getIsScrolled = () => window.scrollY > 8;
const getServerIsScrolled = () => false;

/** The section whose top has crossed 40% of the viewport height. */
function getActiveSection(): SectionKey {
  const activationLine = window.innerHeight * 0.4;
  let current: SectionKey = "top";
  for (const id of SPY_SECTIONS) {
    const section = document.getElementById(id);
    if (section && section.getBoundingClientRect().top <= activationLine) {
      current = id;
    }
  }
  return current;
}
const getServerActiveSection = (): SectionKey => "top";

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isScrolled = useSyncExternalStore(
    subscribeToViewport,
    getIsScrolled,
    getServerIsScrolled,
  );
  const activeSection = useSyncExternalStore(
    subscribeToViewport,
    getActiveSection,
    getServerActiveSection,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  const closeMenu = useCallback((restoreFocus = false) => {
    setMenuOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // While the mobile menu is open: lock page scroll, make the page behind it
  // inert, move focus into the menu and close it on Escape or on desktop.
  useEffect(() => {
    if (!menuOpen) return;

    const root = document.documentElement;
    const main = document.getElementById("main-content");
    const footer = document.getElementById("site-footer");
    root.style.overflow = "hidden";
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    // The panel is still `visibility: hidden` until its transition starts.
    const focusTimer = window.setTimeout(
      () => firstMenuLinkRef.current?.focus(),
      50,
    );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu(true);
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpointChange);
    return () => {
      window.clearTimeout(focusTimer);
      root.style.overflow = "";
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpointChange);
    };
  }, [menuOpen, closeMenu]);

  // On the home page, in-page links scroll smoothly and move focus to the
  // target section. Elsewhere, Next.js navigates to "/#section" as usual.
  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    item: NavItem,
  ) => {
    const wasMenuOpen = menuOpen;
    setMenuOpen(false);
    if (!isHome || isModifiedClick(event)) return;

    event.preventDefault();
    const behavior: ScrollBehavior = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
      ? "auto"
      : "smooth";

    const scroll = () => {
      if (item.section === "top") {
        window.scrollTo({ top: 0, behavior });
      } else {
        const target = document.getElementById(item.section);
        target?.scrollIntoView({ behavior, block: "start" });
        target?.focus({ preventScroll: true });
      }
      window.history.replaceState(null, "", item.href);
    };

    // Wait for the menu's scroll lock to be released before scrolling.
    if (wasMenuOpen) {
      requestAnimationFrame(() => requestAnimationFrame(scroll));
    } else {
      scroll();
    }
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300 ease-out",
        isScrolled || menuOpen
          ? "shadow-header"
          : "shadow-[0_1px_0_rgb(4_19_51/0.06)]",
      )}
    >
      <div aria-hidden="true" className="h-[3px] bg-brand-gradient" />

      <Container className="grid h-[calc(var(--header-h)-3px)] grid-cols-[1fr_auto] items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          onClick={(event) => handleNavigate(event, mainNav[0])}
          aria-label={"I&M Bank Merchant Services – Home"}
          className="justify-self-start rounded-md"
        >
          <Logo
            alt=""
            loading="eager"
            className="-ml-[10px] w-[172px] md:-ml-3 md:w-[210px] lg:-ml-[14px] lg:w-[235px]"
          />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-9 lg:gap-12">
            {mainNav.map((item) => {
              const isActive = isHome && activeSection === item.section;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(event) => handleNavigate(event, item)}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "group relative inline-flex h-11 items-center text-[13px] font-bold uppercase tracking-[0.08em] transition-colors duration-200 lg:text-sm",
                      isActive
                        ? "text-brand-blue"
                        : "text-ink hover:text-brand-blue",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 bottom-1 h-0.5 origin-left rounded-full bg-brand-gradient transition-transform duration-300 ease-out-quint",
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden justify-self-end md:block">
          <ButtonLink href="/signin" size="md">
            <LockIcon className="size-4" />
            Sign In
          </ButtonLink>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="-mr-2.5 grid size-12 place-items-center justify-self-end rounded-xl text-ink transition-colors hover:bg-brand-mist active:bg-[#e2eaf8] md:hidden"
        >
          <span aria-hidden="true" className="relative block h-3.5 w-6">
            <span
              className={cn(
                "absolute right-0 h-0.5 rounded-full bg-ink transition-all duration-300 ease-out-quint",
                menuOpen ? "top-1.5 w-6 rotate-45" : "top-0 w-6",
              )}
            />
            <span
              className={cn(
                "absolute right-0 top-1.5 h-0.5 rounded-full bg-brand-teal-600 transition-all duration-300 ease-out-quint",
                menuOpen ? "w-0 opacity-0" : "w-4",
              )}
            />
            <span
              className={cn(
                "absolute right-0 h-0.5 rounded-full bg-ink transition-all duration-300 ease-out-quint",
                menuOpen ? "top-1.5 w-6 -rotate-45" : "top-3 w-5",
              )}
            />
          </span>
        </button>
      </Container>

      {/* Mobile menu */}
      <div
        aria-hidden="true"
        onClick={() => closeMenu()}
        className={cn(
          "fixed inset-x-0 bottom-0 top-[var(--header-h)] bg-brand-navy/40 transition-opacity duration-300 md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        id={menuId}
        className={cn(
          "absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-t border-line bg-white shadow-header transition-[opacity,transform,visibility] duration-300 ease-out-quint md:hidden",
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0",
        )}
      >
        <Container className="pb-8 pt-2">
          <nav aria-label="Mobile">
            <ul className="divide-y divide-line">
              {mainNav.map((item, index) => {
                const isActive = isHome && activeSection === item.section;
                return (
                  <li key={item.href}>
                    <Link
                      ref={index === 0 ? firstMenuLinkRef : undefined}
                      href={item.href}
                      onClick={(event) => handleNavigate(event, item)}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "flex h-16 items-center justify-between text-lg font-bold transition-colors",
                        isActive
                          ? "text-brand-blue"
                          : "text-ink hover:text-brand-blue",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-5 w-0.5 rounded-full",
                            isActive ? "bg-brand-gradient" : "bg-transparent",
                          )}
                        />
                        {item.label}
                      </span>
                      <ChevronRightIcon className="size-5 text-muted" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <ButtonLink
            href="/signin"
            size="lg"
            fullWidth
            className="mt-6"
            onClick={() => setMenuOpen(false)}
          >
            <LockIcon className="size-[18px]" />
            Sign In
          </ButtonLink>

          <div className="mt-6 rounded-2xl bg-surface p-5">
            <p className="text-sm font-bold text-ink">Need help?</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <a
                  href={contact.phone.href}
                  className="inline-flex items-center gap-2.5 font-bold text-brand-blue hover:underline"
                >
                  <PhoneIcon className="size-4 text-brand-teal-700" />
                  {contact.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={contact.email.href}
                  className="inline-flex items-center gap-2.5 font-bold text-brand-blue hover:underline"
                >
                  <MailIcon className="size-4 text-brand-teal-700" />
                  {contact.email.display}
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </div>
    </header>
  );
}
