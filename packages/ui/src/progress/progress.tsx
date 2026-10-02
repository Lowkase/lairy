import { cn } from "../cn";

interface ProgressBaseProps {
  className?: string;
}

export type ProgressBarStatus = "running" | "complete" | "failed";

export interface ProgressBarProps extends ProgressBaseProps {
  /** The default: one long task with a countable total (Progress Variants
   * "Bar"). */
  variant: "bar";
  /** What is being counted, a present participle (Progress anatomy #1,
   * Content rule 1). */
  label: string;
  /** The measured count so far (Progress anatomy #2). */
  value: number;
  /** The known denominator that makes the bar honest (Progress Rules "Only
   * with a denominator"). */
  max: number;
  /** One optional phase note the count can't say on its own, in the //
   * voice (Progress anatomy #5, Content rule 4). Pass natural case — this
   * renders it uppercase. */
  caption?: string;
  /** Which live state the fill renders. "running" is the default (Progress
   * Rules "Failure keeps its place"). */
  status?: ProgressBarStatus;
}

export interface ProgressStepsProps extends ProgressBaseProps {
  /** A pipeline with named, discrete stages (Progress Variants "Steps"). */
  variant: "steps";
  /** Optional heading naming the whole pipeline. Pass natural case — this
   * renders it uppercase. */
  label?: string;
  /** Total named stages. */
  steps: number;
  /** The stage now running, 1-indexed — stages before it render filled
   * (Progress Rules "Forward only"). */
  current: number;
  /** The current stage's own name. Pass natural case — this renders it
   * uppercase. */
  stageLabel?: string;
}

export interface ProgressMeterProps extends ProgressBaseProps {
  /** An inline level inside a table row or card — a quota, coverage or
   * capacity, not necessarily work in flight (Progress Variants "Meter"). */
  variant: "meter";
  /** What the level measures, read inline — there is no separate value
   * label. */
  label: string;
  /** The level as a whole-number percent, 0–100 (Content rule 2 — "then
   * with no decimal places"). */
  value: number;
}

export type ProgressProps = ProgressBarProps | ProgressStepsProps | ProgressMeterProps;

// The running/complete fill shares one token (--accent) at two opacities;
// failed is --alarm. Bare --alarm *text* fails AA against --bg in the light
// theme (2.02:1, the same gap badge.tsx's Fail label and button.tsx's
// Danger label already route around) — that only matters for the caption
// below, not this fill, which has no text-contrast requirement of its own.
const BAR_FILL_TONE: Record<ProgressBarStatus, string> = {
  running: "bg-accent/85",
  complete: "bg-accent",
  failed: "bg-alarm",
};

function percentOf(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, Math.max(0, (value / max) * 100));
}

function ProgressBarView({
  label,
  value,
  max,
  caption,
  status = "running",
  className,
}: Omit<ProgressBarProps, "variant">) {
  const percent = percentOf(value, max);
  return (
    <div
      data-slot="progress"
      data-variant="bar"
      data-status={status}
      className={cn("flex flex-col gap-6", className)}
    >
      <div className="flex items-baseline justify-between gap-12">
        <span className="min-w-0 truncate text-small text-dim">{label}</span>
        <span className="shrink-0 text-label text-mute">
          {value} / {max}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={status === "failed" ? `${value} of ${max}, failed` : `${value} of ${max}`}
        aria-label={label}
        className="h-6 overflow-hidden rounded-ds bg-panel-2"
      >
        <div
          className={cn(
            "h-full rounded-ds transition-all duration-300 motion-reduce:transition-none",
            BAR_FILL_TONE[status],
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {caption ? (
        <span
          className={cn(
            "truncate text-micro uppercase tracking-tight-6",
            status === "failed" ? "text-fg" : "text-mute",
          )}
        >{`// ${caption}`}</span>
      ) : null}
    </div>
  );
}

function ProgressStepsView({
  label,
  steps,
  current,
  stageLabel,
  className,
}: Omit<ProgressStepsProps, "variant">) {
  const stageNumber = Math.min(steps, Math.max(1, current));
  const filled = stageNumber - 1;
  return (
    <div data-slot="progress" data-variant="steps" className={cn("flex flex-col gap-8", className)}>
      {label ? (
        <span className="text-micro uppercase tracking-tight-14 text-mute">{label}</span>
      ) : null}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps}
        aria-valuenow={filled}
        aria-label={label ?? `Stage ${stageNumber} of ${steps}`}
        className="flex gap-4"
      >
        {Array.from({ length: steps }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            data-slot="progress-segment"
            className={cn("h-6 flex-1 rounded-ds", index < filled ? "bg-accent/85" : "bg-panel-2")}
          />
        ))}
      </div>
      <div className="flex justify-between gap-8 text-micro uppercase tracking-tight-6 text-mute">
        <span>{`Stage ${stageNumber} of ${steps}`}</span>
        {stageLabel ? <span>{stageLabel}</span> : null}
      </div>
    </div>
  );
}

function ProgressMeterView({ label, value, className }: Omit<ProgressMeterProps, "variant">) {
  const percent = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div data-slot="progress" data-variant="meter" className={cn("flex items-center gap-8", className)}>
      <span className="min-w-0 flex-1 truncate text-small text-fg">{label}</span>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={label}
        className="relative w-1/3 shrink-0 overflow-hidden bg-panel-2"
        style={{ height: 2 }}
      >
        <div className="h-full bg-accent/85" style={{ width: `${percent}%` }} />
      </div>
      <span className="shrink-0 text-micro text-mute">{percent}%</span>
    </div>
  );
}

/**
 * A measured fraction of a known total (CONTEXT.md). The line against
 * Loading is knowledge: this states a measured fraction of a known total,
 * Loading states nothing but that work is under way.
 */
export function Progress(props: ProgressProps) {
  if (props.variant === "steps") return <ProgressStepsView {...props} />;
  if (props.variant === "meter") return <ProgressMeterView {...props} />;
  return <ProgressBarView {...props} />;
}
