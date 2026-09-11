import type { ComponentType, SVGProps } from "react";

type BenefitCardProps = {
  index: number;
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export function BenefitCard({
  index,
  title,
  description,
  icon: Icon,
}: BenefitCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-7 transition-[border-color,box-shadow,transform] duration-300 ease-out-quint hover:-translate-y-1 hover:border-transparent hover:shadow-card-hover lg:p-8">
      <div className="flex items-start justify-between">
        <span className="grid size-14 place-items-center rounded-[18px] bg-brand-gradient text-white shadow-[0_14px_24px_-14px_rgb(0_89_177/0.9)]">
          <Icon className="size-7" />
        </span>
        <span
          aria-hidden="true"
          className="text-sm font-bold tracking-[0.14em] text-brand-teal-700"
        >
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-8 text-xl font-bold leading-snug text-ink lg:text-[22px]">
        {title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-brand-gradient transition-transform duration-500 ease-out-quint group-hover:scale-x-100"
      />
    </article>
  );
}
