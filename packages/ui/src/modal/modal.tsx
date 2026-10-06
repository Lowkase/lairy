"use client";

import { modal as modalTokens, zIndex } from "@lairy/tokens";
import { AlertDialog as AlertDialogPrimitive, Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps, CSSProperties } from "react";
import { Button, type ButtonProps } from "../button/button";
import { cn } from "../cn";

export type ModalSize = "sm" | "md" | "lg";

/** Modal anatomy #2's three widths (Sizes section). None lands on the
 * Spacing ramp (4, 6, 8, 12, 16, 18, 22, 32, 44) — the same
 * component-specific exception `--popover-panel-width` already set, added
 * as `--modal-width-*` (packages/tokens/tokens/modal.json). */
const MODAL_WIDTH: Record<ModalSize, string> = {
  sm: modalTokens.widthSm,
  md: modalTokens.widthMd,
  lg: modalTokens.widthLg,
};

/** Both overlay and dialog share the Overlay stop (Elevation `elevZ`: "Modal
 * and drawer — the blocking layer. Both live at the same stop because two
 * are never open at once"). No Tailwind `z-80` utility exists — the default
 * scale stops at 50 and this repo's `@theme` block never names a z-index
 * scale (ADR-0003 only resets/replaces the namespaces build.mjs loops
 * over) — so this is set as an inline style from the real token, the same
 * escape `popover.tsx`'s own `style={{ width: popoverTokens.panelWidth }}`
 * already uses for a value with no utility class home. */
const OVERLAY_Z = { zIndex: zIndex.overlay };

/** The scrim (anatomy #1): a dim over the whole workspace, blurred enough to
 * say the page is out of reach but not enough to hide it. The prototype's
 * own `color-mix(in srgb, var(--bg) 55%, transparent)` becomes Tailwind's
 * `bg-bg/55` opacity modifier, which composes the same mix in `oklab`
 * rather than `srgb` — a visually negligible space change, flagged here
 * rather than reached for `color-mix` by hand. `backdrop-blur-sm` (8px) is
 * Tailwind's own default scale, picked as the closer of its two neighbours
 * to the prototype's literal 6px (sm=8, xs=4, both 2px away — ties broken
 * toward the stronger blur so the page reads unambiguously out of reach):
 * Blur has no Lairy foundation or token today (only Elevation's shadows and
 * Motion's durations/easings exist), the same category of gap popover.ts's
 * own extractionNotes already flagged for `--shadow-bubble`/`duration-160`.
 * Flagged in the PR (LDS-040) and as a `needs-triage` follow-up: Drawer
 * (LDS-040's blocked ticket) will need the same 4px step. */
const OVERLAY_CLASS =
  "fixed inset-0 bg-bg/55 backdrop-blur-sm data-[state=open]:animate-fade-in";

/**
 * The dialog itself (anatomy #2): centred, on `panel-2` with a `border-2`
 * hairline and the system's own Overlay shadow — one of the few surfaces in
 * the system allowed elevation, because it genuinely floats. `max-width:
 * 92vw`/`max-height: 92vh` are carried over as literal viewport units, the
 * same way the prototype's own live modal markup (archive/v1 "SYSTEM
 * OVERLAYS") sets `max-width:92vw` directly rather than through a token —
 * there is no Spacing-ramp step a viewport-relative cap could snap to.
 */
function modalSurfaceClassName(size: ModalSize, className?: string) {
  return cn(
    "fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-ds border border-border-2 bg-panel-2 shadow-overlay outline-none data-[state=open]:animate-panel-in",
    className,
  );
}

function modalSurfaceStyle(size: ModalSize): CSSProperties {
  return { ...OVERLAY_Z, width: MODAL_WIDTH[size], maxWidth: "92vw", maxHeight: "92vh" };
}

function focusDataSlot(container: HTMLElement, slot: string): boolean {
  const el = container.querySelector<HTMLElement>(`[data-slot="${slot}"]`);
  if (!el) return false;
  el.focus();
  return true;
}

/** The question itself, and the close glyph beside it (anatomy #3). Shared
 * by both kinds — `ModalConfirm` simply never renders a `ModalClose` inside
 * it, since a destructive confirm has none (anatomy #3: "always present
 * except on a destructive confirm"). Not Radix-specific, so one component
 * serves `Modal` and `ModalConfirm` alike. */
export function ModalHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-header"
      className={cn("flex items-center justify-between gap-10 border-b border-border px-22 py-18", className)}
      {...props}
    />
  );
}

