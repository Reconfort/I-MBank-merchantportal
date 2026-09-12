/**
 * Site-wide configuration and content that is shared between pages.
 *
 * Contact details, legal links and regulatory statements are taken verbatim
 * from the official I&M Bank Rwanda website (https://www.imbankgroup.com/rw/).
 * Do not add contact details that are not published there.
 */

const FALLBACK_ORIGIN = "http://localhost:3000";

/**
 * Resolves a usable public origin for metadata, sitemap and robots.
 *
 * An empty `NEXT_PUBLIC_SITE_URL` (common when the Vercel import copies
 * `.env.example`) is treated as unset. Hostnames without a protocol are
 * accepted. On Vercel, the platform-provided deployment host is the fallback.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    const origin = normalizeOrigin(candidate);
    if (origin) return origin;
  }

  return FALLBACK_ORIGIN;
}

function normalizeOrigin(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

export const siteConfig = {
  name: "I&M Bank Merchant Services",
  title: "I&M Bank Merchant Services | Rwanda",
  description:
    "Discover I&M Bank merchant payment solutions designed to help businesses accept payments and manage their business with confidence.",
  /** Public origin of the site. Used for canonical URLs, Open Graph and the sitemap. */
  url: resolveSiteUrl(),
  locale: "en_RW",
  ogImage: {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "I&M Bank Merchant Services — Power your business with smarter payments",
  },
  copyrightYear: 2026,
} as const;

export type SectionKey = "top" | "about" | "process";

export type NavItem = {
  label: string;
  href: string;
  section: SectionKey;
};

export const mainNav: readonly NavItem[] = [
  { label: "Home", href: "/", section: "top" },
  { label: "About", href: "/#about", section: "about" },
  { label: "Process", href: "/#process", section: "process" },
];

/** Customer contact channels published on imbankgroup.com/rw. */
export const contact = {
  phone: { display: "+250 788 162 006", href: "tel:+250788162006" },
  email: { display: "info@imbank.co.rw", href: "mailto:info@imbank.co.rw" },
  branches: "Visit any I&M Bank branch",
  page: "https://www.imbankgroup.com/rw/about-us/contact/",
} as const;

/** Official I&M Bank Rwanda legal documents. */
export const legalLinks = [
  {
    label: "Privacy Notice",
    href: "https://www.imbankgroup.com/rw/wp-content/uploads/sites/4/2023/05/Privacy-Notice.pdf",
  },
  {
    label: "Terms & Conditions",
    href: "https://www.imbankgroup.com/rw/terms-and-conditions/",
  },
] as const;

/** Regulatory statements as published in the footer of imbankgroup.com/rw. */
export const regulatory = {
  regulator:
    "I&M Bank (Rwanda) Plc is regulated by the National Bank of Rwanda.",
  antiBribery:
    "I&M Bank (Rwanda) Plc shall not request bribes, kickbacks, or facilitation/speed payments (“corrupt payments”), either directly or via third parties, in any circumstances.",
} as const;
