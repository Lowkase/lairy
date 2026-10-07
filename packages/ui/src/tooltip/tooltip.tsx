"use client";

import { zIndex } from "@lairy/tokens";
import type { KeyboardEvent, ReactElement, ReactNode } from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

/** The top of the z ladder: a tooltip is transient and names a control, so it
 * has to stay legible over the Modal or Drawer that holds that control. There
 * is no tooltip stop of its own on the ladder (Elevation "z"). */
const BUBBLE_Z = { zIndex: zIndex.toast };

/** Flips to the opposite side when the preferred one is clipped against the
 * viewport (Tooltip Rules "Flips when clipped") — never shifted, so the
 * offset to the trigger never stretches. */
function resolveSide(side: TooltipSide, triggerRect: DOMRect, bubbleRect: DOMRect): TooltipSide {
  switch (side) {
    case "top":
      return triggerRect.top - bubbleRect.height - EDGE_GAP < 0 ? "bottom" : "top";
    case "bottom":
      return triggerRect.bottom + bubbleRect.height + EDGE_GAP > window.innerHeight
        ? "top"
        : "bottom";
    case "left":
      return triggerRect.left - bubbleRect.width - EDGE_GAP < 0 ? "right" : "left";
    case "right":
      return triggerRect.right + bubbleRect.width + EDGE_GAP > window.innerWidth ? "left" : "right";
  }
}

/** Viewport coordinates for the bubble on `side` of the trigger, centred on
 * the cross axis. The bubble is `fixed`, so these are what
 * `getBoundingClientRect` reports, with no scroll offset to add. */
function coordsFor(side: TooltipSide, trigger: DOMRect, bubble: DOMRect) {
  const centreX = trigger.left + trigger.width / 2 - bubble.width / 2;
  const centreY = trigger.top + trigger.height / 2 - bubble.height / 2;
  switch (side) {
    case "top":
      return { top: trigger.top - bubble.height - EDGE_GAP, left: centreX };
    case "bottom":
      return { top: trigger.bottom + EDGE_GAP, left: centreX };
    case "left":
      return { top: centreY, left: trigger.left - bubble.width - EDGE_GAP };
    case "right":
      return { top: centreY, left: trigger.right + EDGE_GAP };
  }
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
  children: ReactElement;
  id?: string;
  className?: string;
  /** Renders the trigger with no bubble and no `aria-describedby`, but keeps
   * the same element tree, so a control that only sometimes needs naming
   * (an icon that gains a visible label when there is room) isn't remounted
   * — and doesn't lose focus — when the flag flips. */
  disabled?: boolean;
}

/**
 * Names the thing under the pointer, in one line, and holds nothing the
 * operator has to reach (Tooltip description). It takes no pointer events
 * and carries no interactive content by construction, so Escape dismisses
 * it without moving focus anywhere — focus was never off the trigger to
 * begin with (Accessibility "Keyboard shows it too", "Nothing to chase").
 */
export function Tooltip({
  content,
  side = "top",
  children,
  id,
  className,
  disabled = false,
}: TooltipProps) {
  const generatedId = useId();
  const tooltipId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  // The bubble renders in a portal on `document.body`, so no ancestor's
  // `overflow` can clip it (a collapsed MainRail's labels sit outside the
  // rail). `document` doesn't exist on the server, so it mounts after hydration.
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => setMounted(true), []);

  // Disabling mid-hover must not leave a stale bubble to reappear on re-enable.
  useEffect(() => {
    if (disabled) hide();
  }, [disabled]);

  useLayoutEffect(() => {
    if (!open || !mounted) return;
    function place() {
      const wrapper = wrapperRef.current;
      const bubble = bubbleRef.current;
      if (!wrapper || !bubble) return;
      // Measure the trigger itself: the wrapper can be wider than it (a flex
      // column stretches it to the full row), which would centre the bubble
      // on the row instead of on the control.
      const trigger = wrapper.firstElementChild ?? wrapper;
      const triggerRect = trigger.getBoundingClientRect();
      const bubbleRect = bubble.getBoundingClientRect();
      setPosition(coordsFor(resolveSide(side, triggerRect, bubbleRect), triggerRect, bubbleRect));
    }
    place();
    // Capture, so a scroll in any ancestor container moves the bubble too.
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, mounted, side]);

  // `aria-describedby` goes on the trigger element itself, set through the
  // DOM rather than `cloneElement`: when a Server Component passes a plain
  // element (`<button>`) as `children`, React Flight can hand it over as a
  // `react.lazy` object, which `cloneElement` can't clone — it produced an
  // "Element type is invalid" crash on the client (#116). So the trigger is
  // never cloned; the wrapper takes the pointer, focus and key handlers
  // (React's focus events bubble) and the trigger is the wrapper's first child.
  useLayoutEffect(() => {
    if (disabled) return;
    const trigger = wrapperRef.current?.firstElementChild;
    if (!trigger) return;
    const previous = trigger.getAttribute("aria-describedby");
    trigger.setAttribute("aria-describedby", tooltipId);
    return () => {
      if (previous === null) trigger.removeAttribute("aria-describedby");
      else trigger.setAttribute("aria-describedby", previous);
    };
  }, [disabled, tooltipId]);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      hide();
    }
  }

  const bubble = (
    <span
      ref={bubbleRef}
      id={tooltipId}
      role="tooltip"
      data-slot="tooltip"
      style={{ ...BUBBLE_Z, top: position.top, left: position.left }}
      className={cn(
        "pointer-events-none fixed whitespace-nowrap rounded-ds border border-accent-line bg-bg px-8 py-6 text-label text-fg opacity-0 shadow-bubble transition-opacity duration-160",
        open && "opacity-100",
      )}
    >
      {content}
    </span>
  );

  return (
    <span
      ref={wrapperRef}
      className={cn("inline-flex", className)}
      onMouseEnter={disabled ? undefined : () => show(SHOW_DELAY)}
      onMouseLeave={disabled ? undefined : hide}
      onFocus={disabled ? undefined : () => show(0)}
      onBlur={disabled ? undefined : hide}
      onKeyDown={disabled ? undefined : onKeyDown}
    >
      {children}
      {mounted && !disabled ? createPortal(bubble, document.body) : null}
    </span>
  );
}
