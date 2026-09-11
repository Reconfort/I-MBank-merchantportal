import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BankIcon, ShieldCheckIcon, StorefrontIcon } from "@/components/ui/icons";

import { BenefitCard } from "./BenefitCard";

const benefits = [
  {
    title: "Secure Payments",
    description:
      "Give your customers a trusted way to pay while keeping transactions protected.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Business Convenience",
    description:
      "Make everyday payment acceptance easier so you can focus on serving your customers.",
    icon: StorefrontIcon,
  },
  {
    title: "Trusted Banking",
    description: "Operate with the support and reliability of I&M Bank.",
    icon: BankIcon,
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      tabIndex={-1}
      aria-labelledby="about-heading"
      className="bg-white py-24 outline-none lg:py-32"
    >
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <SectionHeading
            id="about-heading"
            eyebrow={"About I&M Merchant Services"}
            title="Built for Businesses That Keep Moving"
            className="reveal lg:col-span-6"
          />
          <p className="reveal text-pretty text-lg leading-relaxed text-muted lg:col-span-6 lg:pb-1.5">
            Your business deserves payment solutions that are simple, reliable
            and built around the way you work. I&amp;M Merchant Services helps
            businesses accept payments securely while giving merchants the
            confidence of working with a trusted banking partner.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6 lg:mt-16">
          {benefits.map((benefit, index) => (
            <li key={benefit.title} className="reveal">
              <BenefitCard
                index={index + 1}
                title={benefit.title}
                description={benefit.description}
                icon={benefit.icon}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
