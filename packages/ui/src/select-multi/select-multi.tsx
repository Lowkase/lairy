"use client";

import { cva } from "class-variance-authority";
import { icon, space } from "@lairy/tokens";
import { Popover as PopoverPrimitive } from "radix-ui";
import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "../cn";

/** The 4px field-to-menu gap (anatomy #4: "anchored 4px below it") is
 * already a Space-4 ramp step, so it needs no snap. */
const SIDE_OFFSET = 4;
/** Gap between tokens in the field (Space-8). Read in JS as well as in the
 * class names because the overflow measurement adds it up. */
const TOKEN_GAP = Number.parseFloat(space["8"]);

/**
 * The field is a single fixed-height row (anatomy #1: "never taller than
 * that"). The prototype's 42px has no ramp step, so it snaps to the nearest,
 * Space-44 (`h-44`) — flagged in the entry's extractionNotes. The box is the
 * combobox button itself, absolutely filling a wrapper; the tokens and their
 * remove buttons sit in a sibling layer above it, because a button cannot
 * hold other buttons.
 *
 * Focus uses plain `:focus` for the amber ring, for the same reason
 * select.tsx and text-input.tsx do: the field is a text-field look-alike and
 * the States "Focus" row describes no pointer exemption.
 *
 * The Error state turns only the border (`border-alarm-line`): --alarm text
 * and glyphs on the light theme's --bg measure roughly 1.9:1, under AA, the
 * same gap select.tsx and text-input.tsx route around. The sentence under
 * the field plus `aria-invalid`/`aria-describedby` carry the signal.
 */
