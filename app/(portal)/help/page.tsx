import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Module, ModuleHeader } from "@/components/portal/Module";
import { PageIntro } from "@/components/portal/PageIntro";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  XCircleIcon,
} from "@/components/ui/icons";
import { readSession } from "@/lib/auth/session";
import { contact, legalLinks, regulatory } from "@/lib/site";

export const metadata: Metadata = {
  title: "Help & support | I&M Merchant Portal",
  description: "Get help with your I&M merchant account and transactions.",
};

const PHONE = contact.phone.display.replace(/ /g, "\u00a0");

const FAQS = [
  {
    question: "What do the transaction statuses mean?",
    answer:
      "Successful — the payment was authorised and completed. Pending — the payment has been received but the outcome has not been confirmed yet. Failed — the payment was not completed. Reversed — a completed payment was subsequently reversed. Statuses update here as the outcome is returned.",
  },
  {
    question: "Why is a transaction still pending?",
    answer:
      "A pending transaction is waiting for confirmation from the customer's bank or the payment network. Its status changes here once that confirmation arrives. If a transaction stays pending longer than you expect, contact I&M Bank with the transaction ID.",
  },
  {
    question: "Can I refund, retry or send a payment from this portal?",
    answer:
      "No. The merchant portal is for monitoring and reporting only. It cannot move money, take payments, issue refunds, reverse a transaction or change settlement. Anything that changes a payment is handled by I&M Bank.",
  },
  {
    question: "When are my collections settled?",
    answer:
      "Your settlement account, currency and settlement frequency are shown on your profile under Settlement. They are set by I&M Bank — contact the bank if they need to change.",
  },
  {
    question: "A transaction is missing from my list",
    answer:
      "Check the period at the top of the page and clear any search or filters on the Transactions page — the list only shows transactions inside the selected period. If it is still missing, contact I&M Bank with the date, time, amount and terminal.",
  },
  {
    question: "How do I change my business details?",
    answer:
      "You can update your contact name, phone and email on your profile. Registered business details, settlement instructions and terminals are maintained by I&M Bank and are marked as such on the profile page.",
  },
  {
    question: "I cannot sign in to the portal",
    answer:
      "Sign-in credentials for the merchant portal are issued and managed by I&M Bank. Contact the bank to have access restored. Never share your password, PIN or one-time code with anyone, including someone claiming to be from the bank.",
  },
] as const;

const CAN_DO = [
  "Review activity for a day, week, month, year or custom period",
  "Search and filter your full transaction history",
  "Open a transaction to see its method, channel, terminal and settlement status",
  "Check your merchant, business and settlement details",
  "See the terminals assigned to your merchant account",
  "Keep your contact name, phone and email up to date",
] as const;

const CANNOT_DO = [
  "Send, transfer or withdraw money",
  "Take or initiate a customer payment",
  "Refund, reverse or retry a transaction",
  "Change settlement instructions or bank details",
  "Issue or change sign-in credentials",
] as const;

const BEFORE_YOU_CALL = [
  "Your Merchant ID",
  "The transaction ID or your own reference",
  "The date and time of the transaction",
  "The amount and payment method",
  "The terminal the payment was taken on, if any",
] as const;

