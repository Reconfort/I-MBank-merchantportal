# I&M Bank Merchant Services — Rwanda

Marketing site and merchant sign-in for I&M Bank Merchant Services, built to
match the visual language of [imbankgroup.com/rw](https://www.imbankgroup.com/rw/).

| Route     | Purpose                                                        |
| --------- | -------------------------------------------------------------- |
| `/`       | Landing page: hero, about & benefits, how it works, trust CTA  |
| `/signin` | Merchant sign-in (UI complete, authentication API pluggable)   |

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

| Variable                | Required | Description                                                                 |
| ----------------------- | -------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | Prod     | Public origin, used for canonical URLs, Open Graph, sitemap and robots.     |
| `MERCHANT_AUTH_API_URL` | Prod     | Server-side endpoint that verifies merchant credentials.                    |

## Merchant authentication

There is **no mock authentication**. The form validates input, then calls the
`signIn` Server Action (`app/signin/actions.ts`), which re-validates and
delegates to `authenticateMerchant` in `lib/auth/merchant-auth.ts` — the single
integration point for the real API.

- Without `MERCHANT_AUTH_API_URL`, sign-in fails safely with a “service
  unavailable” message.
- With it set, the credentials are POSTed as JSON
  (`{ merchantId, password, rememberMe }`) and HTTP statuses are mapped to
  user-facing messages (401 → incorrect details, 423 → locked, 429 → too many
  attempts, other → unavailable).
- Align the request/response contract and session handling (e.g. an httpOnly,
  Secure cookie) with the I&M merchant authentication API when it is available.

## Project structure

```text
app/
  layout.tsx            Root layout, fonts, global metadata
  page.tsx              Landing page
  signin/page.tsx       Merchant sign-in page
  signin/actions.ts     Sign-in Server Action
  not-found.tsx         Branded 404
  robots.ts, sitemap.ts SEO routes
  icon.png, apple-icon.png, favicon.ico, globals.css
components/
  layout/               Navbar (sticky, scroll-spy, mobile menu), Footer
  home/                 Hero, HeroVisual, AboutSection, BenefitCard,
                        ProcessSection, ProcessStep, TrustStrip
  auth/                 SignInForm, SignInAside, PortalPreview
  ui/                   Button, TextField, SectionHeading, Container, Logo, icons
lib/
  site.ts               Shared content: navigation, contact, legal, regulatory text
  auth/                 Types, shared validation, server-only auth service
public/
  brand/im-bank-logo.png  Official I&M Bank logo (unmodified)
  og-image.png            Open Graph image (1200×630)
```

## Content sources

Contact details (+250 788 162 006, info@imbank.co.rw), legal links and the
regulatory statements are taken verbatim from the official I&M Bank Rwanda
website. Illustrative amounts in the hero and sign-in visuals are examples only.
