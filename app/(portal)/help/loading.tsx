function Block({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-[#e4e9f2] bg-white/70 ${className ?? ""}`}
    />
  );
}

export default function HelpLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading help and support…</span>
      <div className="pb-6">
        <div className="h-9 w-56 animate-pulse rounded-full bg-white/70" />
        <div className="mt-3 h-4 w-80 animate-pulse rounded-full bg-white/60" />
      </div>
      <div className="h-64 animate-pulse rounded-3xl bg-brand-blue/15" />
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Block className="h-96 lg:col-span-7" />
        <Block className="h-96 lg:col-span-5" />
      </div>
      <Block className="mt-5 h-64" />
    </div>
  );
}
