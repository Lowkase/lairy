"use client";

import { useState, type SyntheticEvent } from "react";

type Theme = "dark" | "light";
type Mode = "overlay" | "side-by-side";

const TOGGLE_BUTTON =
  "rounded-ds border border-border-2 py-6 px-12 text-label uppercase tracking-tight-6 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

// The capture's own viewport (reference/capture-baseline.mjs: VIEWPORT_WIDTH
// / BASE_VIEWPORT_HEIGHT) — both panes render at this fixed width so the
// baseline lines up pixel-for-pixel with the live page underneath it.
const CAPTURE_WIDTH = 1440;
const DEFAULT_HEIGHT = 900;

export function CompareView({
  entryId,
  entryName,
  livePath,
}: {
  entryId: string;
  entryName: string;
  livePath: string;
}) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mode, setMode] = useState<Mode>("overlay");
  const [opacity, setOpacity] = useState(50);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);

  const screenshotSrc = `/dev/compare/screenshot/${entryId}/${theme}`;
  const liveSrc = `${livePath}?theme=${theme}`;

  function onBaselineLoad(event: SyntheticEvent<HTMLImageElement>) {
    setHeight(event.currentTarget.naturalHeight);
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex flex-wrap items-center gap-12 border-b border-border-2 py-16 px-18">
        <span className="font-heading font-semibold text-section text-fg">{entryName}</span>
        <span className="text-micro text-mute">baseline vs live</span>

        <div className="ml-auto flex items-center gap-8">
          <button
            type="button"
            onClick={() => setMode((m) => (m === "overlay" ? "side-by-side" : "overlay"))}
            className={TOGGLE_BUTTON}
          >
            View: {mode === "overlay" ? "Overlay" : "Side by side"}
          </button>
          <button
            type="button"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className={TOGGLE_BUTTON}
          >
            Theme: {theme}
          </button>
        </div>
      </div>

      {mode === "overlay" ? (
        <div className="flex items-center gap-12 border-b border-border-2 py-12 px-18">
          <label htmlFor="baseline-opacity" className="text-label text-mute">
            Baseline opacity
          </label>
          <input
            id="baseline-opacity"
            type="range"
            min={0}
            max={100}
            value={opacity}
            onChange={(event) => setOpacity(Number(event.target.value))}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          />
          <span className="text-label text-fg">{opacity}%</span>
        </div>
      ) : null}

      <div className="overflow-auto py-18 px-18">
        {mode === "overlay" ? (
          <div className="relative" style={{ width: CAPTURE_WIDTH }}>
            <iframe
              key={theme}
              src={liveSrc}
              title={`${entryName} — live`}
              width={CAPTURE_WIDTH}
              height={height}
              className="border border-border-2 bg-bg"
            />
            <img
              src={screenshotSrc}
              alt={`${entryName} baseline, ${theme} theme`}
              width={CAPTURE_WIDTH}
              onLoad={onBaselineLoad}
              // Tailwind preflight sets `img { max-width: 100% }` — without
              // an explicit width here it collapses to its flex parent's
              // shrink-to-fit size instead of the capture's real 1440px.
              style={{ width: CAPTURE_WIDTH, maxWidth: "none", opacity: opacity / 100 }}
              className="pointer-events-none absolute left-0 top-0"
            />
          </div>
        ) : (
          <div className="flex items-start gap-18">
            <div className="flex flex-col gap-8">
              <span className="text-micro uppercase tracking-tight-6 text-mute">Baseline</span>
              <img
                src={screenshotSrc}
                alt={`${entryName} baseline, ${theme} theme`}
                width={CAPTURE_WIDTH}
                onLoad={onBaselineLoad}
                style={{ width: CAPTURE_WIDTH, maxWidth: "none" }}
                className="border border-border-2"
              />
            </div>
            <div className="flex flex-col gap-8">
              <span className="text-micro uppercase tracking-tight-6 text-mute">Live</span>
              <iframe
                key={theme}
                src={liveSrc}
                title={`${entryName} — live`}
                width={CAPTURE_WIDTH}
                height={height}
                className="border border-border-2 bg-bg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
