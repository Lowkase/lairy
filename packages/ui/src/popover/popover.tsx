"use client";

import { cva } from "class-variance-authority";
import { popover as popoverTokens } from "@lairy/tokens";
import { DropdownMenu as DropdownMenuPrimitive, Popover as PopoverPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../cn";

/** The 9px trigger-to-panel offset (anatomy #1-2, Rules "Anchored, not
 * centred") snapped to Space-8 per docs/prd.md §8.3's own default ("9 →
 * 8") — tooltip.tsx's own `EDGE_GAP` already made this exact call for the
 * same 9px prototype value. */
const SIDE_OFFSET = 8;

/**
 * A popover is a small surface anchored to the control that opened it,
 * holding actions or detail that would otherwise clutter the page. This is
 * the Detail kind: a read-only panel of field pairs and at most one way
 * out (`PopoverDetailRow`, `PopoverDetailLink`). For the Menu kind — three
 * to seven actions that close the panel as they fire — use `PopoverMenu`
 * instead; it carries real `role="menu"` semantics `Popover` itself
 * doesn't, and shares none of this component's Radix primitive (ADR-0004:
 * scaffolded from shadcn's `popover`, restyled).
 */
export function Popover(props: ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

/** The control that owns the popover (anatomy #1) — pass `asChild` to use
 * your own trigger element (usually `Button`) rather than Radix's default
 * unstyled `<button>`. */
export function PopoverTrigger(props: ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

export type PopoverContentProps = ComponentProps<typeof PopoverPrimitive.Content>;

/**
 * The panel (anatomy #2): a fixed 210px surface on `bg` with a `border-2`
 * hairline and the system's own Menu shadow — one of the few places in the
 * system allowed elevation, because it genuinely floats above the page.
 * Aligns to the trigger's near edge by default (Rules "Anchored, not
 * centred") rather than Radix's own centred default, and never traps focus
 * or scrolls the page (Accessibility — it is a peripheral surface).
 */
export function PopoverContent({ className, align = "start", sideOffset = SIDE_OFFSET, ...props }: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        style={{ width: popoverTokens.panelWidth }}
        className={cn(
          // eslint-disable-next-line lairy/no-removed-focus-outline -- Focus is moved to this non-interactive container; its interactive children carry the focus ring.
          "z-40 flex flex-col gap-8 rounded-ds border border-border-2 bg-bg p-12 shadow-menu outline-none data-[state=open]:animate-panel-in",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export interface PopoverDetailRowProps {
  /** Field name, shown in uppercase Label — kept short, no paragraph of
   * prose (Content rule 4). */
  label: string;
  value: string;
}

/** One field pair inside a Detail popover (Content rule 4: uppercase
 * Label names in `faint`, values in `fg`, at most six pairs). */
export function PopoverDetailRow({ label, value }: PopoverDetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-12">
      <span className="text-micro uppercase tracking-tight-6 text-faint">{label}</span>
      <span className="text-small text-fg">{value}</span>
    </div>
  );
}

/** The one way out a Detail popover may offer, at most (Content rule 5) —
 * a single amber link at its foot, never a second one. */
export function PopoverDetailLink({ className, ...props }: ComponentProps<"a">) {
  return <a className={cn("border-t border-border pt-8 text-small text-accent", className)} {...props} />;
}

/**
 * The Menu kind of Popover: three to seven actions on one object, each row
 * closing the panel as it fires (Kinds "Menu"). Scaffolded from shadcn's
 * `dropdown-menu` (ADR-0004) for its real `role="menu"`/`"menuitem"`
 * semantics and roving focus — Radix's own `modal` default is overridden
 * to `false` here, since a popover never traps focus or blocks the page
 * behind it (Accessibility "Focus moves and returns"), unlike a dropdown
 * menu's own usual modal behaviour.
 */
export function PopoverMenu(props: Omit<ComponentProps<typeof DropdownMenuPrimitive.Root>, "modal">) {
  return <DropdownMenuPrimitive.Root data-slot="popover-menu" {...props} modal={false} />;
}

/** The control that owns the menu (anatomy #1). Radix sets
 * `aria-haspopup`/`aria-expanded` here automatically (Accessibility "Menu
 * semantics"). Pass `asChild` to use your own trigger element. */
export function PopoverMenuTrigger(props: ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="popover-menu-trigger" {...props} />;
}

export type PopoverMenuContentProps = ComponentProps<typeof DropdownMenuPrimitive.Content>;

/** The panel (anatomy #2), restyled identically to `PopoverContent` —
 * same width, hairline, shadow and entrance, so the two kinds read as one
 * surface. */
export function PopoverMenuContent({
  className,
  align = "start",
  sideOffset = SIDE_OFFSET,
  ...props
}: PopoverMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="popover-menu-content"
        align={align}
        sideOffset={sideOffset}
        style={{ width: popoverTokens.panelWidth }}
        className={cn(
          // eslint-disable-next-line lairy/no-removed-focus-outline -- Focus is moved to this non-interactive container; its interactive children carry the focus ring.
          "z-40 flex flex-col gap-1 rounded-ds border border-border-2 bg-bg p-6 shadow-menu outline-none data-[state=open]:animate-panel-in",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

/**
 * A `destructive` row (anatomy #5) ships as `fg` text with an `alarm-soft`
 * highlight rather than bare `alarm` text: at this row's 14px Body size on
 * the light theme's `bg`, literal #ff8f6b measures under AA's 4.5:1 floor
 * — the same documented gap button.ts's own Danger-label note, table.ts's
 * own destructive-verb note and several other entries already carry for
 * this exact colour pair. The destructive signal is carried by the
 * highlight fill and the row's own verb, never colour alone.
 */
const popoverMenuItem = cva(
  // eslint-disable-next-line lairy/no-removed-focus-outline -- The highlighted state replaces the outline (data-[highlighted]).
  "flex cursor-pointer items-center rounded-ds px-12 py-8 text-small outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-38",
  {
    variants: {
      destructive: {
        false: "text-dim data-[highlighted]:bg-panel-2 data-[highlighted]:text-fg",
        true: "text-fg data-[highlighted]:bg-alarm-soft",
      },
    },
    defaultVariants: { destructive: false },
  },
);

export interface PopoverMenuItemProps extends ComponentProps<typeof DropdownMenuPrimitive.Item> {
  /** Delete and its relatives (anatomy #5) — always last, always below a
   * `PopoverMenuSeparator`. Never colours the row by itself (Accessibility
   * "Never colour alone" carries over from Buttons); name the object in
   * the row's own text so a destructive click is never a surprise. */
  destructive?: boolean;
}

/** One row (anatomy #3): every row performs something and closes the
 * panel, at 14px Body — sentence-case verbs, two words at most (Content
 * rules 1-3). Toggles, filters and multi-selects belong to Chip and
 * Select; nothing here just changes what the popover looks like. */
export function PopoverMenuItem({ className, destructive = false, ...props }: PopoverMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="popover-menu-item"
      data-variant={destructive ? "destructive" : "default"}
      className={cn(popoverMenuItem({ destructive }), className)}
      {...props}
    />
  );
}

/** The divider (anatomy #4): a single `border` hairline with Space-4 of
 * air either side — snapped from the prototype's own 5px, the tighter of
 * Space-4/Space-6, the same tie-break tooltip.tsx's own `EDGE_GAP` note
 * already chose. The only structure a Menu popover gets: no headings, no
 * nested groups, no second divider. */
export function PopoverMenuSeparator({ className, ...props }: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="popover-menu-separator"
      className={cn("my-4 h-px bg-border", className)}
      {...props}
    />
  );
}
