import { icon } from "@lairy/tokens";
import type { ReactNode } from "react";

/**
 * The twelve glyphs, 40-grid (Icons foundation, icoDocs icoGlyphSet; paths
 * ported from the prototype's glyph()). Navigation and section identity —
 * never redrawn for a smaller size, only scaled (Icons foundation
 * Construction rule 5).
 */
export type GlyphName =
  | "apps"
  | "grid"
  | "check"
  | "build"
  | "book"
  | "pot"
  | "rings"
  | "wave"
  | "nodes"
  | "hex"
  | "scan"
  | "cmd";

const STROKE = icon.strokeGlyph;

/** The dock rail (collapsed nav) vs. section tiles and empty states — the
 * two ends of the Glyph scale's 22–34px range (Icons foundation icoDocs). */
const BOX: Record<"rail" | "tile", number> = {
  rail: Number.parseFloat(icon.glyphRail),
  tile: Number.parseFloat(icon.glyphTile),
};

/**
 * Fill is reserved for the centre mark (Icons foundation Construction rule
 * 4) — the small solid dot at the middle of rings, nodes and scan is the
 * one place a glyph carries a filled shape.
 */
const PATHS: Record<GlyphName, ReactNode> = {
  apps: (
    <>
      <rect x={7} y={7} width={11} height={11} rx={2.5} />
      <rect x={22} y={7} width={11} height={11} rx={2.5} />
      <rect x={7} y={22} width={11} height={11} rx={2.5} />
      <rect x={22} y={22} width={11} height={11} rx={2.5} />
    </>
  ),
  grid: (
    <>
      <rect x={6} y={6} width={28} height={28} rx={3} />
      <path d="M6 16h28M6 24h28M16 6v28M24 6v28" />
    </>
  ),
  check: (
    <>
      <path d="M6 12l4 4 8-9" />
      <path d="M6 27l4 4 8-9" />
      <path d="M24 15h11M24 30h11" />
    </>
  ),
  build: (
    <>
      <path d="M14 6H8a2 2 0 0 0-2 2v6" />
      <path d="M6 26v6a2 2 0 0 0 2 2h6" />
      <path d="M26 6h6a2 2 0 0 1 2 2v6" />
      <path d="M34 26v6a2 2 0 0 1-2 2h-6" />
      <circle cx={20} cy={20} r={5} />
    </>
  ),
  book: (
    <>
      <path d="M6 8h11a4 4 0 0 1 3 1.6A4 4 0 0 1 23 8h11v22H23a4 4 0 0 0-3 1.4A4 4 0 0 0 17 30H6z" />
      <path d="M20 11v20" />
    </>
  ),
  pot: (
    <>
      <path d="M8 16h24v12a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5z" />
      <path d="M32 19h4v5h-4M8 19H4v5h4" />
      <path d="M15 11c0-2 2-2 2-4M23 11c0-2 2-2 2-4" />
    </>
  ),
  rings: (
    <>
      <circle cx={20} cy={20} r={15} />
      <circle cx={20} cy={20} r={9} />
      <circle cx={20} cy={20} r={3.4} fill="currentColor" stroke="none" />
    </>
  ),
  wave: (
    <>
      <path d="M3 20 Q9 6 14 20 T25 20 T36 20" />
      <path d="M3 27 Q9 17 14 27 T25 27 T36 27" />
    </>
  ),
  nodes: (
    <>
      <path d="M9 10h9a4 4 0 0 1 4 4v12" />
      <circle cx={9} cy={10} r={3} fill="currentColor" stroke="none" />
      <circle cx={31} cy={14} r={2.6} />
      <circle cx={22} cy={30} r={2.6} />
      <path d="M22 14h9" />
    </>
  ),
  hex: (
    <>
      <path d="M20 5 32 12 32 26 20 33 8 26 8 12Z" />
      <path d="M20 13 26 16.5 26 23 20 26 14 23 14 16.5Z" />
    </>
  ),
  scan: (
    <>
      <circle cx={20} cy={20} r={15} />
      <path d="M20 20 L34 14" />
      <path d="M6 20h28M20 6v28" opacity={0.45} />
      <circle cx={20} cy={20} r={2.4} fill="currentColor" stroke="none" />
    </>
  ),
  cmd: (
    <>
      <path d="M8 10 4 20 8 30" />
      <path d="M32 10 36 20 32 30" />
      <path d="M17 26 23 14" />
    </>
  ),
};

export interface GlyphProps {
  name: GlyphName;
  /** Rail (22px, dock/collapsed nav) or tile (34px, section tiles and empty
   * states) — the two ends of the Glyph scale (Icons foundation icoDocs).
   * Defaults to tile. */
  size?: "rail" | "tile";
  /** An accessible name, for a glyph that is the only content of its
   * control (Icons foundation accessibility "Never the only label"). Omit
   * when a text label already sits beside the glyph — it is then purely
   * decorative and hidden from assistive tech. */
  label?: string;
  className?: string;
}

/**
 * A navigation/identity glyph, ported from the prototype's glyph(). Colour
 * comes from currentColor only (Icons foundation Construction rule 3) —
 * there is no colour prop; set it on an ancestor element instead.
 */
export function Glyph({ name, size = "tile", label, className }: GlyphProps) {
  const box = BOX[size];
  return (
    <svg
      width={box}
      height={box}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {PATHS[name]}
    </svg>
  );
}
