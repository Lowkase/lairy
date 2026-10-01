import { cva, type VariantProps } from "class-variance-authority";
import { duration, easing } from "@lairy/tokens";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

/**
 * Hover and active states lighten/darken each variant's fill rather than
 * swapping to a dedicated token — no such token exists (AGENTS.md rule 1),
 * so the closest non-arbitrary Tailwind step (brightness-110 / brightness-90)
 * stands in, flagged in packages/content/src/entries/components/button.ts's
 * extractionNotes. The prototype's "drops 1px" active transform isn't
 * ported for the same reason; the inset press shadow alone carries the
 * pressed affordance.
 *
 * Only `box-shadow` transitions (`transition-shadow`, for the hover lift),
 * not `color`/`background-color`: those are theme-swapped custom properties
 * (--accent, --bg, …), and transitioning them meant a theme toggle animated
 * through intermediate colours for 140ms — including, briefly, combinations
 * that fail AA contrast (caught by axe in apps/docs/e2e/button.spec.ts).
 * `brightness-*` filter is unaffected either way and still snaps instantly.
 *
 * Danger's label is `text-fg`, not `text-alarm`: bare --alarm (#ff8f6b) text
 * on the page's --bg fails AA in the light theme (2.03:1 — the same
 * documented gap as --bg-on-alarm, packages/content/src/entries/tokens/alarm.ts's
 * own --alarm-ink rationale). That entry's own guidance for anything not
 * sitting on a solid --alarm fill is --alarm-line/--alarm-soft against the
 * ordinary text ranks, which is what the border and hover wash use here —
 * the destructive signal comes from the border colour and the verb itself
 * ("Delete workspace"), per Buttons Accessibility "Never colour alone".
 */
const buttonVariants = cva(
  "inline-flex min-h-32 items-center gap-8 rounded-ds border py-8 px-16 font-body text-small font-semibold uppercase tracking-tight-6 transition-shadow focus-visible:outline-none focus-visible:border-accent-line focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-bg aria-disabled:cursor-not-allowed aria-disabled:opacity-35",
  {
    variants: {
      variant: {
        primary:
          "border-accent bg-accent text-bg hover:shadow-hover-lift-accent hover:brightness-110 active:brightness-90 active:shadow-press-primary",
        secondary:
          "border-border-2 bg-transparent text-fg hover:bg-panel-2 hover:shadow-hover-lift active:brightness-90 active:shadow-press",
        ghost:
          "border-transparent bg-transparent text-dim hover:border-border-2 hover:shadow-hover-lift active:brightness-90 active:shadow-press",
        danger:
          "border-alarm-line bg-transparent text-fg hover:bg-alarm-soft hover:shadow-hover-lift active:brightness-90 active:shadow-press",
      },
    },
  },
);

export interface ButtonProps
  extends Omit<ComponentProps<"button">, "disabled">,
    VariantProps<typeof buttonVariants> {
  /** Which action this button commits (Buttons Variants). Never two
   * Primary buttons in the same view. */
  variant: ButtonVariant;
  /** Optional leading glyph, 8px from the label (Buttons anatomy #3).
   * Trailing icons are reserved for menus and links. */
  icon?: ReactNode;
  /** The verb label (Buttons Content rule 1). An icon-only button — no
   * label text here — must carry an `aria-label` instead (Buttons
   * Accessibility "Real buttons"). */
  children?: ReactNode;
  /** Stays focusable and in the tab order as `aria-disabled`, never the
   * native `disabled` attribute, so a keyboard operator can still reach it
   * and read why it's unavailable (Buttons Accessibility "Disabled"). */
  disabled?: boolean;
}

/**
 * Commits an action the operator has decided to take (CONTEXT.md). Always a
 * real `<button>`, including Ghost and icon-only controls.
 */
export function Button({
  variant,
  icon,
  disabled,
  className,
  type = "button",
  onClick,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-slot="button"
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={cn(buttonVariants({ variant }), className)}
      style={{ transitionDuration: duration.instant, transitionTimingFunction: easing.standard }}
      {...props}
    >
      {icon ? (
        <span data-slot="button-icon" aria-hidden="true" className="flex shrink-0">
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}
