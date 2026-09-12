# I&M Bank Merchant Services — Rwanda

Public merchant site, sign-in, and the authenticated merchant back office for
I&M Bank Rwanda, built to match the visual language of
[imbankgroup.com/rw](https://www.imbankgroup.com/rw/).

| Route           | Auth | Purpose                                                            |
| --------------- | ---- | ------------------------------------------------------------------ |
| `/`             | —    | Landing page: hero, about & benefits, how it works, trust CTA      |
| `/signin`       | —    | Merchant sign-in (UI complete, authentication API pluggable)       |
| `/dashboard`    | ✓    | Activity overview: period switcher, KPIs, activity chart, health   |
| `/transactions` | ✓    | Full transaction audit: search, filters, pagination, detail drawer |
| `/profile`      | ✓    | Merchant record. Sections are sub-routes: `/contact`, `/settlement`, `/security`, `/terminals` |
| `/help`         | ✓    | Merchant support, FAQs and verified I&M Bank contact details       |

## Scope of the back office

The merchant portal is a **reporting and monitoring service**. It deliberately
has no ability to move money: there is no pay, transfer, send, withdraw, refund,
reverse, retry or settlement action anywhere in the UI or in the data layer.
Merchants can read their own activity and update the contact details the bank
holds for them — nothing else.

The frontend is **not** the authorization boundary. Every server request carries
the session token and the backend must scope each response to the authenticated
merchant. No merchant identifier, transaction id, URL parameter or client-side
value is ever trusted to decide what data is returned.

Sensitive values are never rendered: no passwords, PINs, full account numbers,
authentication tokens, API secrets or full card credentials. Settlement accounts
are displayed masked.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 ·
Lato via `next/font`. No additional runtime dependencies.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Environment variables

| Variable                  | Required | Description                                                                  |
| ------------------------- | -------- | ---------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`    | Prod     | Public origin, used for canonical URLs, Open Graph, sitemap and robots.      |
| `MERCHANT_AUTH_API_URL`   | Prod     | Server-side endpoint that verifies merchant credentials.                     |
| `MERCHANT_API_URL`        | Prod     | Server-side merchant reporting API (dashboard, transactions, account).       |

## Merchant authentication

There is **no mock authentication**. The form validates input, then calls the
`signIn` Server Action (`app/signin/actions.ts`), which re-validates and
delegates to `authenticateMerchant` in `lib/auth/merchant-auth.ts` — the single
integration point for the real API.

- Without `MERCHANT_AUTH_API_URL`, any form-valid Merchant ID and password
  opens a preview session with sample data. The Sign In button stays disabled
  until both fields pass presence and length checks.
- With it set, the credentials are POSTed as JSON
  (`{ merchantId, password, rememberMe }`) and HTTP statuses are mapped to
  user-facing messages (401 → incorrect details, 423 → locked, 429 → too many
  attempts, other → unavailable).

On success, `lib/auth/session.ts` writes an httpOnly, SameSite=Lax, Secure (in
production) cookie holding the merchant id, business name, API token and expiry.
`app/(portal)/layout.tsx` reads it on every portal request and redirects to
`/signin` when it is missing or expired; a `401`/`403` from the merchant API
redirects to `/signin?expired=1`, which shows the session-expired notice.

## Merchant data

`lib/merchant/service.ts` is the single data access point. It resolves to one of
three states per request:

| State         | When                            | Behaviour                                                  |
| ------------- | ------------------------------- | ---------------------------------------------------------- |
| `live`        | `MERCHANT_API_URL` is set       | Fetches with the session token, `cache: no-store`, 15s timeout |
| `preview`     | Preview session, no API         | Serves seeded sample data, labelled in the UI everywhere   |
| `unavailable` | No API and no preview session   | Returns an error state; no data is invented                |

Preview mode exists so the portal can be reviewed before the API is ready. It is
on whenever the authentication API is unset, banners every screen with
“Preview mode — sample data”, and turns off as soon as `MERCHANT_AUTH_API_URL`
is configured.

When wiring the real API, map its payloads onto the types in
`lib/merchant/types.ts` (see the `TODO(integration)` note in `requestApi`); no
component needs to change.

## Project structure

```text
app/
  layout.tsx              Root layout, fonts, global metadata
  page.tsx                Landing page
  signin/page.tsx         Merchant sign-in page (redirects when already signed in)
  signin/actions.ts       Sign-in Server Action
  (portal)/
    layout.tsx            Session guard + portal shell, noindex
    actions.ts            Sign-out Server Action
    dashboard/            Activity overview + loading state
    transactions/         Audit table, filters, pagination, detail drawer
    profile/              layout.tsx (identity band + section tabs) and one
                          route per section: account (index), contact,
                          settlement, security, terminals
    profile/actions.ts    Contact-details Server Action
    help/                 Support, FAQs, verified contact details
  not-found.tsx           Branded 404
  robots.ts, sitemap.ts   SEO routes
  icon.png, apple-icon.png, favicon.ico, globals.css
components/
  layout/                 Navbar (sticky, scroll-spy, mobile menu), Footer
  home/                   Hero, HeroVisual, AboutSection, BenefitCard,
                          ProcessSection, ProcessStep, TrustStrip
  auth/                   SignInForm, SignInAside, PortalPreview
  portal/                 FloatingNav, MerchantMenu, NotificationBell, PortalShell,
                          PageIntro, Module, PeriodSelector, PerformanceCanvas,
                          ActivityChart, TransactionHealth, RecentActivity,
                          TransactionFilters/Table/Drawer, TerminalPanel,
                          ProfileIdentity, ProfileTabs, SecurityPanel,
                          ContactDetailsForm
  ui/                     Button, TextField, SectionHeading, Container, Logo,
                          StatusPill, icons
lib/
  site.ts                 Shared content: navigation, contact, legal, regulatory text
  auth/                   Types, shared validation, session cookie, auth service
  merchant/               Types, formatting, period resolution, sample data,
                          contact validation, server-only data service
public/
  brand/im-bank-logo.png  Official I&M Bank logo (unmodified)
  og-image.png            Open Graph image (1200×630)
```

## Content sources

Contact details (+250 788 162 006, info@imbank.co.rw), legal links and the
regulatory statements are taken verbatim from the official I&M Bank Rwanda
website. Illustrative amounts in the hero and sign-in visuals, and everything
shown in preview mode, are examples only.
