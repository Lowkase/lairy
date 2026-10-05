"use client";

import { useState } from "react";
import { Glyph } from "../../icons/glyph";
import { Header } from "../header";

export function HeaderDemoExample() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  return (
    <div className="border border-border">
      <Header
        moduleIcon={<Glyph name="grid" size="rail" />}
        moduleLabel="Components"
        moduleCode="SYS·02"
        date="WED 23 AUG 2026"
        time="14:02:07"
        identityLabel="Appearance"
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}
