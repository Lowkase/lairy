import { describe, expect, it } from "vitest";
import { ComponentEntrySchema } from "./schema/component";
import { getComponent, getComponentProps, listComponents, validateCatalogue } from "./catalogue";

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
