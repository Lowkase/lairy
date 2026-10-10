"use client";

import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { useId, useState } from "react";
import { cn } from "../cn";

/**
 * Tone is computed from `checked`/`error` the same way checkbox.tsx's own
 * `tone` is — one source of truth for the dial border, shared with the dot's
 * own visibility below.
 */
const radioDial = cva(
  "relative flex size-18 shrink-0 items-center justify-center rounded-full border peer-focus-visible:ring-2 peer-focus-visible:ring-accent-soft peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg peer-disabled:opacity-38",
  {
    variants: {
      tone: {
        off: "border-border-2",
        on: "border-accent",
        error: "border-alarm-line",
      },
    },
    defaultVariants: { tone: "off" },
  },
);

export interface RadioOption {
  /** The option's own value — never a description of the dial (anatomy #4). */
  value: string;
  label: ReactNode;
  /** The optional --mute trade-off line under the option (Content rule 4,
   * anatomy #4) — also where a disabled option says why it is locked
   * (Accessibility "Locked options explain"). */
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioProps {
  /** The question above the group (Content rule 5) — short, no colon, never
   * repeated inside the options. */
  label?: ReactNode;
  name?: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** A required group submitted with nothing chosen (States "Error"). Every
   * dial in the group takes the border; it never changes the fill. */
  error?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * A set of mutually exclusive options, all visible at once, exactly one of
 * them chosen. Options stack one per line — never wrapped — and the group
 * always ships with a default selected, since a radio set is never allowed
 * to be empty.
 */
export function Radio({
  label,
  name,
  options,
  value,
  defaultValue,
  onChange,
  error,
  disabled,
  id,
  className,
}: RadioProps) {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const groupName = name ?? groupId;
  const legendId = `${groupId}-label`;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const selected = value !== undefined ? value : uncontrolledValue;

  return (
    <div data-slot="radio" className={cn("flex flex-col gap-8", className)}>
      {label != null ? (
        <span id={legendId} className="text-small text-dim">
          {label}
        </span>
      ) : null}
      <div
        role="radiogroup"
        aria-labelledby={label != null ? legendId : undefined}
        className="flex flex-col gap-4"
      >
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          const optionLabelId = `${optionId}-label`;
          const optionDescriptionId = `${optionId}-description`;
          const optionDisabled = disabled || option.disabled;
          const checked = selected === option.value;
          const tone = checked ? "on" : error ? "error" : "off";

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              data-slot="radio-row"
              className={cn(
                // eslint-disable-next-line lairy/no-arbitrary-tailwind-value -- Hit-area expansion, offset by matching padding.
                "flex items-center gap-12 rounded-ds py-8 px-12 -mx-12",
                optionDisabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-panel-2",
              )}
            >
              <input
                id={optionId}
                data-slot="radio-input"
                type="radio"
                name={groupName}
                value={option.value}
                className="peer sr-only"
                checked={checked}
                disabled={optionDisabled}
                aria-invalid={error || undefined}
                aria-labelledby={optionLabelId}
                aria-describedby={option.description != null ? optionDescriptionId : undefined}
                onChange={() => {
                  if (value === undefined) setUncontrolledValue(option.value);
                  onChange?.(option.value);
                }}
              />
              <span aria-hidden="true" data-slot="radio-dial" className={radioDial({ tone })}>
                <span
                  className={cn(
                    "size-8 rounded-full bg-accent transition-opacity duration-160",
                    checked ? "opacity-100" : "opacity-0",
                  )}
                />
              </span>
              <span data-slot="radio-label" className="flex min-w-0 flex-col gap-4">
                <span id={optionLabelId} className="text-body text-fg">
                  {option.label}
                </span>
                {option.description != null ? (
                  <span id={optionDescriptionId} data-slot="radio-description" className="text-small text-mute">
                    {option.description}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
