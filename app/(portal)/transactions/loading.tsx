export default function TransactionsLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading transactions…</span>
      <div className="pb-6">
        <div className="h-9 w-56 animate-pulse rounded-full bg-white/70" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded-full bg-white/60" />
      </div>
      <div className="h-20 animate-pulse rounded-2xl border border-[#e4e9f2] bg-white/70" />
      <div className="mt-5 space-y-px overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white/70">
        <div className="h-16 animate-pulse bg-white/60" />
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-14 animate-pulse bg-white/40" />
        ))}
      </div>
    </div>
  );
}
