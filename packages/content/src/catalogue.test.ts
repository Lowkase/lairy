import { describe, expect, it } from "vitest";
import { ComponentEntrySchema } from "./schema/component";
import { FoundationEntrySchema } from "./schema/foundation";
import { TokenEntrySchema } from "./schema/token";
import {
  getComponent,
  getComponentProps,
  getFoundation,
  getToken,
  listComponents,
  listFoundations,
  listTokens,
  validateCatalogue,
  validateFoundationCatalogue,
  validateTokenCatalogue,
} from "./catalogue";

const validEntry = {
  meta: {
    id: "sample",
    name: "Sample",
    section: "components" as const,
    status: "draft" as const,
    version: "0.1.0",
    updated: "2026-09-29",
  },
  purpose: "A sample entry for schema tests.",
};

describe("content validation (seam 1: content model)", () => {
  it("parses a minimal valid entry", () => {
    expect(() => ComponentEntrySchema.parse(validEntry)).not.toThrow();
  });

  it("fails the build on a missing required field", () => {
    const withoutPurpose: Record<string, unknown> = { meta: validEntry.meta };
    expect(() => ComponentEntrySchema.parse(withoutPurpose)).toThrow();
  });

  it("fails the build on an unknown token name", () => {
    expect(() =>
      ComponentEntrySchema.parse({
        ...validEntry,
        variants: [{ name: "Info", tokens: ["not-a-real-token"], description: "x" }],
      }),
    ).toThrow();
  });

  it("fails the build on an invalid status", () => {
    expect(() =>
      ComponentEntrySchema.parse({
        ...validEntry,
        meta: { ...validEntry.meta, status: "in-progress" },
      }),
    ).toThrow();
  });

  it("fails the build on a non-kebab-case id", () => {
    expect(() =>
      ComponentEntrySchema.parse({
        ...validEntry,
        meta: { ...validEntry.meta, id: "Sample_Entry" },
      }),
    ).toThrow();
  });

  it("requires a rationale for a non-themeable token entry, via TokenEntrySchema", async () => {
    const { TokenEntrySchema } = await import("./schema/token");
    expect(() =>
      TokenEntrySchema.parse({
        name: "--alarm",
        group: "alarm",
        value: "#ff8f6b",
        themeable: false,
        useFor: ["Broken or failed states"],
      }),
    ).toThrow(/rationale/);
  });

  it("passes when a non-themeable token entry has a rationale", async () => {
    const { TokenEntrySchema } = await import("./schema/token");
    expect(() =>
      TokenEntrySchema.parse({
        name: "--alarm",
        group: "alarm",
        value: "#ff8f6b",
        themeable: false,
        useFor: ["Broken or failed states"],
        rationale: "No theme may redefine what \"broken\" looks like (ADR-0007).",
      }),
    ).not.toThrow();
  });
});

