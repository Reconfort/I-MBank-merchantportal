import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import {
  ExternalLinkIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import {
  contact,
  legalLinks,
  mainNav,
  regulatory,
  siteConfig,
} from "@/lib/site";

const footerNav = [...mainNav, { label: "Sign In", href: "/signin" }];

const linkStyles =
  "rounded-sm text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline";

function FooterColumn({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      id="site-footer"
      className="on-dark relative isolate overflow-hidden bg-brand-blue bg-footer-gradient text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[62%] -z-10 w-[70%] -skew-x-[14deg] bg-white/[0.035]"
      />

      <Container className="grid grid-cols-2 gap-x-6 gap-y-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="col-span-2 lg:col-span-4">
          <Link
            href="/"
            aria-label={"I&M Bank Merchant Services – Home"}
            className="inline-flex rounded-xl bg-white py-2 pl-1.5 shadow-[0_16px_32px_-20px_rgb(0_0_0/0.6)]"
          >
            <Logo alt="" className="w-[210px]" />
          </Link>
          <p className="mt-6 max-w-xs text-base leading-relaxed text-white/85">
            Empowering businesses with trusted financial and payment solutions.
          </p>
        </div>

        <FooterColumn title="Navigation" className="lg:col-span-2">
          <nav aria-label="Footer">
            <ul className="space-y-3.5">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkStyles}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </FooterColumn>

        <FooterColumn title="Contact" className="order-last col-span-2 sm:order-none sm:col-span-1 lg:col-span-3">
          <ul className="space-y-3.5">
            <li>
              <a
                href={contact.phone.href}
                className={cn(linkStyles, "inline-flex items-center gap-3")}
              >
                <PhoneIcon className="size-[18px] shrink-0 text-brand-teal-200" />
                {contact.phone.display}
              </a>
            </li>
            <li>
              <a
                href={contact.email.href}
                className={cn(linkStyles, "inline-flex items-center gap-3")}
              >
                <MailIcon className="size-[18px] shrink-0 text-brand-teal-200" />
                {contact.email.display}
              </a>
            </li>
            <li className="flex items-center gap-3 text-white/85">
              <MapPinIcon className="size-[18px] shrink-0 text-brand-teal-200" />
              {contact.branches}
            </li>
          </ul>
        </FooterColumn>

        <FooterColumn title="Legal" className="lg:col-span-3">
          <ul className="space-y-3.5">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(linkStyles, "inline-flex items-center gap-2")}
                >
                  {link.label}
                  <ExternalLinkIcon className="size-3.5 shrink-0 opacity-80" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </FooterColumn>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-col gap-6 py-8 text-[13px] leading-relaxed text-white/75 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-3xl space-y-1.5">
            <p>{regulatory.regulator}</p>
            <p>{regulatory.antiBribery}</p>
          </div>
          <p className="shrink-0">
            © {siteConfig.copyrightYear} I&amp;M Bank Rwanda. All rights
            reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
