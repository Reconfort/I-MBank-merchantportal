function Block({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-[#e4e9f2] bg-white/70 ${className ?? ""}`}
    />
  );
}

export default function ProfileLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading your merchant profile…</span>
      <div className="pb-6">
        <div className="h-9 w-64 animate-pulse rounded-full bg-white/70" />
        <div className="mt-3 h-4 w-80 animate-pulse rounded-full bg-white/60" />
      </div>
      <Block className="h-52 rounded-3xl" />
      <Block className="mt-5 h-[420px]" />
    </div>
  );
}
