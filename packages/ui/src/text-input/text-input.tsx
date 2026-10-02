"use client";

import { cva } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { useId, useState } from "react";
import { cn } from "../cn";

/**
 * No `:focus-visible`, unlike button.tsx's and chip.tsx's own focus rings:
 * Text input's own Accessibility "Focus is visible and quiet" says the ring
 * "is present for pointer focus too — there is no focus-visible-only hiding
 * here", so plain `:focus` is the entry's own instruction, not a gap.
 *
 * The error message renders in `text-fg`, not `text-alarm`/bare `#ff8f6b`:
 * --alarm text on the light theme's --bg measures roughly 1.9:1 (the same
 * WCAG relative-luminance math alarm.ts's own --alarm-ink rationale uses for
 * its own 2.03:1 figure) — well under AA, the same class of gap button.tsx's
 * Danger variant and chip.tsx's Active state already route around. The
 * border alone (`border-alarm-line`) carries the colour signal; aria-invalid
 * and aria-describedby carry the semantic one (packages/content/src/entries/
 * components/text-input.ts's own extractionNotes).
 *
 * The hint and counter render in `text-mute`, not `text-faint`: axe measured
 * --faint text at Micro (11px) on the light theme's --bg at 3.69:1 — short
 * of AA's 4.5:1 — the same gap empty-state.ts's and card.ts's own
 * extractionNotes already document for --faint text elsewhere. --mute clears
 * it in both themes. The disabled field's own value keeps --faint (WCAG
 * 1.4.3 doesn't apply to an inactive control's own text), matching the
 * entry's own Disabled state prose exactly.
 */
const textInputField = cva(
  "block w-full rounded-ds border bg-bg py-8 px-12 font-body text-body text-fg placeholder:text-mute focus:outline-none focus:border-accent-line focus:ring-2 focus:ring-accent-soft focus:ring-offset-2 focus:ring-offset-bg disabled:cursor-not-allowed disabled:text-faint disabled:placeholder:text-faint disabled:opacity-55",
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

export interface TextInputProps extends Omit<ComponentProps<"input">, "size" | "type" | "id"> {
  /** The field label — always present, never replaced by the placeholder
   * (Text input anatomy #1, Content rule 1). */
  label: ReactNode;
  /** States the constraint before the operator types (anatomy #3, Content
   * rule 3). Replaced by `error`, never shown alongside it — the two share
   * one slot so the layout never shifts on validation. */
  hint?: ReactNode;
  /** A fact plus a fix, never "Invalid input" (Content rule 4). Set only
   * once the operator has finished, not on every keystroke (Accessibility
   * "Validation waits its turn") — that timing is the caller's. */
  error?: ReactNode;
  /** Shows a count toward `maxLength`, counting up rather than down
   * (anatomy #4). Has no effect without `maxLength` — a real limit, not
   * decoration. */
  showCounter?: boolean;
  id?: string;
  className?: string;
}

/**
 * One line the operator types into, and the box every other field in the
 * system is measured against (Text input description). Select and Textarea
 * both inherit this box's border, radius, padding and height.
 */
export function TextInput({
  label,
  hint,
  error,
  showCounter,
  id,
  className,
  maxLength,
  value,
  defaultValue,
  onChange,
  disabled,
  ...props
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const noteId = `${inputId}-note`;
  const [uncontrolledLength, setUncontrolledLength] = useState(
    () => String(defaultValue ?? "").length,
  );
  const length = value !== undefined ? String(value).length : uncontrolledLength;
  const note = error ?? hint;
  const showNoteRow = note != null || (showCounter && maxLength != null);

  return (
    <div data-slot="text-input" className="flex flex-col gap-6">
      <label htmlFor={inputId} data-slot="text-input-label" className="text-label uppercase text-dim">
        {label}
      </label>
      <input
        id={inputId}
        data-slot="text-input-field"
        type="text"
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        aria-invalid={error != null || undefined}
        aria-describedby={note != null ? noteId : undefined}
        onChange={(event) => {
          if (value === undefined) setUncontrolledLength(event.target.value.length);
          onChange?.(event);
        }}
        className={cn(textInputField({ invalid: error != null }), className)}
        {...props}
      />
      {showNoteRow ? (
        <div data-slot="text-input-note-row" className="flex items-baseline gap-12">
          <span
            id={noteId}
            data-slot="text-input-note"
            className={cn("flex-1 text-micro", error != null ? "text-fg" : "text-mute")}
          >
            {note}
          </span>
          {showCounter && maxLength != null ? (
            <span data-slot="text-input-counter" className="text-micro text-mute">
              {length}/{maxLength}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
