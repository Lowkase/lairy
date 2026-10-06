"use client";

import type { FocusEvent, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from "react";
import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../cn";

export type TooltipSide = "top" | "bottom" | "left" | "right";

/** 400ms in, 0ms out (Tooltip Rules "Delay in, none out") — hovering a
 * toolbar never flashes a run of bubbles, but leaving hides instantly so
 * nothing lingers over work. Keyboard focus shows it with no delay
 * (Accessibility "Keyboard shows it too"), which is why `show` takes the
 * delay as an argument rather than always reading this constant. */
const SHOW_DELAY = 400;

/** The 9px trigger-to-bubble offset (Tooltip anatomy #3), snapped to
 * Space-8 per docs/prd.md §8.3's own default ("9 → 8"). */
const EDGE_GAP = 8;

const SIDE_CLASS: Record<TooltipSide, string> = {
  top: "bottom-full left-1/2 mb-8 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-8 -translate-x-1/2",
  left: "right-full top-1/2 mr-8 -translate-y-1/2",
  right: "left-full top-1/2 ml-8 -translate-y-1/2",
};

/** Flips to the opposite side when the preferred one is clipped against the
 * viewport (Tooltip Rules "Flips when clipped") — never shifted, so the
 * offset to the trigger never stretches. */
function resolveSide(side: TooltipSide, triggerRect: DOMRect, bubbleRect: DOMRect): TooltipSide {
  switch (side) {
    case "top":
      return triggerRect.top - bubbleRect.height - EDGE_GAP < 0 ? "bottom" : "top";
    case "bottom":
      return triggerRect.bottom + bubbleRect.height + EDGE_GAP > window.innerHeight ? "top" : "bottom";
    case "left":
      return triggerRect.left - bubbleRect.width - EDGE_GAP < 0 ? "right" : "left";
    case "right":
      return triggerRect.right + bubbleRect.width + EDGE_GAP > window.innerWidth ? "left" : "right";
  }
}

type TriggerProps = Record<string, unknown>;

function callHandler(handler: unknown, event: unknown) {
  if (typeof handler === "function") (handler as (event: unknown) => void)(event);
}

export interface TooltipProps {
  /** The control's name, one short line, no full stop — append a shortcut
   * after a middot where one exists (Content rules 1-3). */
  content: ReactNode;
  /** Default side, flipped automatically when clipped. Top is the system
   * default (Rules "Top by default") — set only to pre-empt a known tight
   * space. */
  side?: TooltipSide;
  /** The control being named, usually an icon-only button (anatomy #4). It
   * keeps its own focus ring; this only adds the hover/focus handlers and
   * the `aria-describedby` link. */
  children: ReactElement<TriggerProps>;
  id?: string;
  className?: string;
}

/**
 * Names the thing under the pointer, in one line, and holds nothing the
 * operator has to reach (Tooltip description). It takes no pointer events
 * and carries no interactive content by construction, so Escape dismisses
 * it without moving focus anywhere — focus was never off the trigger to
 * begin with (Accessibility "Keyboard shows it too", "Nothing to chase").
 */
export function Tooltip({ content, side = "top", children, id, className }: TooltipProps) {
  const generatedId = useId();
  const tooltipId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const [resolvedSide, setResolvedSide] = useState<TooltipSide>(side);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function clearShowTimer() {
    if (showTimer.current !== undefined) {
      clearTimeout(showTimer.current);
      showTimer.current = undefined;
    }
  }

  function show(delay: number) {
    clearShowTimer();
    if (delay <= 0) {
      setOpen(true);
      return;
    }
    showTimer.current = setTimeout(() => setOpen(true), delay);
  }

  function hide() {
    clearShowTimer();
    setOpen(false);
  }

  useEffect(() => clearShowTimer, []);

  useLayoutEffect(() => {
    if (!open) return;
    const trigger = wrapperRef.current;
    const bubble = bubbleRef.current;
    if (!trigger || !bubble) return;
    setResolvedSide(resolveSide(side, trigger.getBoundingClientRect(), bubble.getBoundingClientRect()));
  }, [open, side]);

  const trigger = cloneElement(children, {
    "aria-describedby": tooltipId,
    onMouseEnter: (event: MouseEvent) => {
      callHandler(children.props.onMouseEnter, event);
      show(SHOW_DELAY);
    },
    onMouseLeave: (event: MouseEvent) => {
      callHandler(children.props.onMouseLeave, event);
      hide();
    },
    onFocus: (event: FocusEvent) => {
      callHandler(children.props.onFocus, event);
      show(0);
    },
    onBlur: (event: FocusEvent) => {
      callHandler(children.props.onBlur, event);
      hide();
    },
    onKeyDown: (event: KeyboardEvent) => {
      callHandler(children.props.onKeyDown, event);
      if (event.key === "Escape" && open) {
        event.stopPropagation();
        hide();
      }
    },
  });

  return (
    <span ref={wrapperRef} className={cn("relative inline-flex", className)}>
      {trigger}
      <span
        ref={bubbleRef}
        id={tooltipId}
        role="tooltip"
        data-slot="tooltip"
        className={cn(
          "pointer-events-none absolute z-20 whitespace-nowrap rounded-ds border border-accent-line bg-bg px-8 py-6 text-label text-fg opacity-0 shadow-bubble transition-opacity duration-160",
          SIDE_CLASS[resolvedSide],
          open && "opacity-100",
        )}
      >
        {content}
      </span>
    </span>
  );
}
