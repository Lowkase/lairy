"use client";

import { toastTokens, zIndex } from "@lairy/tokens";
import { cva } from "class-variance-authority";
import { useEffect, useRef, useSyncExternalStore, type ComponentProps, type ReactNode } from "react";
import { cn } from "../cn";

export type ToastIntent = "success" | "fail" | "info" | "neutral";

/** Never stack past three (Do and don't, pair 5). */
const MAX_STACK = 3;
const DISMISS_AFTER_MS = Number.parseInt(toastTokens.dismissAfter, 10);

export interface ToastAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ToastOptions {
  /** Which kind of message this is (Toast Variants). Defaults to Neutral — most toasts should be (Variants "Neutral"). */
  intent?: ToastIntent;
  /** The outcome in the past tense (Content rule 1): "Workflow approved". */
  title: string;
  /** One clause of consequence (Content rule 3); omit when the title says it all. */
  detail?: string;
  /** One link to somewhere the operator can look — never a decision (Content rule 4). */
  action?: ToastAction;
}

interface ToastItem extends ToastOptions {
  id: number;
  intent: ToastIntent;
  /** How many times this same event has fired (Content rule 5). */
  count: number;
}

const toastVariants = cva(
  "relative flex items-start gap-12 overflow-hidden rounded-ds border bg-bg py-12 pr-44 pl-18 font-body shadow-menu animate-rise-in",
  {
    variants: {
      intent: {
        success: "border-accent-line",
        fail: "border-alarm-line",
        info: "border-accent-2-line",
        neutral: "border-border",
      },
    },
    defaultVariants: { intent: "neutral" },
  },
);

const railVariants = cva("absolute inset-y-0 left-0 border-l-2", {
  variants: {
    intent: {
      success: "border-accent",
      fail: "border-alarm",
      info: "border-accent-2",
      neutral: "border-mute",
    },
  },
});

const dotVariants = cva("mt-6 size-8 shrink-0 rounded-full", {
  variants: {
    intent: {
      success: "bg-accent",
      fail: "bg-alarm",
      info: "bg-accent-2",
      neutral: "bg-mute",
    },
  },
});

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export interface ToastProps extends Omit<ComponentProps<"div">, "title"> {
  intent?: ToastIntent;
  title: ReactNode;
  detail?: ReactNode;
  action?: ToastAction;
  /** A counted repeat (Content rule 5); shown once it passes one. */
  count?: number;
  onDismiss?: () => void;
}

/**
 * The surface itself (anatomy #1-5): a rail, a dot, a title, an optional
 * detail line and a dismiss glyph. Presentational — `Toaster` owns the
 * timers and the stack. Failures are announced assertively, everything
 * else politely (Accessibility "Announced, never focused"), and focus never
 * moves into it.
 */
