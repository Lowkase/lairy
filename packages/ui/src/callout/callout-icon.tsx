import { icon } from "@lairy/tokens";
import type { ReactNode } from "react";

export type CalloutIconKind = "info" | "success" | "warning" | "error";

const SIZE = Number.parseFloat(icon.callout);

const PATHS: Record<CalloutIconKind, ReactNode> = {
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 11h1v6h1" />
    </>
  ),
  success: <path d="M12 3l1.6 4.8L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.2z" />,
  warning: (
    <>
      <path d="M12 4 3 20h18z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  error: (
    <>
      <path d="M12 3 21 8v8l-9 5-9-5V8z" />
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
    </>
  ),
};

/** The tone glyph for Callout, ported from the prototype's calloutIcon(). */
export function CalloutIcon({ kind }: { kind: CalloutIconKind }) {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[kind]}
    </svg>
  );
}