const multiField = cva(
  "group absolute inset-0 flex w-full cursor-pointer items-center justify-end rounded-ds border bg-bg px-12 text-left font-body text-body text-mute focus:outline-none focus:border-accent-line focus:ring-2 focus:ring-accent-soft focus:ring-offset-2 focus:ring-offset-bg disabled:cursor-not-allowed disabled:border-border disabled:bg-panel-2 data-[state=open]:border-accent-line",
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

export interface SelectMultiOption {
  /** The option's own value. */
  value: string;
  /** The option's own words, two or three of them (Content rule 4): it is
   * shown twice, once as a menu row and once as a token, and names the
   * token's remove button ("Remove Ingest"). */
  label: string;
  /** Right-aligned in `mute` on the menu row only (Content rule 4) — never
   * on the token. */
  meta?: string;
  disabled?: boolean;
}

export interface SelectMultiProps {
  /** The plural noun the field collects (Content rule 1): Stages, Owners,
   * Regions. Always present, never replaced by the placeholder. */
  label: ReactNode;
  options: SelectMultiOption[];
  /** A plural instruction (Content rule 2): "Select stages". */
  placeholder?: string;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** A required field submitted with an empty set (States "Error"): says how
   * many are needed, in words underneath — never the border alone. */
  error?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

function Tick() {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const tokenClass =
  "inline-flex shrink-0 items-center gap-6 whitespace-nowrap rounded-ds border border-accent-line bg-accent-soft py-4 pl-8 pr-6 font-body text-small text-fg";
const removeClass =
  "flex size-16 shrink-0 items-center justify-center rounded-ds text-label text-mute enabled:hover:bg-panel-2 enabled:hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line";
const overflowClass =
  "shrink-0 whitespace-nowrap rounded-ds border border-border-2 bg-panel-2 py-4 px-8 font-body text-small text-dim";

/**
 * A multi-select holds several values in one field, each one a token the
 * operator can take back out. Built on Radix Popover and a hand-rolled
 * listbox (there is no shadcn counterpart): the menu stays open while the set
 * is built, focus is held inside it, Escape closes it and returns focus to
 * the field.
 */
export function SelectMulti({
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
}: SelectMultiProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const labelId = `${fieldId}-label`;
  const listId = `${fieldId}-list`;
  const noteId = `${fieldId}-note`;
  const valueId = `${fieldId}-value`;
  const optionId = (v: string) => `${fieldId}-opt-${v}`;

  const [internal, setInternal] = useState<string[]>(defaultValue ?? []);
  const current = value ?? internal;
  const [open, setOpen] = useState(false);
  const [activeValue, setActiveValue] = useState<string | undefined>();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Option order, not click order: the field reads the same as the menu.
  const chosen = useMemo(() => options.filter((o) => current.includes(o.value)), [options, current]);
  const enabled = useMemo(() => options.filter((o) => !o.disabled), [options]);

  const commit = useCallback(
    (next: string[]) => {
      const ordered = options.filter((o) => next.includes(o.value)).map((o) => o.value);
      if (value === undefined) setInternal(ordered);
      onValueChange?.(ordered);
    },
    [options, value, onValueChange],
  );

  const toggle = (optionValue: string) =>
    commit(current.includes(optionValue) ? current.filter((v) => v !== optionValue) : [...current, optionValue]);

  const selectAll = () => commit([...enabled.map((o) => o.value), ...chosen.filter((o) => o.disabled).map((o) => o.value)]);
  const clear = () => commit(chosen.filter((o) => o.disabled).map((o) => o.value));

  const remove = (optionValue: string) => {
    commit(current.filter((v) => v !== optionValue));
    triggerRef.current?.focus();
  };

  // Overflow (anatomy #3): the field stays one row, so the tokens that no
  // longer fit the measured width collapse into one counted chip. Widths come
  // from an invisible copy of every token, so a hidden token can still be
  // measured when room appears.
  const [fit, setFit] = useState(chosen.length);
  const labelsKey = chosen.map((o) => o.value).join("\u0000");
  useLayoutEffect(() => {
    const track = trackRef.current;
    const measure = measureRef.current;
    if (!track || !measure) return;
    const run = () => {
      const widths = Array.from(measure.querySelectorAll<HTMLElement>("[data-measure-token]")).map((el) => el.offsetWidth);
      const chip = measure.querySelector<HTMLElement>("[data-measure-chip]")?.offsetWidth ?? 0;
      const avail = track.clientWidth;
      // Not laid out (hidden, or no layout engine): nothing to measure against.
      if (avail === 0) return setFit(widths.length);
      const total = widths.reduce((a, b) => a + b, 0) + TOKEN_GAP * Math.max(0, widths.length - 1);
      if (total <= avail) return setFit(widths.length);
      let k = widths.length - 1;
      for (; k > 0; k--) {
        const used = widths.slice(0, k).reduce((a, b) => a + b, 0) + TOKEN_GAP * k + chip;
        if (used <= avail) break;
      }
      setFit(k);
    };
    run();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(run);
    observer.observe(track);
    return () => observer.disconnect();
  }, [labelsKey]);

  const visible = chosen.slice(0, Math.min(fit, chosen.length));
  const hidden = chosen.length - visible.length;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      const start = chosen.find((o) => !o.disabled) ?? enabled[0];
      setActiveValue(start?.value);
    }
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    // A shortcut, never the only way to remove (Accessibility "Tokens are
    // reachable"): every token carries its own button.
    if (event.key === "Backspace" && !disabled && chosen.length > 0) {
      event.preventDefault();
      commit(current.filter((v) => v !== chosen[chosen.length - 1]?.value));
    }
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = enabled.findIndex((o) => o.value === activeValue);
    const move = (to: number) => {
      event.preventDefault();
      const target = enabled[(to + enabled.length) % enabled.length];
      if (target) setActiveValue(target.value);
      if (target) document.getElementById(optionId(target.value))?.scrollIntoView?.({ block: "nearest" });
    };
    switch (event.key) {
      case "ArrowDown":
        return move(index + 1);
      case "ArrowUp":
        return move(index < 0 ? enabled.length - 1 : index - 1);
      case "Home":
        return move(0);
      case "End":
        return move(enabled.length - 1);
      case " ":
      case "Enter":
        event.preventDefault();
        if (activeValue !== undefined) toggle(activeValue);
    }
  };

  const countLabel = `${chosen.length} of ${options.length} selected`;

  return (
    <div data-slot="select-multi" className={cn("flex w-full flex-col gap-6", className)}>
      <label id={labelId} htmlFor={fieldId} data-slot="select-multi-label" className="text-label uppercase text-dim">
        {label}
      </label>
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange} modal>
        <PopoverPrimitive.Anchor asChild>
          <div className="relative h-44 w-full">
            <PopoverPrimitive.Trigger
              ref={triggerRef}
              id={fieldId}
              role="combobox"
              aria-haspopup="listbox"
              aria-controls={open ? listId : undefined}
              aria-required={required || undefined}
              aria-invalid={error != null || undefined}
              aria-describedby={[chosen.length > 0 && valueId, error != null && noteId].filter(Boolean).join(" ") || undefined}
              disabled={disabled}
              data-slot="select-multi-field"
              onKeyDown={onTriggerKeyDown}
              className={multiField({ invalid: error != null })}
            >
              {chosen.length === 0 && placeholder ? (
                <span className="mr-auto truncate text-body text-mute">{placeholder}</span>
              ) : null}
              <span
                data-slot="select-multi-caret"
                aria-hidden
                className="text-micro text-mute transition-transform group-data-[state=open]:rotate-180 group-data-[state=open]:text-accent"
              >
                ▾
              </span>
            </PopoverPrimitive.Trigger>
            <span id={valueId} className="sr-only">
              {chosen.map((o) => o.label).join(", ")}
            </span>
            <div
              aria-disabled={disabled || undefined}
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center gap-8 pl-12 pr-32",
                disabled && "opacity-38",
              )}
            >
              <div ref={trackRef} className="flex min-w-0 flex-1 items-center gap-8 overflow-hidden">
                {visible.map((o) => (
                  <span key={o.value} data-slot="select-multi-token" className={cn(tokenClass, "pointer-events-auto")}>
                    {o.label}
                    {disabled ? null : (
                      <button
                        type="button"
                        aria-label={`Remove ${o.label}`}
                        data-slot="select-multi-token-remove"
                        onClick={() => remove(o.value)}
                        className={removeClass}
                      >
                        ✕
                      </button>
                    )}
                  </span>
                ))}
                {hidden > 0 ? (
                  <span data-slot="select-multi-overflow" className={overflowClass}>
                    {visible.length === 0 ? `${hidden} selected` : `+${hidden} more`}
                  </span>
                ) : null}
              </div>
            </div>
            <div aria-hidden className="pointer-events-none invisible absolute flex gap-8">
              <div ref={measureRef} className="flex gap-8">
                {chosen.map((o) => (
                  <span key={o.value} data-measure-token className={tokenClass}>
                    {o.label}
                    {disabled ? null : <span className={removeClass}>✕</span>}
                  </span>
                ))}
                <span data-measure-chip className={overflowClass}>{`+${chosen.length} more`}</span>
              </div>
            </div>
          </div>
        </PopoverPrimitive.Anchor>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            data-slot="select-multi-menu"
            role="group"
            aria-labelledby={labelId}
            align="start"
            sideOffset={SIDE_OFFSET}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              listRef.current?.focus();
            }}
            style={{
              width: "var(--radix-popover-trigger-width)",
              maxHeight: "var(--radix-popover-content-available-height)",
            }}
            // eslint-disable-next-line lairy/no-removed-focus-outline -- Focus is moved to this non-interactive container; its interactive children carry the focus ring.
            className="z-40 flex flex-col overflow-hidden rounded-ds border border-border-2 bg-bg p-4 shadow-menu outline-none data-[state=open]:animate-panel-in"
          >
            <div
              ref={listRef}
              id={listId}
              role="listbox"
              aria-multiselectable="true"
              aria-labelledby={labelId}
              aria-activedescendant={activeValue !== undefined ? optionId(activeValue) : undefined}
              tabIndex={-1}
              onKeyDown={onListKeyDown}
              // eslint-disable-next-line lairy/no-removed-focus-outline -- Programmatic focus target; the active option (aria-activedescendant) is highlighted instead.
              className="min-h-0 overflow-y-auto outline-none"
            >
              {options.map((option) => {
                const on = current.includes(option.value);
                return (
                  <div
                    key={option.value}
                    id={optionId(option.value)}
                    role="option"
                    aria-selected={on}
                    aria-checked={on}
                    aria-disabled={option.disabled || undefined}
                    data-slot="select-multi-option"
                    data-active={activeValue === option.value || undefined}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseMove={() => !option.disabled && setActiveValue(option.value)}
                    onClick={() => !option.disabled && toggle(option.value)}
                    className={cn(
                      "flex cursor-pointer items-center gap-8 rounded-ds px-8 py-8 text-body text-fg data-[active]:bg-panel-2",
                      option.disabled && "pointer-events-none opacity-38",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-16 shrink-0 items-center justify-center rounded-ds border text-bg",
                        on ? "border-accent bg-accent" : "border-border-2",
                      )}
                    >
                      {on ? <Tick /> : null}
                    </span>
                    <span className="flex-1">{option.label}</span>
                    {option.meta ? (
                      <span className="text-micro uppercase tracking-tight-10 text-mute">{option.meta}</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div
              data-slot="select-multi-footer"
              className="mx-4 mt-4 mb-4 flex items-center justify-between gap-8 border-t border-border pt-8"
            >
              <span role="status" className="text-micro uppercase tracking-tight-10 text-mute">
                {countLabel}
              </span>
              <div className="flex gap-6">
                {(
                  [
                    ["All", selectAll],
                    ["Clear", clear],
                  ] as const
                ).map(([text, run]) => (
                  <button
                    key={text}
                    type="button"
                    onClick={run}
                    className="rounded-ds px-8 py-4 text-micro uppercase tracking-tight-10 text-dim hover:bg-panel-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      {name
        ? current.map((v) => <input key={v} type="hidden" name={name} value={v} disabled={disabled} />)
        : null}
      {error != null ? (
        <span id={noteId} data-slot="select-multi-error" className="text-micro text-fg">
          {error}
        </span>
      ) : null}
    </div>
  );
}
