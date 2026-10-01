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
        {/* text-mute, not text-faint: --faint fails the 4.5:1 AA floor for
            normal-size text in the light theme (3.69:1, measured via axe) —
            --mute clears it in both themes (components/docs-page/section.tsx
            made the same fix for the foundation pages' own Section header). */}
        <span className="text-micro text-mute">{number}</span>
        <h2 className="font-heading font-semibold text-section text-fg">{title}</h2>
        {meta ? <span className="ml-auto text-micro uppercase tracking-tight-6 text-mute">{meta}</span> : null}
      </div>
      <div className="flex flex-col gap-16">{children}</div>
    </section>
  );
}
