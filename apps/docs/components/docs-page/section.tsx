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
        {/* text-mute, not text-faint: --faint fails the 4.5:1 AA floor for
            normal-size text in the light theme (3.69:1, measured via axe) —
            --mute clears it in both themes (LDS-014). */}
        <span className="text-micro text-mute">{number}</span>
        <span className="font-heading font-semibold text-section text-fg">{title}</span>
        <span className="ml-auto text-micro uppercase tracking-tight-6 text-mute">{meta}</span>
      </div>
      <div className="flex flex-col gap-12">{children}</div>
    </div>
  );
}
