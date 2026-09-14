import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LockIcon, ShieldCheckIcon } from "@/components/ui/icons";

import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-[#f7f9fd] text-ink"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_100%_0%,rgb(0_51_161/0.08),transparent_55%),radial-gradient(70%_50%_at_0%_20%,rgb(0_152_167/0.07),transparent_50%)]" />
        <div className="absolute inset-y-0 left-[55%] hidden w-full -skew-x-[14deg] bg-[linear-gradient(180deg,#ffffff_0%,#eef3fb_55%,#e8eef8_100%)] lg:block" />
        <div className="absolute inset-y-0 left-[53.6%] hidden w-2 -skew-x-[14deg] bg-brand-gradient lg:block" />
      </div>

      <Container className="grid grid-cols-1 items-center gap-y-12 pb-20 pt-[calc(var(--header-h)+48px)] sm:pb-24 md:pt-[calc(var(--header-h)+72px)] lg:grid-cols-12 lg:gap-x-10 lg:pb-32 lg:pt-[calc(var(--header-h)+104px)]">
        <div className="lg:col-span-6">
          <p className="animate-fade-up flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.18em] text-brand-teal-700">
            <span aria-hidden="true" className="h-0.5 w-7 rounded-full bg-brand-gradient" />
            I&amp;M Merchant Services
          </p>
          <h1
            id="hero-heading"
            className="animate-fade-up mt-6 max-w-[16ch] text-balance text-[40px] font-bold leading-[1.08] tracking-[-0.015em] text-brand-blue [animation-delay:80ms] sm:text-5xl lg:text-[52px] xl:text-[62px]"
          >
            Power Your Business with Smarter Payments
          </h1>
          <p className="animate-fade-up mt-6 max-w-xl text-pretty text-lg leading-relaxed text-body [animation-delay:160ms] lg:text-xl lg:leading-relaxed">
            Accept payments, serve your customers and manage your merchant
            business with the trusted banking solutions of I&amp;M Bank.
          </p>
          <div className="animate-fade-up mt-10 flex flex-col gap-3 [animation-delay:240ms] sm:flex-row sm:gap-4">
            <ButtonLink href="/signin" size="lg">
              <LockIcon className="size-[18px]" />
              Sign In
            </ButtonLink>
            <ButtonLink href="/#process" variant="secondary" size="lg">
              How It Works
            </ButtonLink>
          </div>
          <p className="animate-fade-up mt-10 flex items-center gap-2.5 text-sm text-muted [animation-delay:320ms]">
            <ShieldCheckIcon className="size-5 shrink-0 text-brand-teal-700" />
            Regulated by the National Bank of Rwanda
          </p>
        </div>

        <div className="lg:col-span-6">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
