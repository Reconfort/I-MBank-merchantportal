import Link from "next/link";

import { ArrowUpRightIcon, TerminalIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { Terminal } from "@/lib/merchant/types";

import { EmptyState, Module, ModuleHeader } from "./Module";

export function TerminalPanel({
  terminals,
  profileHref,
  className,
}: {
  terminals: Terminal[];
  /** Shown as a header link when the panel appears outside the profile. */
  profileHref?: string;
  className?: string;
}) {
  const active = terminals.filter((terminal) => terminal.status === "active").length;

  return (
    <Module className={cn("flex flex-col", className)} id="terminals">
      <ModuleHeader
        title="Terminals"
        description={
          terminals.length
            ? `${active} of ${terminals.length} device${terminals.length === 1 ? "" : "s"} active`
            : "Devices assigned to your merchant account"
        }
        action={
          profileHref ? (
            <Link
              href={profileHref}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold text-brand-blue transition-colors hover:bg-brand-mist"
            >
              Merchant profile
              <ArrowUpRightIcon className="size-4" />
            </Link>
          ) : undefined
        }
      />
      {terminals.length ? (
        <ul className="grid flex-1 grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6 xl:grid-cols-3">
          {terminals.map((terminal) => (
            <li
              key={terminal.id}
              className="flex items-start gap-4 rounded-2xl border border-[#eef1f7] bg-[#fbfcfe] p-4"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl",
                  terminal.status === "active"
                    ? "bg-brand-mist text-brand-blue"
                    : "bg-[#f2f4f8] text-muted",
                )}
              >
                <TerminalIcon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-sm font-bold text-ink">{terminal.id}</p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-bold",
                      terminal.status === "active"
                        ? "bg-[#e7f6ef] text-[#0a6b45]"
                        : "bg-[#eef1f7] text-[#5a6478]",
                    )}
                  >
                    {terminal.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-muted">
                  {terminal.label} · {terminal.location}
                </p>
                <p className="mt-1 text-[12px] text-muted">
                  {terminal.deviceType}
                </p>
                <p className="mt-2 text-[12px] font-bold text-body">
                  Last activity {terminal.lastActivity}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No terminals assigned"
          description="Terminal and device information appears here once I&M Bank assigns a device to your merchant account."
        />
      )}
    </Module>
  );
}