/** Exactly two actions, right-aligned, primary last (anatomy #5). Not
 * Radix-specific, so one component serves `Modal` and `ModalConfirm`
 * alike. */
export function ModalFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-footer"
      className={cn("flex justify-end gap-10 border-t border-border px-22 py-16", className)}
      {...props}
    />
  );
}

/**
 * A modal is a centred dialog that stops the workspace until the operator
 * answers it (purpose). This is the benign kind: dismissible by Escape, the
 * scrim, or its own close glyph, and its primary action is focused on open
 * so Enter confirms (Accessibility "No default on destruct"). For a
 * destructive confirm — no close glyph, Cancel focused instead, the scrim
 * inert — use `ModalConfirm`, built on Radix's `alert-dialog` rather than
 * this component's `dialog` (ADR-0004; Accessibility "No default on
 * destruct").
 */
export function Modal(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="modal" {...props} />;
}

/** The control that opens the modal. Pass `asChild` to use your own trigger
 * element (usually `Button`) rather than Radix's default unstyled
 * `<button>`. Focus returns here on close, however the modal was dismissed
 * (Accessibility "Focus is trapped"). */
export function ModalTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="modal-trigger" {...props} />;
}

export interface ModalContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  /** One of the Sizes section's three widths — SM for a single destructive
   * decision, MD (the default) for a short form, LG for dense content that
   * scrolls internally. Matches the content entry's variant names
   * (docs/build-guide.md §4 step 4). */
  size?: ModalSize;
}

/**
 * The scrim and the dialog (anatomy #1-2). Primary action is focused on
 * open (Accessibility "No default on destruct") by finding the
 * `ModalAction` inside — override by handling `onOpenAutoFocus` yourself
 * (e.g. to focus a form field instead) and calling `preventDefault`.
 */
export function ModalContent({ className, size = "md", onOpenAutoFocus, ...props }: ModalContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay data-slot="modal-overlay" className={OVERLAY_CLASS} style={OVERLAY_Z} />
      <DialogPrimitive.Content
        data-slot="modal-content"
        aria-modal="true"
        className={modalSurfaceClassName(size, className)}
        style={modalSurfaceStyle(size)}
        onOpenAutoFocus={(event) => {
          onOpenAutoFocus?.(event);
          if (event.defaultPrevented) return;
          if (focusDataSlot(event.currentTarget as HTMLElement, "modal-action")) event.preventDefault();
        }}
        {...props}
      />
    </DialogPrimitive.Portal>
  );
}

/** The question, set as a question (Content rule 1): "Delete 'rebalance'?",
 * never "Confirm deletion". */
export function ModalTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="modal-title"
      className={cn("font-heading text-section font-semibold text-fg", className)}
      {...props}
    />
  );
}

/** The close glyph (anatomy #3), present on every benign modal. Wired to
 * `aria-label="Close"` since its visible content is a glyph, not words. */
export function ModalClose({ className, ...props }: ComponentProps<"button">) {
  return (
    <DialogPrimitive.Close asChild>
      <button
        type="button"
        data-slot="modal-close"
        aria-label="Close"
        className={cn(
          "flex size-32 shrink-0 items-center justify-center rounded-ds text-mute transition-colors hover:bg-panel hover:text-fg",
          className,
        )}
        {...props}
      >
        ✕
      </button>
    </DialogPrimitive.Close>
  );
}

/** One or two sentences naming the consequence, in the operator's
 * vocabulary (anatomy #4) — never scrolling (Content rule, "the content was
 * too big for a modal"). Rendered as Radix's `Description` (`asChild`, so
 * it can hold a field rather than only prose) so the dialog's
 * `aria-describedby` reaches it automatically (Accessibility "Dialog and
 * modal": "described by the body"). */
export function ModalBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <DialogPrimitive.Description asChild>
      <div
        data-slot="modal-body"
        className={cn("flex-1 overflow-y-auto p-22 text-body text-dim", className)}
        {...props}
      />
    </DialogPrimitive.Description>
  );
}

/** The plain word "Cancel" (Content rule), never styled to compete with the
 * primary action. Closes the modal like any dismissal. */
export function ModalCancel({ variant = "secondary", ...props }: Omit<ButtonProps, "variant"> & Partial<Pick<ButtonProps, "variant">>) {
  return (
    <DialogPrimitive.Close asChild>
      <Button data-slot="modal-cancel" variant={variant} {...props} />
    </DialogPrimitive.Close>
  );
}

