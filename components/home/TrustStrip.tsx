import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/icons";

export function TrustStrip() {
  return (
    <section aria-labelledby="trust-heading" className="bg-white py-20 lg:py-24">
      <Container>
        <div className="reveal on-dark relative isolate overflow-hidden rounded-3xl bg-brand-blue px-6 py-12 text-white sm:px-12 lg:px-16 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-[62%] -z-10 w-[80%] -skew-x-[14deg] bg-[linear-gradient(180deg,#0b4ec2,#0033a1)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-[60.6%] -z-10 hidden w-2 -skew-x-[14deg] bg-brand-gradient lg:block"
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="lg:col-span-7">
              <h2
                id="trust-heading"
                className="text-balance text-3xl font-bold leading-tight tracking-[-0.01em] sm:text-4xl"
              >
                Your Business. Your Customers. Your Payments.
              </h2>
              <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-white/85">
                Give your customers a convenient way to pay while giving your
                business the support of a trusted banking partner.
              </p>
            </div>
            <div className="lg:col-span-5 lg:justify-self-end">
              <ButtonLink
                href="/signin"
                variant="inverse"
                size="lg"
                wrap
                className="w-full sm:w-auto"
              >
                Sign In to Merchant Portal
                <ArrowRightIcon className="size-[18px] shrink-0" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
