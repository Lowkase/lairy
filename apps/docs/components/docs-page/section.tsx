import type { ReactNode } from "react";

export function Section({
  number,
  title,
  meta,
  children,
}: {
  number: string;
  title: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-baseline gap-12 border-b border-border pb-8">
        <span className="text-micro text-faint">{number}</span>
        <span className="font-heading font-semibold text-section text-fg">{title}</span>
        <span className="ml-auto text-micro uppercase tracking-tight-6 text-faint">{meta}</span>
      </div>
      <div className="flex flex-col gap-12">{children}</div>
    </div>
  );
}
