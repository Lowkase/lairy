"use client";

import { cva } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { useId, useState } from "react";
import { cn } from "../cn";

/**
 * `rows` defaults to 3, not a hard-coded `min-h-*`: the prototype's own
 * "56px minimum height" has no spacing-ramp match (packages/content/src/
 * entries/components/textarea.ts's own extractionNotes), and the native
 * `rows` attribute is the semantically correct way to express "opening at
 * about three lines" without inventing a pixel figure.
 *
 * `lineHeight: 1.55` is an inline style, not a class: ADR-0003 removes
 * Tailwind's entire `--leading-*` scale, and only paired per-type-style
 * line-heights exist (Body's own is 1.6, not 1.55) — the same "read a
 * token-sourced value via inline style when no utility exists" technique
 * button.tsx's own `transitionDuration`/`transitionTimingFunction` already
 * established.
 *
 * The hint/counter render in `text-mute` and the error border/text in
 * `border-alarm-line`/`text-fg`, not `--faint`/`--alarm` — the exact same
 * AA-contrast gaps already fixed in text-input.tsx, carried forward here
 * rather than re-discovered (see this component's content entry).
 */
const textareaField = cva(
  "block w-full resize-y rounded-ds border bg-bg py-8 px-12 font-body text-body text-fg placeholder:text-mute focus:outline-none focus:border-accent-line focus:ring-2 focus:ring-accent-soft focus:ring-offset-2 focus:ring-offset-bg disabled:cursor-not-allowed disabled:resize-none disabled:text-faint disabled:placeholder:text-faint disabled:opacity-55",
  {
    variants: {
      invalid: {
        true: "border-alarm-line",
        false: "border-border",
      },
    },
    defaultVariants: { invalid: false },
  },
);

export interface TextareaProps
  extends Omit<ComponentProps<"textarea">, "size" | "id" | "maxLength"> {
  /** The field label — always present, never replaced by the placeholder
   * (Textarea anatomy #1, Content rule 2). */
  label: ReactNode;
  /** States the constraint before the operator types (anatomy #4). Replaced
   * by `error` or by the auto-generated over-limit message, never shown
   * alongside either — all three share one slot so the layout never
   * shifts. */
  hint?: ReactNode;
  /** A semantic validation failure the caller owns (e.g. required but
   * empty). Overrides the auto-generated over-limit message when both would
   * apply. */
  error?: ReactNode;
  /** The soft character limit the live counter counts against (anatomy #5,
   * Content rule 3) — never the native `maxLength`, which is omitted from
   * this component's props entirely because it blocks typing past the
   * limit with no feedback (Do and don't "Never swallow keystrokes at the
   * limit with no counter"). Typing is always allowed past it; the counter
   * and an auto-generated "N characters — trim M" message turn with it
   * instead once the value runs over (Do and don't "Over the limit, the
   * counter turns with the message"). Shows the counter unconditionally
   * when set — there is no separate `showCounter` prop. */
  limit?: number;
  id?: string;
  className?: string;
  /** Defaults to 3 — "opening at about three lines" (anatomy #2). Native, so
   * any value is honoured; re-declared here (rather than left inherited from
   * `ComponentProps<"textarea">`) so its own default is documented on the
   * entry's Props table. */
  rows?: number;
}

/**
 * The text input grown tall enough to hold a sentence the operator writes
 * in their own words (Textarea description). Border, radius, padding and
 * type are inherited from Text input unchanged.
 */
export function Textarea({
  label,
  hint,
  error,
  limit,
  id,
  className,
  rows = 3,
  value,
  defaultValue,
  onChange,
  disabled,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const noteId = `${fieldId}-note`;
  const [uncontrolledValue, setUncontrolledValue] = useState(() => String(defaultValue ?? ""));
  const currentValue = value !== undefined ? String(value) : uncontrolledValue;
  const length = currentValue.length;
  const over = limit != null && length > limit ? length - limit : 0;
  const overflowMessage = over > 0 ? `${length} characters — trim ${over}` : undefined;
  const effectiveError = error ?? overflowMessage;
  const note = effectiveError ?? hint;
  const showNoteRow = note != null || limit != null;

  return (
    <div data-slot="textarea" className="flex flex-col gap-6">
      <label htmlFor={fieldId} data-slot="textarea-label" className="text-label uppercase text-dim">
        {label}
      </label>
      <textarea
        id={fieldId}
        data-slot="textarea-field"
        rows={rows}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        aria-invalid={effectiveError != null || undefined}
        aria-describedby={note != null ? noteId : undefined}
        onChange={(event) => {
          if (value === undefined) setUncontrolledValue(event.target.value);
          onChange?.(event);
        }}
        className={cn(textareaField({ invalid: effectiveError != null }), className)}
        style={{ lineHeight: 1.55 }}
        {...props}
      />
      {showNoteRow ? (
        <div data-slot="textarea-note-row" className="flex items-baseline gap-12">
          <span
            id={noteId}
            data-slot="textarea-note"
            className={cn("flex-1 text-micro", effectiveError != null ? "text-fg" : "text-mute")}
          >
            {note}
          </span>
          {limit != null ? (
            <span
              aria-live="polite"
              data-slot="textarea-counter"
              className={cn("text-micro", effectiveError != null ? "text-fg" : "text-mute")}
            >
              {length}/{limit}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
