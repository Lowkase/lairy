import type { ReactNode } from "react";
import { Button } from "../button/button";
import { cn } from "../cn";
import { EmptyStateIcon } from "./empty-state-icon";

export type EmptyStateKind = "first-run" | "no-results" | "restricted";

export interface EmptyStateAction {
  /** The verb label (Empty state Content rule 5 — "verb-first and specific"). */
  label: string;
  onClick?: () => void;
}

interface EmptyStateBaseProps {
  /** The fact, in the operator's own vocabulary (Empty state Content rule 1,
   * anatomy #3). Never a greeting, never an apology. */
  headline: ReactNode;
  /** What would appear here and how it gets here — the only teaching this
   * component does (Empty state anatomy #4, Content rule 3). */
  body?: ReactNode;
  className?: string;
}

export interface EmptyStateFirstRunProps extends EmptyStateBaseProps {
  /** Nothing exists yet; the only kind that earns a primary action (Empty
   * state Variants "First run"). */
  kind: "first-run";
  action?: EmptyStateAction;
}

export interface EmptyStateNoResultsProps extends EmptyStateBaseProps {
  /** Records exist, but the operator's own filter hid them; its action
   * undoes the filter, so it is ghost, never primary (Empty state Variants
   * "No results"). */
  kind: "no-results";
  action?: EmptyStateAction;
}

export interface EmptyStateRestrictedProps extends EmptyStateBaseProps {
  /** Content exists but not for this operator. No `action` field exists for
   * this kind — offering a button the operator can't use is worse than
   * offering none (Empty state Variants "Restricted", Content rule 5). */
  kind: "restricted";
}

export type EmptyStateProps =
  | EmptyStateFirstRunProps
  | EmptyStateNoResultsProps
  | EmptyStateRestrictedProps;

/**
 * What a region says when it has loaded successfully and has nothing to
 * show (CONTEXT.md). A statement of fact with a way forward, never an
 * apology — the line against Loading is certainty: loading means the
 * answer is unknown, this means it is known and it is none.
 */
export function EmptyState(props: EmptyStateProps) {
  const { kind, headline, body, className } = props;
  const action = kind === "restricted" ? undefined : props.action;

  return (
    <div
      data-slot="empty-state"
      data-kind={kind}
      aria-live="polite"
      className={cn("flex flex-col items-center py-32 px-18 text-center", className)}
    >
      <span data-slot="empty-state-mark" className="mb-12 flex text-faint">
        <EmptyStateIcon />
      </span>
      <div data-slot="empty-state-headline" className="mb-6 text-callout-title text-dim">
        {headline}
      </div>
      {body !== undefined ? (
        // --mute, not --faint: bare --faint text on --panel measures 3.53:1
        // in the light theme (axe, apps/docs/e2e/empty-state.spec.ts), short
        // of AA's 4.5:1 floor — the same gap Card's own extractionNotes
        // already route its meta slot around. --mute clears 4.5:1 in both
        // themes.
        <div
          data-slot="empty-state-body"
          className={cn("text-label text-mute", action ? "mb-16" : undefined)}
        >
          {body}
        </div>
      ) : null}
      {action ? (
        <Button variant={kind === "first-run" ? "primary" : "ghost"} onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
