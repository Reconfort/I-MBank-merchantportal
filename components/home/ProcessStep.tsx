type ProcessStepProps = {
  step: number;
  title: string;
  description: string;
  isLast?: boolean;
};

export function ProcessStep({
  step,
  title,
  description,
  isLast = false,
}: ProcessStepProps) {
  const label = String(step).padStart(2, "0");

  return (
    <li className="reveal relative grid grid-cols-[64px_minmax(0,1fr)] gap-x-5 md:flex md:flex-col md:items-center md:text-center">
      {/* Connector to the next step: vertical on mobile, horizontal on desktop. */}
      {!isLast ? (
        <span
          aria-hidden="true"
          className="absolute -bottom-7 left-8 top-[76px] w-0.5 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,var(--color-brand-teal),var(--color-brand-azure))] opacity-50 md:bottom-auto md:left-[calc(50%+48px)] md:top-[31px] md:h-0.5 md:w-[calc(100%-64px)] md:translate-x-0 md:bg-[linear-gradient(90deg,var(--color-brand-teal),var(--color-brand-azure))]"
        />
      ) : null}

      <span
        aria-hidden="true"
        className="relative grid size-16 place-items-center rounded-full bg-brand-blue text-lg font-bold text-white shadow-[0_0_0_8px_rgb(0_51_161/0.08)]"
      >
        {label}
      </span>

      <div className="pt-1 md:mt-8 md:pt-0">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-teal-700">
          Step {label}
        </p>
        <h3 className="mt-2 text-xl font-bold leading-snug text-ink lg:text-[22px]">
          {title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-muted md:mx-auto md:max-w-[300px]">
          {description}
        </p>
      </div>
    </li>
  );
}