describe("catalogue (duplicate ids and dangling relationship targets)", () => {
  it("throws on a duplicate entry id", () => {
    const entries = [ComponentEntrySchema.parse(validEntry), ComponentEntrySchema.parse(validEntry)];
    expect(() => validateCatalogue(entries)).toThrow(/duplicate entry id/);
  });

  it("throws when a relationship targets an entry that doesn't exist", () => {
    const withDanglingRelationship = ComponentEntrySchema.parse({
      ...validEntry,
      relationships: [{ target: "does-not-exist", kind: "alternative", text: "x" }],
    });
    expect(() => validateCatalogue([withDanglingRelationship])).toThrow(/relationship targeting unknown entry/);
  });

  it("throws when a useInstead row targets an entry that doesn't exist", () => {
    const withDanglingUseInstead = ComponentEntrySchema.parse({
      ...validEntry,
      usage: { useWhen: [], useInstead: [{ target: "does-not-exist", text: "x" }] },
    });
    expect(() => validateCatalogue([withDanglingUseInstead])).toThrow(/useInstead row targeting unknown entry/);
  });

  it("passes when every relationship target is present in the same set of entries", () => {
    const a = ComponentEntrySchema.parse({
      ...validEntry,
      meta: { ...validEntry.meta, id: "entry-a" },
      relationships: [{ target: "entry-b", kind: "alternative", text: "x" }],
    });
    const b = ComponentEntrySchema.parse({ ...validEntry, meta: { ...validEntry.meta, id: "entry-b" } });
    expect(() => validateCatalogue([a, b])).not.toThrow();
  });

  it("the real catalogue is internally valid: every relationship and useInstead target resolves", () => {
    const entries = listComponents();
    const ids = new Set(entries.map((e) => e.meta.id));
    for (const entry of entries) {
      for (const relationship of entry.relationships) {
        expect(ids.has(relationship.target)).toBe(true);
      }
      for (const useInstead of entry.usage.useInstead) {
        expect(ids.has(useInstead.target)).toBe(true);
      }
    }
  });

  it("the real catalogue has no duplicate ids", () => {
    const entries = listComponents();
    const ids = entries.map((e) => e.meta.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("getComponent resolves the real Callout entry", () => {
    const entry = getComponent("callout");
    expect(entry?.meta.status).toBe("stable");
    expect(entry?.relationships).toHaveLength(4);
  });

  it("Toast exists as a draft stub, linked from Callout as often-confused-with", () => {
    const toast = getComponent("toast");
    expect(toast?.meta.status).toBe("draft");
    const callout = getComponent("callout");
    const relationship = callout?.relationships.find((r) => r.target === "toast");
    expect(relationship?.kind).toBe("often-confused-with");
    expect(relationship?.text).toBeTruthy();
  });
});

describe("foundation catalogue (LDS-014)", () => {
  const validFoundation = {
    meta: {
      id: "sample-foundation",
      name: "Sample foundation",
      section: "foundations" as const,
      status: "draft" as const,
      version: "0.1.0",
      updated: "2026-09-29",
    },
    description: { summary: "A sample.", boundary: "A sample boundary." },
  };

  it("throws on a duplicate foundation id", () => {
    const entries = [FoundationEntrySchema.parse(validFoundation), FoundationEntrySchema.parse(validFoundation)];
    expect(() => validateFoundationCatalogue(entries)).toThrow(/duplicate entry id/);
  });

  it("throws when a foundation relationship targets an entry that doesn't exist", () => {
    const withDanglingRelationship = FoundationEntrySchema.parse({
      ...validFoundation,
      relationships: [{ target: "does-not-exist", kind: "contrasts-with", text: "x" }],
    });
    expect(() => validateFoundationCatalogue([withDanglingRelationship])).toThrow(
      /relationship targeting unknown entry/,
    );
  });

  it("passes when every foundation relationship target is present in the same set of entries", () => {
    const a = FoundationEntrySchema.parse({
      ...validFoundation,
      meta: { ...validFoundation.meta, id: "foundation-a" },
      relationships: [{ target: "foundation-b", kind: "contrasts-with", text: "x" }],
    });
    const b = FoundationEntrySchema.parse({
      ...validFoundation,
      meta: { ...validFoundation.meta, id: "foundation-b" },
    });
    expect(() => validateFoundationCatalogue([a, b])).not.toThrow();
  });

  it("the real foundation catalogue is internally valid: every relationship target resolves", () => {
    const entries = listFoundations();
    const ids = new Set(entries.map((e) => e.meta.id));
    for (const entry of entries) {
      for (const relationship of entry.relationships) {
        expect(ids.has(relationship.target)).toBe(true);
      }
    }
  });

  it("getFoundation resolves the real Color entry, stable with its three relationships", () => {
    const entry = getFoundation("color");
    expect(entry?.meta.status).toBe("stable");
    expect(entry?.relationships).toHaveLength(3);
    expect(entry?.scales).toHaveLength(7);
  });

  it("Typography, Elevation and Accessibility exist as draft stubs for Color's relationships", () => {
    for (const id of ["typography", "elevation", "accessibility"]) {
      const stub = getFoundation(id);
      expect(stub?.meta.status).toBe("draft");
    }
    const color = getFoundation("color");
    for (const target of ["typography", "elevation", "accessibility"]) {
      expect(color?.relationships.some((r) => r.target === target)).toBe(true);
    }
  });
});

describe("props extraction (LDS-009)", () => {
  it("fails the build when propGuidance names a prop the extracted API doesn't have", () => {
    const withBadGuidance = ComponentEntrySchema.parse({
      ...validEntry,
      meta: { ...validEntry.meta, id: "callout" },
      propGuidance: [{ prop: "notARealProp", note: "x" }],
    });
    expect(() => validateCatalogue([withBadGuidance])).toThrow(/propGuidance names unknown prop/);
  });

  it("passes when propGuidance names a prop the extracted API really has", () => {
    const withRealGuidance = ComponentEntrySchema.parse({
      ...validEntry,
      meta: { ...validEntry.meta, id: "callout" },
      propGuidance: [{ prop: "tone", note: "x" }],
    });
    expect(() => validateCatalogue([withRealGuidance])).not.toThrow();
  });

  it("skips the propGuidance check for a component with no ui implementation yet", () => {
    const draftWithGuidance = ComponentEntrySchema.parse({
      ...validEntry,
      propGuidance: [{ prop: "whatever", note: "x" }],
    });
    expect(() => validateCatalogue([draftWithGuidance])).not.toThrow();
  });

  it("getComponentProps extracts Callout's real props, merged with its propGuidance", () => {
    const props = getComponentProps("callout");
    expect(props?.map((p) => p.name).sort()).toEqual(["actions", "children", "title", "tone"]);
    const tone = props?.find((p) => p.name === "tone");
    expect(tone?.required).toBe(true);
    expect(tone?.guidance).toContain("Match the tone to the state");
  });

  it("getComponentProps is undefined for a draft component with no ui implementation", () => {
    expect(getComponentProps("toast")).toBeUndefined();
  });
});

describe("token catalogue (LDS-013)", () => {
  const validToken = {
    name: "--sample",
    group: "Sample",
    value: "1px",
    themeable: false,
    useFor: ["A sample entry for catalogue tests."],
    rationale: "Not a colour, so it has no theme axis to vary.",
  };

  it("throws on a duplicate token name", () => {
    const entries = [TokenEntrySchema.parse(validToken), TokenEntrySchema.parse(validToken)];
    expect(() => validateTokenCatalogue(entries)).toThrow(/duplicate token name/);
  });

  it("passes when every token name is unique", () => {
    const other = TokenEntrySchema.parse({ ...validToken, name: "--sample-2" });
    expect(() => validateTokenCatalogue([TokenEntrySchema.parse(validToken), other])).not.toThrow();
  });

  it("the real token catalogue has no duplicate names", () => {
    const names = listTokens().map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("the real token catalogue covers every token exported by @lairy/tokens", () => {
    // 17 colour + 4 alarm + 33 typography (2 family + 2 weight + 10 size +
    // 10 leading + 9 tracking) + 9 spacing + 2 radius + 1 icon + 7 motion
    // (3 easing + 4 duration) + 13 elevation (8 shadow + 5 z-index) +
    // 3 breakpoint = 89 (docs/prd.md §7.2, #15 acceptance criterion 1).
    expect(listTokens()).toHaveLength(89);
  });

  it("getToken resolves a real colour token by its CSS variable name", () => {
    const accent = getToken("--accent");
    expect(accent?.group).toBe("Accent");
    expect(accent?.themeable).toBe(true);
    expect(accent?.value).toEqual({ dark: "#f7bd63", light: "#9a6208" });
  });

  it("every non-themeable token carries a rationale", () => {
    for (const token of listTokens()) {
      if (!token.themeable) {
        expect(token.rationale, `${token.name} is non-themeable and needs a rationale`).toBeTruthy();
      }
    }
  });

  it("Alarm entries carry the prototype's rationale verbatim", () => {
    const alarmTokens = listTokens().filter((t) => t.group === "Alarm");
    expect(alarmTokens).toHaveLength(4);
    for (const token of alarmTokens) {
      expect(token.rationale).toContain(
        "Failure, and only failure. It is written literally rather than tokenised on purpose",
      );
      expect(token.rationale).toContain(
        "a theme should never be able to redefine what broken looks like, and nothing should be able to borrow the colour by accident.",
      );
    }
  });
});
