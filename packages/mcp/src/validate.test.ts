import { rules } from "@lairy/eslint-plugin";
import { describe, expect, it } from "vitest";
import { enforceableRules, validate } from "./validate";

const primaries = (code: string) =>
  validate({ code }).filter((v) => v.rule === "callout-single-primary-action");

describe("validate: callout-single-primary-action (#135)", () => {
  describe("no longer misses", () => {
    it("resolves actions={variable} to a same-file array", () => {
      const violations = primaries(`
const actions = [{ label: "A" }, { label: "B", variant: "primary" }];
export const A = () => <Callout tone="info" title="T" actions={actions}>x</Callout>;`);
      expect(violations).toHaveLength(1);
    });

    it("treats a spread as earlier actions, so a later primary is a second", () => {
      const violations = primaries(
        `export const A = (p) => <Callout tone="info" title="T" actions={[...p.actions, { label: "B", variant: "primary" }]}>x</Callout>;`,
      );
      expect(violations).toHaveLength(1);
    });

    it("sees a Callout and a Button imported under another name", () => {
      const violations = primaries(`
import { Callout as C } from "./callout";
import { Button as B } from "./button";
export const A = () => (
  <C tone="info" title="T">
    <B variant="primary">One</B>
    <B variant="primary">Two</B>
  </C>
);`);
      expect(violations).toHaveLength(1);
    });
  });

  describe("no longer over-reports", () => {
    it("does not count a nested Callout's primary against the outer one", () => {
      const violations = primaries(`
export const A = () => (
  <Callout tone="info" title="Outer">
    <Button variant="primary">Outer</Button>
    <Callout tone="info" title="Inner">
      <Button variant="primary">Inner</Button>
    </Callout>
  </Callout>
);`);
      expect(violations).toEqual([]);
    });

    it("counts exclusive ternary branches as one primary", () => {
      const violations = primaries(`
export const A = ({ on }) => (
  <Callout tone="info" title="T">
    {on ? <Button variant="primary">Retry</Button> : <Button variant="primary">Resume</Button>}
  </Callout>
);`);
      expect(violations).toEqual([]);
    });
  });

  it("reports every primary beyond the first, not one per Callout", () => {
    const violations = primaries(`
export const A = () => (
  <Callout tone="info" title="T">
    <Button variant="primary">One</Button>
    <Button variant="primary">Two</Button>
    <Button variant="primary">Three</Button>
  </Callout>
);`);
    expect(violations.map((v) => v.line)).toEqual([5, 6]);
  });

  it("still accepts one primary, and a primary-marked first action", () => {
    expect(
      primaries(
        `export const A = () => <Callout tone="info" title="T" actions={[{ label: "A", variant: "primary" }, { label: "B" }]}>x</Callout>;`,
      ),
    ).toEqual([]);
    expect(
      primaries(
        `export const A = () => <Callout tone="info" title="T"><Button variant="primary">Only</Button></Callout>;`,
      ),
    ).toEqual([]);
  });
});

describe("validate: lint rule coverage (#135)", () => {
  it("every plugin rule is tagged enforceable: lint in content, so validate can report it", () => {
    const tagged = enforceableRules();
    for (const id of Object.keys(rules)) {
      expect(tagged.has(`lint:${id}`), `${id} has no enforceable: lint tag`).toBe(true);
    }
  });
});
