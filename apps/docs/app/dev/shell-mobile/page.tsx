import { listComponents } from "@lairy/content";
import { shellMainRailItems, shellSectionMeta, shellSubnavGroup } from "@/lib/shell-nav";
import { PhoneShellDemo } from "./phone-shell-demo";

/**
 * The phone shell proposal (LDS-036, docs/prd.md §8.6 D19): one working
 * route showing both candidate layouts (toggle in the harness toolbar) for
 * Cory to review at 390px before anything depends on a phone design.
 *
 * Demonstrates against the real Components section — real nav data from
 * `lib/shell-nav.tsx` (the same helpers the desktop Shell uses), real hrefs,
 * 26 real subnav pages to prove the overlay scrolls. The content below the
 * chrome is a placeholder: this ticket proposes the shell, not a ported
 * page.
 */
export default function ShellMobileDevPage() {
  const meta = shellSectionMeta("components");
  const group = shellSubnavGroup("components");
  const firstComponent = listComponents()[0];

  return (
    <PhoneShellDemo
      items={shellMainRailItems()}
      activeSectionId="components"
      moduleIcon={meta.icon}
      moduleLabel={meta.label}
      group={group}
      activePageId={firstComponent?.meta.id}
    >
      <div className="flex flex-col gap-16">
        <h1 className="font-heading text-heading font-semibold tracking-tight-neg-2 text-fg">
          {firstComponent?.meta.name ?? "Placeholder page"}
        </h1>
        <p className="text-body text-mute">
          Placeholder content for the phone shell proposal (LDS-036) — this route demonstrates the chrome, not a
          ported page. Scroll to check the header stays put, the content area owns the scroll, and the
          {" "}bottom tab bar (recommended) or page edge (alternative) never moves.
        </p>
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} className="text-body text-dim">
            Demo paragraph {i + 1} of 12 — filler to make the content area taller than the viewport, so scrolling
            has something real to do.
          </p>
        ))}
      </div>
    </PhoneShellDemo>
  );
}
