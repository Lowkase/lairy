import type { ReactNode } from "react";

export function DevSection({
  number,
  title,
  meta,
  children,
}: {
  number: string;
  title: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-16">
      <div className="flex items-baseline gap-12 border-b border-border pb-8">
        <span className="text-micro text-faint">{number}</span>
        <h2 className="font-heading font-semibold text-section text-fg">{title}</h2>
        {meta ? <span className="ml-auto text-micro uppercase tracking-tight-6 text-faint">{meta}</span> : null}
      </div>
      <div className="flex flex-col gap-16">{children}</div>
    </section>
  );
}
