import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { ProcessStep } from "./ProcessStep";

const steps = [
  {
    title: "Get Started",
    description:
      "Connect with I&M Bank and begin your merchant onboarding process.",
  },
  {
    title: "Start Accepting Payments",
    description:
      "Use your approved merchant payment solution to accept payments from customers.",
  },
  {
    title: "Manage Your Business",
    description:
      "Monitor your merchant activity and keep your business moving with confidence.",
  },
];

export function ProcessSection() {
  return (
    <section
      id="process"
      tabIndex={-1}
      aria-labelledby="process-heading"
      className="bg-surface py-24 outline-none lg:py-32"
    >
      <Container>
        <SectionHeading
          id="process-heading"
          eyebrow="Process"
          title="How It Works"
          description={"Getting started as an I&M merchant is simple."}
          align="center"
          className="reveal"
        />

        <ol className="mt-14 grid gap-y-10 md:mt-20 md:grid-cols-3 md:gap-x-8">
          {steps.map((step, index) => (
            <ProcessStep
              key={step.title}
              step={index + 1}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </ol>
      </Container>
    </section>
  );
}
