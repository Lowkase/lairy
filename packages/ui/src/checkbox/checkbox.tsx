"use client";

import { cva } from "class-variance-authority";
import { icon } from "@lairy/tokens";
import type { ComponentProps, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "../cn";

/**
 * The box's `tone` is computed in JS from `error`/checked/indeterminate
 * rather than left to `peer-checked`/`peer-indeterminate` CSS: the glyph
 * (below) already has to be computed in JS either way, since `indeterminate`
 * is a DOM-only property with no CSS attribute selector, and a native
 * `:checked` would drift from an uncontrolled field's own first paint. One
 * source of truth for both keeps the box and its glyph from disagreeing.
 * Hover, focus-visible and disabled stay real CSS pseudo-classes via `peer`
 * — none of those need JS to track.
 */
const checkboxBox = cva(
  "flex size-18 shrink-0 items-center justify-center rounded-ds border text-bg transition-colors peer-hover:border-fg peer-focus-visible:border-accent-line peer-focus-visible:ring-2 peer-focus-visible:ring-accent-soft peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg peer-disabled:opacity-38",
  {
    variants: {
      tone: {
        off: "border-border-2 bg-transparent",
        on: "border-accent bg-accent",
        error: "border-alarm-line bg-transparent",
      },
    },
    defaultVariants: { tone: "off" },
  },
);

/** The tick and the indeterminate dash, drawn on one shared 24-grid/12px/
 * stroke-2 glyph scale (packages/content/src/entries/components/checkbox.ts's
 * own extractionNotes) rather than the prototype's own two different glyph
 * sizes. */
function CheckboxGlyph({ indeterminate }: { indeterminate: boolean }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={icon.strokeInline}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {indeterminate ? <path d="M6 12h12" /> : <path d="M20 6 9 17l-5-5" />}
    </svg>
  );
}

export interface CheckboxProps extends Omit<ComponentProps<"input">, "size" | "type" | "id"> {
  /** States what being checked means, not what the click does (anatomy #3,
   * Content rule 3) — "Retry failed steps", never "Click to retry". */
  label: ReactNode;
  /** A --mute line beneath the label, only where the rule needs explaining
   * (Content rule 4) — never a reason to lengthen the label itself. */
  description?: ReactNode;
  /** Set only by the system from a group of children, never something the
   * operator can click into directly (States "Indeterminate"). Applied to
   * the underlying input's own DOM property — there is no HTML attribute
   * for it. */
  indeterminate?: boolean;
  /** A required box left unchecked at submit (States "Error"). The border
   * carries the signal; it never changes the fill. */
  error?: boolean;
  id?: string;
  className?: string;
}

/**
 * An independent yes-or-no the operator sets themselves. Each box stands on
 * its own, so ticking one says nothing about the others, and nothing
 * happens until the form is submitted.
 */
export function Checkbox({
  label,
  description,
  indeterminate = false,
  error,
  id,
  className,
  checked,
  defaultChecked,
  onChange,
  disabled,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledChecked, setUncontrolledChecked] = useState(() => defaultChecked ?? false);
  const isChecked = checked !== undefined ? checked : uncontrolledChecked;

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const isMarked = isChecked || indeterminate;
  const tone = isMarked ? "on" : error ? "error" : "off";

  return (
    <div data-slot="checkbox" className={cn("flex flex-col", className)}>
      <label
        htmlFor={inputId}
        data-slot="checkbox-row"
        className={cn(
          "flex min-h-32 items-center gap-12 rounded-ds py-8 px-12 -my-8 -mx-12",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          data-slot="checkbox-input"
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          aria-invalid={error || undefined}
          // Without this, the wrapping <label> below would fold `description`
          // into the input's own accessible name too — <label>'s accessible
          // name is every descendant text node, and description sits inside
          // it so the row stays one hit target (Accessibility "The row is
          // the target"). `aria-labelledby` names only the label text itself;
          // it doesn't change the row's native click-to-toggle behaviour,
          // which comes from the <label for> pairing, not from ARIA.
          aria-labelledby={labelId}
          aria-describedby={description != null ? descriptionId : undefined}
          onChange={(event) => {
            if (checked === undefined) setUncontrolledChecked(event.target.checked);
            onChange?.(event);
          }}
          {...props}
        />
        <span aria-hidden="true" data-slot="checkbox-box" className={checkboxBox({ tone })}>
          {isMarked ? <CheckboxGlyph indeterminate={indeterminate} /> : null}
        </span>
        <span data-slot="checkbox-label" className="flex min-w-0 flex-col gap-4">
          <span id={labelId} className="text-body text-fg">
            {label}
          </span>
          {description != null ? (
            <span id={descriptionId} data-slot="checkbox-description" className="text-small text-mute">
              {description}
            </span>
          ) : null}
        </span>
      </label>
    </div>
  );
}
