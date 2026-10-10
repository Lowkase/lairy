"use client";

import { cva } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { useId, useState } from "react";
import { cn } from "../cn";

/**
 * `tone` is computed from `checked`/`disabled` up front, the same single
 * source of truth checkbox.tsx's own `tone` and radio.tsx's own `tone`
 * use — the track's own border/fill and the knob's own fill and position
 * share it rather than drifting apart under separate `peer-checked`
 * selectors. `disabled-on` is its own tone, not `on` plus an overlay: the
 * prototype documents the amber draining out on disabled+on as a real
 * colour change, not just a dimming (switch.ts's own extractionNotes).
 */
const switchTrack = cva(
  "relative inline-flex h-22 w-44 shrink-0 items-center rounded-chip border px-4 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent-soft peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg peer-disabled:opacity-38",
  {
    variants: {
      tone: {
        off: "border-border-2 bg-panel-2",
        on: "border-accent-line bg-accent",
        "disabled-on": "border-border-2 bg-border-2",
      },
    },
    defaultVariants: { tone: "off" },
  },
);

/**
 * Travels `translate-x-18` — the real 18px published in `swAnatomy` #2,
 * which already lands on the Spacing ramp, so the knob's own motion needed
 * no snap. The 18px of room it travels through falls out of the track's own
 * `w-44`/`px-4`/`border` geometry (switch.ts's own extractionNotes), not a
 * second literal here.
 */
const switchKnob = cva("size-16 shrink-0 rounded-full transition-transform duration-180", {
  variants: {
    tone: {
      off: "translate-x-0 bg-dim",
      on: "translate-x-18 bg-bg",
      "disabled-on": "translate-x-18 bg-panel",
    },
  },
  defaultVariants: { tone: "off" },
});

export interface SwitchProps extends Omit<ComponentProps<"input">, "size" | "type" | "id" | "role"> {
  /** A stative phrase naming what is true when the switch is on — "Auto-retry
   * failed runs", never "Turn on auto-retry" (anatomy #3, Content rule 1). */
  label: ReactNode;
  /** The optional --mute sub-line for the consequence (anatomy #5, Content
   * rule 3), present only when the label cannot carry it, or what a locked
   * row says to explain itself (Content rule 4). */
  description?: ReactNode;
  id?: string;
  className?: string;
}

/**
 * Turns one setting on or off, and the change takes effect the moment it
 * moves. It belongs in settings and toolbars, never behind a form's submit.
 */
export function Switch({
  label,
  description,
  id,
  className,
  checked,
  defaultChecked,
  onChange,
  disabled,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(() => defaultChecked ?? false);
  const isChecked = checked !== undefined ? checked : uncontrolledChecked;
  const tone = disabled && isChecked ? "disabled-on" : isChecked ? "on" : "off";

  return (
    <label
      htmlFor={inputId}
      data-slot="switch-row"
      className={cn(
        // eslint-disable-next-line lairy/no-arbitrary-tailwind-value -- Hit-area expansion, offset by matching padding.
        "flex min-h-44 items-center justify-between gap-12 rounded-ds px-12 -mx-12 hover:bg-panel-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <span data-slot="switch-label" className="flex min-w-0 flex-col gap-4">
        <span id={labelId} className="text-body text-fg">
          {label}
        </span>
        {description != null ? (
          <span id={descriptionId} data-slot="switch-description" className="text-small text-mute">
            {description}
          </span>
        ) : null}
      </span>
      <input
        id={inputId}
        data-slot="switch-input"
        type="checkbox"
        role="switch"
        className="peer sr-only"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={description != null ? descriptionId : undefined}
        onChange={(event) => {
          if (checked === undefined) setUncontrolledChecked(event.target.checked);
          onChange?.(event);
        }}
        {...props}
      />
      <span aria-hidden="true" data-slot="switch-track" className={switchTrack({ tone })}>
        <span data-slot="switch-knob" className={switchKnob({ tone })} />
      </span>
    </label>
  );
}