/** The primary action, last in the footer, repeating the verb from the
 * header (Content rule: "so the action is legible without reading back
 * up"). Closes the modal on click — intercept by calling
 * `event.preventDefault()` in `onClick` to keep it open (e.g. pending a
 * request). Focused automatically on open (`ModalContent`'s
 * `onOpenAutoFocus`). */
export function ModalAction({ variant = "primary", ...props }: Omit<ButtonProps, "variant"> & Partial<Pick<ButtonProps, "variant">>) {
  return (
    <DialogPrimitive.Close asChild>
      <Button data-slot="modal-action" variant={variant} {...props} />
    </DialogPrimitive.Close>
  );
}

/**
 * The destructive kind of Modal (Accessibility "No default on destruct"):
 * no close glyph, Cancel focused instead of the primary action so a stray
 * keystroke cannot delete anything, and the scrim is inert — "cancelling is
 * never the dangerous path" is Escape's job alone. Scaffolded from shadcn's
 * `alert-dialog` (ADR-0004) rather than `ModalContent`'s `dialog`, for
 * `role="alertdialog"` and its own `Action`/`Cancel` primitives.
 */
export function ModalConfirm(props: ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="modal-confirm" {...props} />;
}

export function ModalConfirmTrigger(props: ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="modal-confirm-trigger" {...props} />;
}

export interface ModalConfirmContentProps extends ComponentProps<typeof AlertDialogPrimitive.Content> {
  /** SM for a single decision (the common case) — MD/LG are available for a
   * destructive confirm that genuinely needs more room, same meaning as
   * `ModalContentProps.size`. */
  size?: ModalSize;
}

/**
 * The scrim and the dialog, restyled identically to `ModalContent` — same
 * width, hairline, shadow and entrance, so the two kinds read as one
 * surface. Unlike `ModalContent`, no `onOpenAutoFocus`/outside-dismiss
 * override is needed here: Radix's `AlertDialogContent` already focuses
 * whichever `ModalConfirmCancel` is rendered inside it by default (its own
 * internal `cancelRef`, Accessibility "No default on destruct") and already
 * prevents outside pointer/interaction dismissal by default (Accessibility
 * "the scrim click is only wired up when nothing can be lost") — the first
 * entry in the catalogue whose spec wants a Radix default exactly as
 * shipped, on both counts (`AlertDialogContentProps` doesn't even expose
 * `onPointerDownOutside`/`onInteractOutside` to override).
 */
export function ModalConfirmContent({ className, size = "sm", ...props }: ModalConfirmContentProps) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay data-slot="modal-confirm-overlay" className={OVERLAY_CLASS} style={OVERLAY_Z} />
      <AlertDialogPrimitive.Content
        data-slot="modal-confirm-content"
        aria-modal="true"
        className={modalSurfaceClassName(size, className)}
        style={modalSurfaceStyle(size)}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  );
}

export function ModalConfirmTitle({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="modal-confirm-title"
      className={cn("font-heading text-section font-semibold text-fg", className)}
      {...props}
    />
  );
}

/** Same role as `ModalBody`, described above — `asChild` onto a styled
 * `div` rather than Radix's default `<p>`, so it keeps working the one time
 * a destructive confirm's body needs more than a line of prose. */
export function ModalConfirmBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <AlertDialogPrimitive.Description asChild>
      <div
        data-slot="modal-confirm-body"
        className={cn("flex-1 overflow-y-auto p-22 text-body text-dim", className)}
        {...props}
      />
    </AlertDialogPrimitive.Description>
  );
}

/** The plain word "Cancel" (Content rule). Focused automatically on open
 * (`ModalConfirmContent`'s `onOpenAutoFocus`). */
export function ModalConfirmCancel({ variant = "secondary", ...props }: Omit<ButtonProps, "variant"> & Partial<Pick<ButtonProps, "variant">>) {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button data-slot="modal-confirm-cancel" variant={variant} {...props} />
    </AlertDialogPrimitive.Cancel>
  );
}

/** The primary action, repeating the verb from the header. Never coloured
 * `danger` by itself (Buttons Accessibility "Never colour alone") — the
 * destructive signal is the header's own question and the body's own
 * consequence, not the button (the prototype's own live demo ships its
 * "DELETE" action in the same accent fill as any other primary button). */
export function ModalConfirmAction({ variant = "primary", ...props }: Omit<ButtonProps, "variant"> & Partial<Pick<ButtonProps, "variant">>) {
  return (
    <AlertDialogPrimitive.Action asChild>
      <Button data-slot="modal-confirm-action" variant={variant} {...props} />
    </AlertDialogPrimitive.Action>
  );
}
