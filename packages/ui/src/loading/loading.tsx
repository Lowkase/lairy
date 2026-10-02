import type { ReactNode } from "react";
import { cn } from "../cn";

/** Fixed, unequal-width track presets for the sweep stack (Loading anatomy
 * #2 — "because prose does not arrive in a rectangle"). Not a prop: no call
 * site in the source ever reuses the same widths twice, so the irregularity
 * itself is the point, not a value a consumer should tune. */
const SWEEP_STACK_WIDTHS: Record<2 | 3, readonly string[]> = {
  2: ["100%", "66%"],
  3: ["100%", "64%", "78%"],
};

interface LoadingBaseProps {
  className?: string;
}

export interface LoadingSweepStackProps extends LoadingBaseProps {
  /** The default house style: unequal hairlines standing in for text that
   * has not arrived (Loading Variants "Sweep stack"). */
  variant: "sweep-stack";
  /** The present participle the component prefixes with // and uppercases
   * (Loading Content rules 1–2, anatomy #4). */
  phase: string;
  /** How many unequal-width tracks to render (Loading anatomy #2). */
  lines?: 2 | 3;
}

export interface LoadingSkeletonProps extends LoadingBaseProps {
  /** Holds the exact geometry the content will occupy, so nothing jumps
   * when it lands (Loading Variants "Skeleton"). Compose from
   * `LoadingSkeletonLine`. */
  variant: "skeleton";
  children: ReactNode;
}

export interface LoadingInlineCaretProps extends LoadingBaseProps {
  /** For dense chrome a stack will not fit — a table row mid-refresh, a
   * button mid-submit (Loading Variants "Inline caret"). */
  variant: "inline-caret";
  /** The present participle the component prefixes with // and uppercases
   * (Loading Content rules 1–2, anatomy #4). */
  phase: string;
}

export type LoadingProps = LoadingSweepStackProps | LoadingSkeletonProps | LoadingInlineCaretProps;

/** The caret (Loading anatomy #5): the smallest unit of liveness the system
 * has, and the only one allowed inside a table row. 5×11px in the
 * prototype; 4×12px here — neither axis has a clean token (packages/content's
 * own extractionNotes record the snap on each). */
function LoadingCaret() {
  return (
    <span
      data-slot="loading-caret"
      aria-hidden="true"
      className="h-12 w-4 shrink-0 animate-caretblink bg-accent"
    />
  );
}

/** The phase label (Loading anatomy #4): the one piece of real information
 * in the whole component. The // prefix and uppercase transform are the
 * component's own formatting (Loading Content rule 1) — callers pass the
 * bare participle. */
function LoadingPhaseLabel({ phase }: { phase: string }) {
  // --mute, not --faint: bare --faint text on --panel measures 3.53:1 in the
  // light theme (axe, apps/docs/e2e/loading.spec.ts), short of AA's 4.5:1
  // floor — the same gap Empty state's own support line and Card's own meta
  // slot extractionNotes already route around. --mute clears 4.5:1 in both
  // themes.
  return (
    <span className="truncate text-label uppercase tracking-tight-14 text-mute">{`// ${phase}`}</span>
  );
}

/** One track of the sweep stack (Loading anatomy #2–3): a 2px hairline in
 * --accent-line with a gradient sweep a third of its width travelling
 * across it. Height and width are inline styles, not Tailwind classes —
 * neither a 2px hairline nor a deliberately irregular line length is a
 * spacing-ramp or type-scale value (extractionNotes). */
function LoadingTrack({ width, delayMs }: { width: string; delayMs: number }) {
  return (
    <span
      data-slot="loading-track"
      aria-hidden="true"
      className="relative block overflow-hidden bg-accent-line"
      style={{ height: 2, width }}
    >
      <span
        className="absolute inset-y-0 right-0 block w-1/3 animate-sweepline bg-linear-to-r from-transparent to-accent"
        style={{ animationDelay: `${delayMs}ms` }}
      />
    </span>
  );
}

/** A single skeleton bar (Loading Variants "Skeleton"). Exported so a
 * consumer can compose the exact row/column geometry their own content
 * will occupy — the component itself has no way to know that shape in
 * advance (extractionNotes). Grey, not amber: the shape is the message,
 * not the motion. */
export function LoadingSkeletonLine({ className }: { className?: string }) {
  return (
    <span data-slot="loading-skeleton-line" aria-hidden="true" className={cn("block h-8 bg-border", className)} />
  );
}

/**
 * What a region shows while it still does not know the answer (CONTEXT.md).
 * The line against Progress is knowledge: progress states a measured
 * fraction of a known total, this states nothing but that work is under
 * way.
 */
export function Loading(props: LoadingProps) {
  const { variant, className } = props;

  if (variant === "skeleton") {
    return (
      <div data-slot="loading" data-variant="skeleton" className={cn("flex flex-col gap-8", className)}>
        {props.children}
      </div>
    );
  }

  if (variant === "inline-caret") {
    return (
      <div
        data-slot="loading"
        data-variant="inline-caret"
        role="status"
        aria-busy="true"
        aria-live="polite"
        className={cn("flex items-center gap-8", className)}
      >
        <LoadingPhaseLabel phase={props.phase} />
        <LoadingCaret />
      </div>
    );
  }

  const widths = SWEEP_STACK_WIDTHS[props.lines ?? 3];

  return (
    <div
      data-slot="loading"
      data-variant="sweep-stack"
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={cn("flex flex-col gap-12", className)}
    >
      {widths.map((width, index) => (
        <LoadingTrack key={index} width={width} delayMs={index * 220} />
      ))}
      <div className="flex items-center gap-8">
        <LoadingPhaseLabel phase={props.phase} />
        <LoadingCaret />
      </div>
    </div>
  );
}
