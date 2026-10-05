"use client";

import { useState } from "react";
import { Glyph } from "../../icons/glyph";
import { MainRail, type MainRailItem } from "../main-rail";

const ITEMS: MainRailItem[] = [
  { id: "launcher", label: "Launcher", icon: <Glyph name="apps" size="rail" />, href: "#launcher" },
  { id: "fleet", label: "Fleet", icon: <Glyph name="grid" size="rail" />, href: "#fleet" },
  { id: "research", label: "Research", icon: <Glyph name="book" size="rail" />, href: "#research" },
];

/** Good: collapsed keeps every item, in the same order, at the same height. */
export function MainRailGoodCollapsedKeepsItemsExample() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="overflow-hidden border border-border" style={{ height: 240 }}>
      <MainRail
        items={ITEMS}
        activeId="fleet"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        navLabel="Main (collapsed example)"
      />
    </div>
  );
}