export function Toast({
  intent = "neutral",
  title,
  detail,
  action,
  count = 1,
  onDismiss,
  className,
  ...props
}: ToastProps) {
  return (
    <div
      data-slot="toast"
      data-intent={intent}
      role={intent === "fail" ? "alert" : "status"}
      className={cn(toastVariants({ intent }), className)}
      style={{ width: toastTokens.width, maxWidth: "100%" }}
      {...props}
    >
      <span data-slot="toast-rail" aria-hidden="true" className={railVariants({ intent })} />
      <span data-slot="toast-dot" aria-hidden="true" className={dotVariants({ intent })} />
      <div className="flex min-w-0 flex-col gap-4">
        <div data-slot="toast-title" className="text-body text-fg">
          {title}
          {count > 1 ? (
            <span data-slot="toast-count" className="ml-8 text-micro text-mute">
              ×{count}
            </span>
          ) : null}
        </div>
        {detail ? (
          <div data-slot="toast-detail" className="text-micro text-mute">
            {detail}
          </div>
        ) : null}
        {action ? <ToastActionLink action={action} /> : null}
      </div>
      <button
        type="button"
        data-slot="toast-dismiss"
        aria-label="Dismiss"
        onClick={onDismiss}
        className={cn(
          "absolute top-6 right-6 flex size-22 items-center justify-center rounded-ds text-body text-mute transition-colors hover:bg-panel hover:text-fg",
          FOCUS_RING,
        )}
      >
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}

function ToastActionLink({ action }: { action: ToastAction }) {
  const className = cn(
    "w-fit rounded-ds text-micro font-semibold uppercase tracking-tight-10 text-accent underline-offset-4 hover:underline",
    FOCUS_RING,
  );
  if (action.href) {
    return (
      <a data-slot="toast-action" href={action.href} onClick={action.onClick} className={className}>
        {action.label}
      </a>
    );
  }
  return (
    <button type="button" data-slot="toast-action" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// The stack: one module-level store, so `toast()` can be called from anywhere
// (an event handler, a mutation callback) with a single `<Toaster />` mounted.

let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit(next: ToastItem[]) {
  items = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => items;

function fire(options: ToastOptions): number {
  const intent = options.intent ?? "neutral";
  const repeat = items.find((t) => t.intent === intent && t.title === options.title);
  if (repeat) {
    emit(items.map((t) => (t === repeat ? { ...t, ...options, intent, count: t.count + 1 } : t)));
    return repeat.id;
  }
  const item: ToastItem = { ...options, intent, id: nextId++, count: 1 };
  emit([...items, item].slice(-MAX_STACK));
  return item.id;
}

type IntentShorthand = (options: Omit<ToastOptions, "intent">) => number;

/**
 * Report that something just happened (CONTEXT.md "Toast"). A repeat of the
 * same intent + title collapses into one counted toast rather than a second
 * one (Content rule 5); the stack never grows past three, dropping the
 * oldest. Returns the toast's id for `dismissToast`. `toast.success(...)`,
 * `.fail`, `.info` and `.neutral` fix the intent.
 */
export const toast: typeof fire & Record<ToastIntent, IntentShorthand> = Object.assign(fire, {
  success: (options) => fire({ ...options, intent: "success" }),
  fail: (options) => fire({ ...options, intent: "fail" }),
  info: (options) => fire({ ...options, intent: "info" }),
  neutral: (options) => fire({ ...options, intent: "neutral" }),
} satisfies Record<ToastIntent, IntentShorthand>);

/** Remove one toast, or the whole stack when no id is given. */
export function dismissToast(id?: number) {
  emit(id === undefined ? [] : items.filter((t) => t.id !== id));
}

/** One toast with its own auto-dismiss timer, paused while the pointer is
 * over it or focus is anywhere inside it (Accessibility "The timer is not
 * the only way"). Failures never start one (Variants "Fail"). The timer
 * restarts when a repeat arrives, since the count is news. */
function TimedToast({ item }: { item: ToastItem }) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const paused = useRef(false);

  const stop = () => clearTimeout(timer.current);
  const start = () => {
    stop();
    if (item.intent === "fail" || paused.current) return;
    timer.current = setTimeout(() => dismissToast(item.id), DISMISS_AFTER_MS);
  };

  useEffect(() => {
    start();
    return stop;
  }, [item.count, item.intent]);

  const pause = () => {
    paused.current = true;
    stop();
  };
  const resume = (event: { currentTarget: Element; relatedTarget: EventTarget | null }) => {
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
    paused.current = false;
    start();
  };

  return (
    <Toast
      intent={item.intent}
      title={item.title}
      detail={item.detail}
      action={item.action}
      count={item.count}
      onDismiss={() => dismissToast(item.id)}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    />
  );
}

/**
 * Mount once near the root. Docks the stack top right under the header on
 * the Toast z-stop (Elevation: the top of the ladder, never a scrim).
 * Escape clears the whole stack (Accessibility "Dismiss is reachable").
 */
export function Toaster({ className }: { className?: string }) {
  const stack = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    if (stack.length === 0) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissToast();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [stack.length]);

  if (stack.length === 0) return null;
  return (
    <section
      data-slot="toaster"
      aria-label="Notifications"
      className={cn("pointer-events-none fixed right-22 flex flex-col gap-8", className)}
      style={{ top: toastTokens.top, zIndex: zIndex.toast }}
    >
      {stack.map((item) => (
        <div key={item.id} className="pointer-events-auto">
          <TimedToast item={item} />
        </div>
      ))}
    </section>
  );
}
