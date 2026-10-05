"use client";

import { useState } from "react";
import { Subnav, type SubnavGroup } from "../subnav";

const GROUPS: SubnavGroup[] = [
  {
    id: "operations",
    label: "Operations",
    count: 4,
    pages: [
      { id: "live-vessels", label: "Live vessels", href: "#live-vessels" },
      { id: "maintenance", label: "Maintenance", href: "#maintenance" },
      { id: "crew-roster", label: "Crew roster", href: "#crew-roster" },
    ],
  },
  {
    id: "research",
    label: "Research",
    count: 2,
    pages: [
      { id: "surveys", label: "Surveys", href: "#surveys" },
      { id: "samples", label: "Samples", href: "#samples" },
    ],
  },
];

export function SubnavDemoExample() {
  const [hidden, setHidden] = useState(false);
  return (
    <div className="overflow-hidden border border-border" style={{ height: 320 }}>
      <Subnav
        label="Fleet"
        groups={GROUPS}
        activeId="live-vessels"
        defaultExpandedId="operations"
        hidden={hidden}
        onHiddenChange={setHidden}
      />
    </div>
  );
}
