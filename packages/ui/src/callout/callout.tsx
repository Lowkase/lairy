import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "../button/button";
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
}

const TONE_CONFIG: Record<CalloutTone, ToneConfig> = {
  info: { icon: "info", role: "status", iconClass: "text-accent-2" },
  success: { icon: "success", role: "status", iconClass: "text-accent" },
  warning: { icon: "warning", role: "alert", iconClass: "text-alarm" },
  error: { icon: "error", role: "alert", iconClass: "text-alarm" },
};

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
  /** Which standing condition this callout reports (Callout Variants). */
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
            <Button
              key={action.label}
              variant={index === 0 ? "primary" : "secondary"}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
