import type { ElementType, ReactNode } from "react";
import { cn } from "../cn";

interface CardBaseProps {
  className?: string;
}

export interface CardPlainProps extends CardBaseProps {
  kind?: "plain";
  children: ReactNode;
}

export interface CardWithHeaderProps extends CardBaseProps {
  kind: "with-header";
  /** Two to four words naming the contents, never describing them (Cards
   * Content rule 1). Rendered as a real heading in the reading order (Cards
   * Accessibility "Headings, not styling") — uppercase is styling only, the
   * accessible name stays sentence case. */
  title: ReactNode;
  /** The element the title renders as. A heading is an h2/h3/etc. because
   * of where the card sits in the page, not because of its size — defaults
   * to `h3`, the level a content-section card usually sits at. */
  titleAs?: ElementType;
  /** The header's right end: a count, unit or status. Reference only, never
   * an action (Cards anatomy #3 "Meta slot"). */
  meta?: ReactNode;
  children: ReactNode;
}

export interface CardHudProps extends CardBaseProps {
  kind: "hud";
  children: ReactNode;
}

export interface CardStatProps extends CardBaseProps {
  kind: "stat";
  /** The question this stat answers, read before `value` (Cards
   * Accessibility "Order matters"). */
  label: ReactNode;
  /** The one number that answers `label` (Cards Kinds "Stat"). */
  value: ReactNode;
  /** At most one unit of context beside `value` — never a second number
   * (Cards Kinds "Stat"). */
  unit?: ReactNode;
}

export interface CardTileProps extends CardBaseProps {
  kind: "tile";
  /** The one destination this tile leads to — never a menu (Cards Kinds
   * "Tile"). No `href` is offered: an anchor alone doesn't activate on
   * Space, and a tile must (Cards Accessibility "Tiles are one control"). */
  onClick?: () => void;
  children: ReactNode;
}

export type CardProps =
  | CardPlainProps
  | CardWithHeaderProps
  | CardHudProps
  | CardStatProps
  | CardTileProps;

const CONTAINER_CLASS = "border border-border bg-panel rounded-ds font-body";

/**
 * The prototype's own two-sides-per-corner HUD mark (archive/v1/Workspace
 * Shell.dc.html), drawn as plain borders rather than SVG — nothing here
 * needs antialiasing a border can't give. 7px offset and 13px size snap to
 * Space-8 and Space-12 (Cards extractionNotes).
 */
function CardHudCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const vertical = position[0] === "t" ? "top-8 border-t" : "bottom-8 border-b";
  const horizontal = position[1] === "l" ? "left-8 border-l" : "right-8 border-r";
  return (
    <span
      aria-hidden="true"
      data-slot="card-hud-corner"
      className={cn("absolute size-12 border-bracket", vertical, horizontal)}
    />
  );
}

/**
 * A bounded surface that holds one thing worth looking at on its own
 * (CONTEXT.md). Stays flat in the page and stays put — the moment content
 * needs to float it is a Modal, and the moment rows share fields and want
 * comparing it is a Table (Cards description).
 */
export function Card(props: CardProps) {
  const { className } = props;

  if (props.kind === "with-header") {
    const { title, titleAs: TitleTag = "h3", meta, children } = props;
    return (
      <div data-slot="card" data-kind="with-header" className={cn(CONTAINER_CLASS, className)}>
        <div
          data-slot="card-header"
          className="flex items-baseline justify-between gap-12 border-b border-border px-16 py-12"
        >
          <TitleTag
            data-slot="card-title"
            className="font-body text-label uppercase tracking-tight-16 text-dim"
          >
            {title}
          </TitleTag>
          {meta !== undefined ? (
            // --mute, not --faint: bare --faint text on --panel measures
            // 3.53:1 in the light theme (axe, apps/docs/e2e/card.spec.ts),
            // short of AA's 4.5:1 — the same gap Text's own extractionNotes
            // already route eyebrow/caption around. --mute clears 4.5:1 in
            // both themes.
            <span data-slot="card-meta" className="text-micro text-mute">
              {meta}
            </span>
          ) : null}
        </div>
        <div data-slot="card-body" className="p-18 text-small text-dim">
          {children}
        </div>
      </div>
    );
  }

  if (props.kind === "hud") {
    return (
      <div
        data-slot="card"
        data-kind="hud"
        className={cn(CONTAINER_CLASS, "relative", className)}
      >
        <CardHudCorner position="tl" />
        <CardHudCorner position="tr" />
        <CardHudCorner position="bl" />
        <CardHudCorner position="br" />
        <div data-slot="card-body" className="p-18 text-small text-dim">
          {props.children}
        </div>
      </div>
    );
  }

  if (props.kind === "stat") {
    const { label, value, unit } = props;
    return (
      <div data-slot="card" data-kind="stat" className={cn(CONTAINER_CLASS, "p-18", className)}>
        <div data-slot="card-stat-label" className="mb-8 text-micro uppercase tracking-tight-14 text-mute">
          {label}
        </div>
        <div data-slot="card-stat-value" className="flex items-baseline gap-8">
          <span className="font-heading text-metric font-semibold tracking-tight-neg-1 text-fg">
            {value}
          </span>
          {unit !== undefined ? (
            <span data-slot="card-stat-unit" className="text-label text-mute">
              {unit}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  if (props.kind === "tile") {
    return (
      <button
        type="button"
        data-slot="card"
        data-kind="tile"
        onClick={props.onClick}
        className={cn(
          CONTAINER_CLASS,
          "block w-full p-18 text-left text-small text-dim hover:border-border-2 hover:bg-panel-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          className,
        )}
      >
        {props.children}
      </button>
    );
  }

  return (
    <div
      data-slot="card"
      data-kind="plain"
      className={cn(CONTAINER_CLASS, "p-18 text-small text-dim", className)}
    >
      {props.children}
    </div>
  );
}
