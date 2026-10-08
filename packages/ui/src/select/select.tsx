"use client";

import { cva } from "class-variance-authority";
import { Select as SelectPrimitive } from "radix-ui";
import type { ReactNode } from "react";
import { useId } from "react";
import { cn } from "../cn";

/** The 4px field-to-menu gap (anatomy #4: "anchored 4px below it") is
 * already a Space-4 ramp step, so it needs no snap. */
const SIDE_OFFSET = 4;

/**
 * The field shares Text input's box exactly (anatomy #1): the same
 * `py-8 px-12` padding, 2px corner and `bg-bg` fill, so a form of mixed
 * controls reads as one column of boxes.
 *
 * Focus uses plain `:focus` for the amber ring rather than button.tsx's
 * `:focus-visible`, for the same reason text-input.tsx does — the field
 * is a text-field look-alike, and the States "Focus" row describes the
 * ring as the system focus treatment with no pointer exemption.
 *
 * The Error state turns only the border (`border-alarm-line`), not the
 * caret or the message: --alarm text and glyphs on the light theme's --bg
 * measure roughly 1.9:1, under AA, the same gap text-input.tsx and
 * button.tsx already route around. The words under the field, plus
 * `aria-invalid`/`aria-describedby`, carry the signal — colour is a
 * locator only (States "Error": "colour never carries it alone").
 */
const selectField = cva(
  "group flex w-full cursor-pointer items-center justify-between gap-12 rounded-ds border bg-bg py-8 px-12 text-left font-body text-body text-fg focus:outline-none focus:ring-2 focus:ring-accent-soft focus:ring-offset-2 focus:ring-offset-bg disabled:cursor-not-allowed disabled:border-border disabled:text-faint disabled:opacity-45 data-[placeholder]:text-mute data-[state=open]:border-accent-line enabled:hover:border-fg enabled:hover:bg-panel-2 focus:border-accent-line",
  {
    variants: {
      invalid: {
        true: "border-alarm-line",
        false: "border-border-2",
      },
    },
    defaultVariants: { invalid: false },
  },
);

export interface SelectOption {
  /** The option's own value. Radix reserves the empty string for "no
   * selection", so a real "None"/"Any" answer needs its own non-empty value
   * (Content rule 5). */
  value: string;
  /** The option's own words — it is also what the closed field shows once
   * chosen (anatomy #2), never a count or a summary. */
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  /** The noun the field sets, above the box (Content rule 1) — always
   * present, never replaced by the placeholder. */
  label: ReactNode;
  options: SelectOption[];
  /** An instruction, not a value (Content rule 2): "Choose a stage". */
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** A required field submitted empty (States "Error"): says which field
   * and why, in words underneath — colour never carries it alone. */
  error?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

/**
 * A select collapses one choice out of many into a single field. The
 * closed field always shows the current answer; the menu is a floating
 * listbox matched to the field's width, which commits on the click.
 * Scaffolded from shadcn's `select` (ADR-0004), restyled with Lairy tokens
 * only.
 */
export function Select({
  label,
  options,
  placeholder,
  value,
  defaultValue,
  onValueChange,
  error,
  disabled,
  required,
  name,
  id,
  className,
}: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const noteId = `${fieldId}-note`;

  return (
    <div data-slot="select" className={cn("flex flex-col gap-6", className)}>
      <label htmlFor={fieldId} data-slot="select-label" className="text-label uppercase text-dim">
        {label}
      </label>
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
        name={name}
      >
        <SelectPrimitive.Trigger
          id={fieldId}
          data-slot="select-field"
          aria-invalid={error != null || undefined}
          aria-describedby={error != null ? noteId : undefined}
          className={selectField({ invalid: error != null })}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon
            data-slot="select-caret"
            aria-hidden
            className="text-micro text-mute transition-transform group-hover:text-fg group-data-[state=open]:rotate-180 group-data-[state=open]:text-accent"
          >
            ▾
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            data-slot="select-menu"
            position="popper"
            sideOffset={SIDE_OFFSET}
            style={{
              width: "var(--radix-select-trigger-width)",
              maxHeight: "var(--radix-select-content-available-height)",
            }}
            className="z-40 overflow-hidden rounded-ds border border-border-2 bg-bg p-4 shadow-menu data-[state=open]:animate-panel-in"
          >
            <SelectPrimitive.Viewport>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  data-slot="select-option"
                  className="flex cursor-pointer items-center justify-between gap-12 rounded-ds px-12 py-8 text-body text-fg outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-38 data-[highlighted]:bg-panel-2"
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="text-label text-accent">✓</SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error != null ? (
        <span id={noteId} data-slot="select-error" className="text-micro text-fg">
          {error}
        </span>
      ) : null}
    </div>
  );
}
