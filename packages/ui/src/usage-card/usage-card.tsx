import type { ReactNode } from "react";
import { cn } from "../cn";

export interface UsageCardProps {
  /**
   * The left card's title. Defaults to "Use when"; may be narrowed to the
   * page's own words, e.g. "Reach for amber when" (Usage card Content rule
   * 1). Never a generic "Do".
   */
  useWhenTitle?: ReactNode;
  /** One row per complete condition recommending this entry (Usage card anatomy #3 "Rows"). */
  useWhen: ReactNode[];
  /**
   * One row per complete condition ruling it out instead, naming the right
   * entry inline. The title above these rows is always the fixed phrase
   * "Use something else when" (Usage card Content rule 2).
   */
  useInstead: ReactNode[];
  className?: string;
}

/**
 * States a rule in two halves — where an entry belongs, and where it
 * doesn't (CONTEXT.md). Documentation furniture, not an operator-facing
 * component: it never appears outside a docs page, and never alone (Usage
 * card Content rule 5).
 */
export function UsageCard({ useWhenTitle = "Use when", useWhen, useInstead, className }: UsageCardProps) {
  return (
    <div data-slot="usage-card" className={cn("grid grid-cols-1 gap-16 tablet:grid-cols-2", className)}>
      <div data-slot="usage-card-recommended" className="border border-accent-line bg-accent-soft p-18">
        {/* --fg, not --accent: --accent on --accent-soft measures 4.06:1 in
            the light theme (axe, apps/docs/e2e/usage-card.spec.ts), short of
            AA's 4.5:1 for normal text — the border and fill alone already
            carry the recommendation signal (Usage card Accessibility
            "Colour never alone"), the same treatment Callout's own title
            gets (callout.tsx). */}
        <div className="mb-12 text-micro uppercase tracking-tight-6 text-fg">{useWhenTitle}</div>
        <div className="flex flex-col gap-8 text-small text-dim">
          {useWhen.map((row, index) => (
            // Rows are prose, not a keyed collection — index keys are safe
            // for a static list that is never reordered at runtime.
            <span key={index}>{row}</span>
          ))}
        </div>
      </div>
      <div data-slot="usage-card-alternative" className="border border-border-2 p-18">
        <div className="mb-12 text-micro uppercase tracking-tight-6 text-mute">Use something else when</div>
        <div className="flex flex-col gap-8 text-small text-dim">
          {useInstead.map((row, index) => (
            <span key={index}>{row}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
