import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../cn";
import { CalloutIcon, type CalloutIconKind } from "./callout-icon";

export type CalloutTone = "info" | "success" | "warning" | "error";

export interface CalloutAction {
  label: string;
  onClick?: () => void;
}

interface ToneConfig {
  icon: CalloutIconKind;
  /**
   * Info and Success are announced politely; Warning and Error interrupt on
   * arrival (docs/build-guide.md port procedure step 5, Callout Accessibility
   * §06 "Role by tone").
   */
  role: "status" | "alert";
  iconClass: string;
  /**
   * The first action reads as primary; every other action is the lesser,
   * bordered style. Alarm's fill uses --alarm-ink for its text, not --bg:
   * alarm is non-themeable but --bg isn't, and --bg-on-alarm fails AA in the
   * light theme (flagged in the PR — the prototype's renderCallout() has
   * this bug).
   */
  primaryActionClass: string;
}

const TONE_CONFIG: Record<CalloutTone, ToneConfig> = {
  info: {
    icon: "info",
    role: "status",
    iconClass: "text-accent-2",
    primaryActionClass: "border-accent-2 bg-accent-2 text-bg",
  },
  success: {
    icon: "success",
    role: "status",
    iconClass: "text-accent",
    primaryActionClass: "border-accent bg-accent text-bg",
  },
  warning: {
    icon: "warning",
    role: "alert",
    iconClass: "text-alarm",
    primaryActionClass: "border-alarm bg-alarm text-alarm-ink",
  },
  error: {
    icon: "error",
    role: "alert",
    iconClass: "text-alarm",
    primaryActionClass: "border-alarm bg-alarm text-alarm-ink",
  },
};

const SECONDARY_ACTION_CLASS = "border-border-2 bg-transparent text-fg";

const calloutVariants = cva(
  "flex flex-col gap-12 rounded-ds border py-16 px-18 font-body text-small text-dim",
  {
    variants: {
      tone: {
        info: "border-accent-2-line",
        success: "border-accent-line bg-accent-soft",
        warning: "border-alarm-line",
        error: "border-alarm bg-alarm-soft",
      },
    },
    defaultVariants: { tone: "info" },
  },
);

export interface CalloutProps
  extends Omit<ComponentProps<"div">, "title">, VariantProps<typeof calloutVariants> {
  tone: CalloutTone;
  /** One short line stating the fact or outcome (Callout Content rule 1). */
  title: ReactNode;
  /** One to two sentences of context (Callout Content rule 2). */
  children: ReactNode;
  /** Zero, one or two actions; the first is primary (Callout Content rule 4). */
  actions?: CalloutAction[];
}

/**
 * A message inside the panel it concerns, reporting a standing condition
 * that stays true until resolved (CONTEXT.md). Never auto-dismissed.
 */
export function Callout({ tone, title, children, actions, className, ...props }: CalloutProps) {
  const config = TONE_CONFIG[tone];
  return (
    <div
      data-slot="callout"
      role={config.role}
      className={cn(calloutVariants({ tone }), className)}
      {...props}
    >
      <div data-slot="callout-header" className="flex items-center gap-8">
        <span data-slot="callout-icon" className={cn("flex shrink-0", config.iconClass)}>
          <CalloutIcon kind={config.icon} />
        </span>
        <span
          data-slot="callout-title"
          className="font-heading font-semibold text-callout-title text-fg"
        >
          {title}
        </span>
      </div>
      <div data-slot="callout-body">{children}</div>
      {actions && actions.length > 0 ? (
        <div data-slot="callout-actions" className="mt-4 flex gap-8">
          {actions.map((action, index) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={cn(
                "rounded-ds border py-6 px-12 text-label uppercase tracking-tight-6",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                index === 0 ? config.primaryActionClass : SECONDARY_ACTION_CLASS,
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