export default async function HelpPage() {
  const session = await readSession();
  if (!session) redirect("/signin");

  return (
    <>
      <PageIntro
        title="Help & support"
        description="Answers to common merchant questions, and how to reach I&M Bank when you need us."
      />

      <div className="space-y-5">
        <section
          aria-labelledby="contact-heading"
          className="on-dark relative isolate overflow-hidden rounded-3xl bg-brand-blue text-white shadow-[0_40px_80px_-50px_rgb(0_51_161/0.9)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[34%] overflow-hidden lg:block"
          >
            <div className="absolute inset-y-0 left-[18%] w-[120%] -skew-x-[14deg] bg-[linear-gradient(180deg,#0b4ec2_0%,#0842b0_45%,#0033a1_100%)]" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-brand-gradient"
          />

          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <h2
              id="contact-heading"
              className="text-[13px] font-bold tracking-[0.01em] text-white/75"
            >
              Contact I&amp;M Bank
            </h2>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/90">
              For anything this portal cannot do — payments, settlement, terminals
              or access — speak to I&amp;M Bank directly.
            </p>

            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              <li className="rounded-2xl bg-white/10 p-4">
                <span className="flex items-center gap-2 text-[12px] font-bold text-white/75">
                  <PhoneIcon aria-hidden="true" className="size-4" />
                  Call
                </span>
                <a
                  href={contact.phone.href}
                  className="mt-2 block text-base font-bold underline-offset-4 hover:underline"
                >
                  {PHONE}
                </a>
              </li>
              <li className="rounded-2xl bg-white/10 p-4">
                <span className="flex items-center gap-2 text-[12px] font-bold text-white/75">
                  <MailIcon aria-hidden="true" className="size-4" />
                  Email
                </span>
                <a
                  href={contact.email.href}
                  className="mt-2 block break-words text-base font-bold underline-offset-4 hover:underline"
                >
                  {contact.email.display}
                </a>
              </li>
              <li className="rounded-2xl bg-white/10 p-4">
                <span className="flex items-center gap-2 text-[12px] font-bold text-white/75">
                  <MapPinIcon aria-hidden="true" className="size-4" />
                  In person
                </span>
                <p className="mt-2 text-base font-bold">{contact.branches}</p>
              </li>
            </ul>

            <a
              href={contact.page}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-teal-200 underline-offset-4 hover:underline"
            >
              All I&amp;M Bank Rwanda contact details
              <ExternalLinkIcon aria-hidden="true" className="size-4" />
            </a>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <Module className="lg:col-span-7" id="faqs">
            <ModuleHeader
              title="Common questions"
              description="Merchant account and transaction support"
            />
            <ul className="divide-y divide-[#f0f3f8]">
              {FAQS.map((faq) => (
                <li key={faq.question}>
                  <details className="group px-5 sm:px-6">
                    <summary className="cursor-pointer list-none py-4 text-sm font-bold text-ink marker:hidden hover:text-brand-blue [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center justify-between gap-4">
                        {faq.question}
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="size-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                        />
                      </span>
                    </summary>
                    <p className="pb-4 pr-8 text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </Module>

          <Module className="flex flex-col lg:col-span-5" id="before-you-contact">
            <ModuleHeader
              title="Before you contact us"
              description="Have these ready so we can help faster"
            />
            <ul className="flex-1 space-y-3 px-5 py-5 sm:px-6">
              {BEFORE_YOU_CALL.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-teal-600"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="border-t border-[#f0f3f8] px-5 py-4 text-[13px] leading-relaxed text-muted sm:px-6">
              You can copy a transaction ID from the{" "}
              <Link
                href="/transactions"
                className="font-bold text-brand-blue underline-offset-2 hover:underline"
              >
                Transactions
              </Link>{" "}
              page — open any transaction to see its full details.
            </p>
          </Module>
        </div>

        <Module id="scope">
          <ModuleHeader
            title="What this portal does"
            description="The merchant portal is a reporting service — it does not execute financial transactions"
          />
          <div className="grid grid-cols-1 gap-x-10 gap-y-6 px-5 py-5 sm:px-6 lg:grid-cols-2">
            <div>
              <h3 className="text-[13px] font-bold text-[#0a6b45]">
                You can
              </h3>
              <ul className="mt-3 space-y-2.5">
                {CAN_DO.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-[#0a8a58]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-muted">
                Not available here
              </h3>
              <ul className="mt-3 space-y-2.5">
                {CANNOT_DO.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                    <XCircleIcon
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-[#6b7793]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Module>

        <Module id="legal" className="px-5 py-5 sm:px-6">
          <h2 className="text-[15px] font-bold tracking-[-0.005em] text-ink">
            Legal
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue underline-offset-2 hover:underline"
                >
                  {link.label}
                  <ExternalLinkIcon aria-hidden="true" className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-3xl text-[13px] leading-relaxed text-muted">
            {regulatory.antiBribery}
          </p>
        </Module>
      </div>
    </>
  );
}
