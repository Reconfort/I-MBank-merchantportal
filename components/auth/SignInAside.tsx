import { ShieldCheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { regulatory } from "@/lib/site";

import { PortalPreview } from "./PortalPreview";

/** Branded side panel shown next to the sign-in form on large screens. */
export function SignInAside({ className }: { className?: string }) {
  return (
    <aside
      aria-label={"About the I&M merchant portal"}
      className={cn(
        "on-dark relative isolate flex-col overflow-hidden bg-brand-blue text-white",
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-y-0 left-[58%] w-[110%] -skew-x-[14deg] bg-[linear-gradient(180deg,#0b4ec2_0%,#0842b0_45%,#0033a1_100%)]" />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-10 px-10 py-10 xl:px-14 xl:py-12">
        <p className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.18em] text-brand-teal-200">
          <span aria-hidden="true" className="h-0.5 w-7 rounded-full bg-brand-teal-200" />
          I&amp;M Merchant Portal
        </p>

        <div>
          <p className="max-w-md text-balance text-[34px] font-bold leading-[1.15] tracking-[-0.01em] xl:text-[40px]">
            Your merchant business, in one place.
          </p>
          <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-white/85">
            Sign in to monitor your merchant activity and keep your business
            moving with confidence.
          </p>
          <PortalPreview className="mt-10 w-full max-w-[440px]" />
        </div>

        <p className="flex max-w-md items-start gap-2.5 text-sm leading-relaxed text-white/80">
          <ShieldCheckIcon className="mt-px size-5 shrink-0 text-brand-teal-200" />
          {regulatory.regulator}
        </p>
      </div>
    </aside>
  );
}
