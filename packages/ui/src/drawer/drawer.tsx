"use client";

import { drawer as drawerTokens, zIndex } from "@lairy/tokens";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps, CSSProperties } from "react";
import { Button, type ButtonProps } from "../button/button";
import { cn } from "../cn";

export type DrawerSize = "sm" | "md" | "lg";

/** Drawer anatomy #2's three widths (Sizes section). None lands on the
 * Spacing ramp (4, 6, 8, 12, 16, 18, 22, 32, 44) — the same
 * component-specific exception `--popover-panel-width` and `--modal-width-*`
 * already set, added as `--drawer-width-*` (packages/tokens/tokens/drawer.json). */
const DRAWER_WIDTH: Record<DrawerSize, string> = {
  sm: drawerTokens.widthSm,
  md: drawerTokens.widthMd,
  lg: drawerTokens.widthLg,
};

/** The blocking layer, shared with Modal (Elevation `elevZ`: "Modal and
 * drawer... both live at the same stop because two are never open at
 * once"). No Tailwind `z-80` utility exists (ADR-0003), so this is set as
 * an inline style from the real token, the same escape modal.tsx's own
 * `OVERLAY_Z` already uses. */
const OVERLAY_Z = { zIndex: zIndex.overlay };

/** The scrim (anatomy #1): a dim over the work behind, never a blur strong
 * enough to hide it. The prototype's own `color-mix(in srgb, var(--bg) 45%,
 * transparent)` becomes Tailwind's `bg-bg/45` opacity modifier, which
 * composes the same mix in `oklab` rather than `srgb` — a visually
 * negligible space change, the same technical gap modal.tsx's own
 * `bg-bg/55` scrim already flags. `backdrop-blur-xs` (4px) lands exactly on
 * the prototype's own literal, with no tie-break needed this time (contrast
 * modal.tsx's own scrim, which had to break a tie at 6px). */
const OVERLAY_CLASS = "fixed inset-0 bg-bg/45 backdrop-blur-xs data-[state=open]:animate-fade-in";

function drawerSurfaceStyle(size: DrawerSize): CSSProperties {
  return { ...OVERLAY_Z, width: DRAWER_WIDTH[size], maxWidth: "92vw" };
}

/**
 * A drawer is a full-height panel that slides in from the right and sits
 * beside the work instead of on top of it (purpose). Built on Radix's
 * `dialog` (ADR-0004, the shadcn "sheet" counterpart) rather than a second
 * primitive: a drawer is a dialog restyled to the edge, not a different
 * interaction model — same focus trap, same Escape, same scrim dismissal,
 * just anchored right instead of centred.
 */
export function Drawer(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="drawer" {...props} />;
}

/** The control that opens the drawer. Pass `asChild` to use your own
 * trigger element (usually `Button`) rather than Radix's default unstyled
 * `<button>`. Focus returns here on close, however the drawer was dismissed
 * (Accessibility "Focus in, focus back"). */
export function DrawerTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

export interface DrawerContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  /** One of the Sizes section's three widths — SM for a read-only detail
   * panel, MD (the default) for detail/settings/editing, LG for dense
   * editing that allows two columns. Matches the content entry's variant
   * names (docs/build-guide.md §4 step 4). */
  size?: DrawerSize;
}

/**
 * The scrim and the panel (anatomy #1-2). No `onOpenAutoFocus` override is
 * needed, unlike modal.tsx's own benign `ModalContent`: this entry's own
 * Accessibility ("Focus in, focus back") makes no claim about which
 * specific element receives initial focus, so Radix's own default
 * (focusing the Content element itself) already satisfies it.
 */
export function DrawerContent({ className, size = "md", ...props }: DrawerContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay data-slot="drawer-overlay" className={OVERLAY_CLASS} style={OVERLAY_Z} />
      <DialogPrimitive.Content
        data-slot="drawer-content"
        aria-modal="true"
        className={cn(
          // eslint-disable-next-line lairy/no-removed-focus-outline -- Focus is moved to this non-interactive container; its interactive children carry the focus ring.
          "fixed inset-y-0 right-0 flex flex-col overflow-hidden border-l border-accent bg-bg shadow-overlay-horizontal outline-none data-[state=open]:animate-drawer-in",
          className,
        )}
        style={drawerSurfaceStyle(size)}
        {...props}
      />
    </DialogPrimitive.Portal>
  );
}

/** The header (anatomy #3): pinned, with the record's name and a tracked
 * meta line, and the close glyph in the far corner. */
export function DrawerHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex items-center justify-between gap-10 border-b border-border px-22 py-18", className)}
      {...props}
    />
  );
}

/** The record's name (Content rule 1): "Details", "AUT·02" — never "Edit
 * item details" repeated from the button that opened it. */
export function DrawerTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="drawer-title"
      className={cn("font-heading text-section font-semibold text-fg", className)}
      {...props}
    />
  );
}

/** The tracked meta line under the title (Content rule 2): the identifier
 * and nothing else, so the operator can quote it without opening anything
 * further. */
export function DrawerMeta({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-meta"
      className={cn("mt-2 text-micro tracking-tight-14 text-mute", className)}
      {...props}
    />
  );
}

/** The close glyph (anatomy #3), the one dismissal a keyboard user is
 * required to find (Accessibility "Two ways out") — never hidden on
 * hover. Wired to `aria-label="Close"` since its visible content is a
 * glyph, not words. */
export function DrawerClose({ className, ...props }: ComponentProps<"button">) {
  return (
    <DialogPrimitive.Close asChild>
      <button
        type="button"
        data-slot="drawer-close"
        aria-label="Close"
        className={cn(
          "flex size-32 shrink-0 items-center justify-center rounded-ds text-mute transition-colors hover:bg-panel-2 hover:text-fg",
          className,
        )}
        {...props}
      >
        ✕
      </button>
    </DialogPrimitive.Close>
  );
}

/** The only scrolling region (anatomy #4). Rendered as Radix's
 * `Description` (`asChild`) so the panel's `aria-describedby` reaches it
 * automatically, the same pattern modal.tsx's own `ModalBody` already
 * uses. */
export function DrawerBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <DialogPrimitive.Description asChild>
      <div
        data-slot="drawer-body"
        className={cn("flex-1 overflow-y-auto p-22 text-body text-dim", className)}
        {...props}
      />
    </DialogPrimitive.Description>
  );
}

/** The footer (anatomy #5): pinned to the bottom, actions right-aligned,
 * primary last — the single commit for everything in the body. */
export function DrawerFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex justify-end gap-10 border-t border-border px-22 py-16", className)}
      {...props}
    />
  );
}

/** The plain word "Cancel" (Content rule 4), never styled to compete with
 * the primary action. Closes the drawer like any dismissal. */
export function DrawerCancel({ variant = "secondary", ...props }: Omit<ButtonProps, "variant"> & Partial<Pick<ButtonProps, "variant">>) {
  return (
    <DialogPrimitive.Close asChild>
      <Button data-slot="drawer-cancel" variant={variant} {...props} />
    </DialogPrimitive.Close>
  );
}

/** The primary action, last in the footer, stating the outcome (Content
 * rule 4): "Save changes", "Run now". Closes the drawer on click —
 * intercept by calling `event.preventDefault()` in `onClick` to keep it
 * open (e.g. pending a request). */
export function DrawerAction({ variant = "primary", ...props }: Omit<ButtonProps, "variant"> & Partial<Pick<ButtonProps, "variant">>) {
  return (
    <DialogPrimitive.Close asChild>
      <Button data-slot="drawer-action" variant={variant} {...props} />
    </DialogPrimitive.Close>
  );
}
