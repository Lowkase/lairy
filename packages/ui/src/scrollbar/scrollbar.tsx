import type { ComponentProps } from "react";
import { cn } from "../cn";

export type ScrollbarProps = ComponentProps<"div">;

/**
 * The browser's own scroll control, restyled to two greys (CONTEXT.md) —
 * never a custom-built replacement (Scrollbar Accessibility "Native, not
 * custom"). Renders a plain `overflow-auto` container; every behaviour
 * (wheel, trackpad, keyboard, OS gestures) stays exactly what the platform
 * already gives it.
 */
export function Scrollbar({ className, children, ...props }: ScrollbarProps) {
  return (
    <div
      data-slot="scrollbar"
      className={cn(
        "overflow-auto",
        // Firefox: scrollbar-color has no Tailwind utility, so these are
        // arbitrary *properties* referencing real tokens, not arbitrary
        // *values* (AGENTS.md rule 1 bans literals like text-[10.5px], not
        // a var() reference to a token that has no utility of its own).
        "[scrollbar-width:thin] [scrollbar-color:var(--border-2)_transparent]",
        "hover:[scrollbar-color:var(--mute)_transparent]",
        // WebKit/Blink: the lane is Space-12, not the prototype's literal
        // 10px (no exact ramp step — Scrollbar extractionNotes). A 4px
        // transparent inset border on each side (Space-4) carves the
        // thumb down to the spec's own 4px width (12 − 2×4 = 4).
        "[&::-webkit-scrollbar]:w-12 [&::-webkit-scrollbar]:h-12",
        "[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-corner]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:rounded-ds [&::-webkit-scrollbar-thumb]:border-4 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-padding",
        "[&::-webkit-scrollbar-thumb]:bg-border-2 [&::-webkit-scrollbar-thumb:hover]:bg-mute",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
