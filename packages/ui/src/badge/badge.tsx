import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../cn";

export type BadgeTone = "neutral" | "info" | "success" | "fail";

const badgeVariants = cva(
  "inline-flex w-fit items-center rounded-ds border py-4 px-8 font-body text-micro uppercase tracking-tight-12",
  {
    variants: {
      tone: {
        neutral: "border-border text-mute",
        info: "border-accent-2-line text-accent-2",
        success: "border-accent-line text-fg",
        // Label stays --fg rather than --alarm: bare --alarm text (#ff8f6b)
        // fails AA against --bg in the light theme (2.03:1, confirmed by
        // axe), the same documented gap packages/content's alarm.ts
        // --alarm-ink entry and button.tsx's Danger variant already route
        // around. The border alone carries the tone; the word carries the
        // meaning regardless of its own colour (Badge Accessibility "Never
        // colour alone").
        fail: "border-alarm-line text-fg",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps extends ComponentProps<"span">, VariantProps<typeof badgeVariants> {
  /** Which standing condition this badge reports (Badge Variants). */
  tone: BadgeTone;
  /** One or two words stating the state, never an instruction (Badge
   * Content rules 2–3). */
  children: ReactNode;
}

/**
 * A small, square, system-assigned label stating a standing condition on
 * the row, card or title it sits beside (CONTEXT.md). Never focusable,
 * never clickable — the moment it needs either, it is a Chip (Badge Usage).
 */
export function Badge({ tone, children, className, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ tone }), className)} {...props}>
      {children}
    </span>
  );
}
