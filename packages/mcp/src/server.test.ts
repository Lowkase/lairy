import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { listTokens } from "@lairy/content";
import { describe, expect, it } from "vitest";
import { createServer } from "./server";

/** Links a fresh server to a fresh client over an in-memory transport, per
 * the ticket's "an in-memory MCP client calls each tool" (#8). No process,
 * no stdio — this is `src/stdio.ts`'s job at runtime, not the tests'. Wraps
 * `callTool` with the plain (non-task) result schema so callers get back
 * `{ content }` rather than the task-polling union. */
async function connect() {
  const server = createServer();
  const client = new Client({ name: "test-client", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);
  return {
    listTools: () => client.listTools(),
    // The SDK's `callTool` return type is a union with a task-polling shape
    // regardless of which resultSchema is passed — this server declares no
    // tasks, so the plain `{ content }` shape is the only one it ever sends.
    callTool: async (params: { name: string; arguments?: Record<string, unknown> }) => {
      const result = await client.callTool(params, CallToolResultSchema);
      return result as { content: Array<{ type: string; text?: string }>; isError?: boolean };
    },
  };
}

function json<T>(result: { content: Array<{ type: string; text?: string }> }): T {
  const [block] = result.content;
  if (!block || block.type !== "text" || typeof block.text !== "string") {
    throw new Error("Expected a text tool result.");
  }
  return JSON.parse(block.text) as T;
}

describe("MCP server (seam 2: tool surface)", () => {
  it("exposes list_entries, get_component, get_foundation, get_tokens, suggest_alternative, search_guidelines and validate (docs/prd.md §9)", async () => {
    const client = await connect();
    const { tools } = await client.listTools();
    expect(tools.map((tool) => tool.name).sort()).toEqual([
      "get_component",
      "get_foundation",
      "get_tokens",
      "list_entries",
      "search_guidelines",
      "suggest_alternative",
      "validate",
    ]);
  });

  describe("list_entries", () => {
    it("lists every component with status and purpose", async () => {
      const client = await connect();
      const result = await client.callTool({ name: "list_entries", arguments: {} });
      const entries = json<Array<{ id: string; status: string; purpose: string }>>(result);
      const callout = entries.find((entry) => entry.id === "callout");
      expect(callout).toMatchObject({
        status: "stable",
        purpose: "Reports a standing condition inside the panel or flow it belongs to.",
      });
    });

    it("lists foundations too, using description.summary as purpose (LDS-014)", async () => {
      const client = await connect();
      const result = await client.callTool({
        name: "list_entries",
        arguments: { section: "foundations" },
      });
      const entries = json<Array<{ id: string; status: string; purpose: string }>>(result);
      const color = entries.find((entry) => entry.id === "color");
      expect(color).toMatchObject({
        status: "stable",
        purpose: "Colour in this system is a rank, not a palette.",
      });
    });

    it("filters by section — patterns has no entries yet", async () => {
      const client = await connect();
      const result = await client.callTool({
        name: "list_entries",
        arguments: { section: "patterns" },
      });
      expect(json(result)).toEqual([]);
    });
  });

  describe("get_foundation", () => {
    it("returns Color's scales with their tokens and resolves relationship targets to names", async () => {
      const client = await connect();
      const result = await client.callTool({ name: "get_foundation", arguments: { id: "color" } });
      const entry = json<{
        scales: Array<{ name: string; tokens: string[] }>;
        relationships: Array<{ target: string; targetName: string }>;
      }>(result);
      const amber = entry.scales.find((s) => s.name === "Amber");
      expect(amber?.tokens).toEqual(["accent", "accent-soft", "accent-line"]);
      expect(entry.relationships.find((r) => r.target === "typography")?.targetName).toBe(
        "Typography",
      );
    });

    it("errors for an id that doesn't exist in the catalogue", async () => {
      const client = await connect();
      const result = await client.callTool({
        name: "get_foundation",
        arguments: { id: "does-not-exist" },
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("get_component", () => {
    it("returns example sources as text, by id", async () => {
      const client = await connect();
      const result = await client.callTool({ name: "get_component", arguments: { id: "callout" } });
      const entry = json<{ examples: Array<{ id: string; sourceText: string }> }>(result);
      const info = entry.examples.find((example) => example.id === "info");
      expect(info?.sourceText).toContain('<Callout tone="info"');
    });

    it("includes Callout's real props, extracted from source and merged with propGuidance", async () => {
      const client = await connect();
      const result = await client.callTool({ name: "get_component", arguments: { id: "callout" } });
      const entry = json<{
        props: Array<{ name: string; type: string; required: boolean; guidance?: string }>;
      }>(result);
      expect(entry.props.map((p) => p.name).sort()).toEqual([
        "actions",
        "children",
        "title",
        "tone",
      ]);
      const tone = entry.props.find((p) => p.name === "tone");
      expect(tone?.required).toBe(true);
      expect(tone?.guidance).toContain("Match the tone to the state");
    });

    it("resolves relationship targets to names", async () => {
      const client = await connect();
      const result = await client.callTool({ name: "get_component", arguments: { id: "callout" } });
      const entry = json<{ relationships: Array<{ target: string; targetName: string }> }>(result);
      expect(entry.relationships.find((r) => r.target === "toast")?.targetName).toBe("Toast");
    });

    it("resolves useInstead targets to names", async () => {
      const client = await connect();
      const result = await client.callTool({ name: "get_component", arguments: { id: "callout" } });
      const entry = json<{ usage: { useInstead: Array<{ target: string; targetName: string }> } }>(
        result,
      );
      expect(entry.usage.useInstead.find((u) => u.target === "modal")?.targetName).toBe("Modal");
    });

    it("errors for an id that doesn't exist in the catalogue", async () => {
      const client = await connect();
      const result = await client.callTool({
        name: "get_component",
        arguments: { id: "does-not-exist" },
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("search_guidelines", () => {
    it("finds Callout's content rule for an export-failed message", async () => {
      const client = await connect();
      const result = await client.callTool({
        name: "search_guidelines",
        arguments: { query: "export failed" },
      });
      const matches =
        json<Array<{ id: string; matches: Array<{ field: string; text: string }> }>>(result);
      expect(matches[0]?.id).toBe("callout");
      expect(matches[0]?.matches.some((m) => m.text.includes("Export failed"))).toBe(true);
    });
  });

  describe("search_guidelines whole-word matching (#118)", () => {
    it("does not match a query word that is only a substring of another word", async () => {
      const client = await connect();
      const matches = json<Array<{ matches: Array<{ text: string }> }>>(
        await client.callTool({ name: "search_guidelines", arguments: { query: "act" } }),
      );
      // Every hit must contain "act" (or "acts") as a whole word, never just
      // inside "action", "activity", "actions" and the like.
      for (const entry of matches) {
        for (const field of entry.matches) {
          expect(field.text.toLowerCase()).toMatch(/\bacts?\b/);
        }
      }
    });

    it("still matches across singular and plural", async () => {
      const client = await connect();
      const singular = json<Array<{ id: string }>>(
        await client.callTool({ name: "search_guidelines", arguments: { query: "toast" } }),
      );
      const plural = json<Array<{ id: string }>>(
        await client.callTool({ name: "search_guidelines", arguments: { query: "toasts" } }),
      );
      expect(singular.length).toBeGreaterThan(0);
      expect(plural.map((m) => m.id)).toEqual(singular.map((m) => m.id));
    });
  });

  describe("get_tokens", () => {
    it("filters by group, case-insensitively", async () => {
      const client = await connect();
      const result = await client.callTool({ name: "get_tokens", arguments: { group: "accent" } });
      const tokens = json<Array<{ name: string; group: string }>>(result);
      expect(tokens.map((t) => t.name).sort()).toEqual([
        "--accent",
        "--accent-line",
        "--accent-soft",
      ]);
      expect(tokens.every((t) => t.group === "Accent")).toBe(true);
    });

    it("returns every token, with use for, never for and rationale, when no group is given", async () => {
      const client = await connect();
      const result = await client.callTool({ name: "get_tokens", arguments: {} });
      const tokens =
        json<Array<{ name: string; useFor: string[]; neverFor: string[]; rationale?: string }>>(
          result,
        );
      // Derived from the catalogue, not hardcoded: a literal count went stale
      // every time a token was added (issues #80, #86, #89, #93, #97, #107, #108).
      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens).toHaveLength(listTokens().length);
      const faint = tokens.find((t) => t.name === "--faint");
      expect(faint?.useFor).toContain("Tertiary only — never body.");
      expect(faint?.neverFor.some((n) => n.includes("Body text"))).toBe(true);
    });

    it("keeps a themeable token's value as dark/light when no theme is given", async () => {
      const client = await connect();
      const result = await client.callTool({ name: "get_tokens", arguments: { group: "Accent" } });
      const tokens = json<Array<{ name: string; value: { dark: string; light: string } }>>(result);
      const accent = tokens.find((t) => t.name === "--accent");
      expect(accent?.value).toEqual({ dark: "#f7bd63", light: "#8f5c07" });
    });

    it("resolves a themeable token's value to the requested theme", async () => {
      const client = await connect();
      const result = await client.callTool({
        name: "get_tokens",
        arguments: { group: "Accent", theme: "light" },
      });
      const tokens = json<Array<{ name: string; value: string }>>(result);
      const accent = tokens.find((t) => t.name === "--accent");
      expect(accent?.value).toBe("#8f5c07");
    });

    it("leaves a non-themeable token's single value alone even when a theme is requested", async () => {
      const client = await connect();
      const result = await client.callTool({
        name: "get_tokens",
        arguments: { group: "Alarm", theme: "dark" },
      });
      const tokens = json<Array<{ name: string; value: string; rationale: string }>>(result);
      const alarm = tokens.find((t) => t.name === "--alarm");
      expect(alarm?.value).toBe("#ff8f6b");
      expect(alarm?.rationale).toContain(
        "a theme should never be able to redefine what broken looks like",
      );
    });
  });

  describe("suggest_alternative", () => {
    it("surfaces Callout as Toast's standing-condition counterpart", async () => {
      const client = await connect();
      const result = await client.callTool({
        name: "suggest_alternative",
        arguments: {
          component: "toast",
          situation: "A message that should stay until the operator acts on it.",
        },
      });
      const { suggestions } = json<{
        suggestions: Array<{ id: string; reasons: Array<{ kind: string; text: string }> }>;
      }>(result);
      const callout = suggestions.find((s) => s.id === "callout");
      expect(callout?.reasons.some((r) => r.kind === "often-confused-with")).toBe(true);
    });

    it("orders candidates by directness then name, ignoring the situation text (#108)", async () => {
      const client = await connect();
      const call = async (situation: string) =>
        json<{
          situation: string;
          suggestions: Array<{ id: string; name: string; reasons: Array<{ kind: string }> }>;
        }>(
          await client.callTool({
            name: "suggest_alternative",
            arguments: { component: "toast", situation },
          }),
        );

      const a = await call("A message that should stay until the operator acts on it.");
      const b = await call("Confirm a save that just finished.");

      expect(a.suggestions.map((s) => s.id)).toEqual(b.suggestions.map((s) => s.id));
      expect(b.situation).toBe("Confirm a save that just finished.");

      const direct = (s: { reasons: Array<{ kind: string }> }) =>
        s.reasons.some((r) => r.kind === "use-instead");
      const flags = a.suggestions.map((s) => (direct(s) ? 0 : 1));
      expect(flags).toEqual([...flags].sort());
      const names = a.suggestions.filter(direct).map((s) => s.name);
      expect(names).toEqual([...names].sort((x, y) => x.localeCompare(y)));
    });

    it("errors for a component that doesn't exist", async () => {
      const client = await connect();
      const result = await client.callTool({
        name: "suggest_alternative",
        arguments: { component: "does-not-exist", situation: "anything" },
      });
      expect(result.isError).toBe(true);
    });
  });

  // docs/prd.md §13 / AGENTS.md: "Claude Code, connected to the MCP server,
  // can answer 'what should I use to tell someone an export failed, and why
  // not a toast?' from content alone." This assembles that answer from
  // nothing but tool output — no reaching into @lairy/content directly.
  it("answers the PRD §13 question — export failed, why not a toast — from tool output alone", async () => {
    const client = await connect();

    const { suggestions } = json<{
      suggestions: Array<{
        id: string;
        name: string;
        boundary?: string;
        reasons: Array<{ text: string }>;
      }>;
    }>(
      await client.callTool({
        name: "suggest_alternative",
        arguments: {
          component: "toast",
          situation:
            "Tell an operator their export failed; it should stay visible until they act on it.",
        },
      }),
    );

    // Found by id, not position: the order is deterministic but says nothing
    // about fit (see the ordering test below), and the PRD §13 line only
    // requires that the answer is present in the tool output.
    const alternative = suggestions.find((s) => s.id === "callout");
    expect(alternative?.id).toBe("callout");
    expect(alternative?.name).toBe("Callout");
    // Why not a toast: Toast leaves on its own; the condition here is still true.
    expect(alternative?.boundary).toContain("persistent counterpart");
    expect(
      alternative?.reasons.some((r) => r.text.includes("gone in a few seconds on its own")),
    ).toBe(true);

    const entry = json<{ contentRules: Array<{ text: string }> }>(
      await client.callTool({ name: "get_component", arguments: { id: "callout" } }),
    );
    // What to use instead, and how to write it.
    expect(entry.contentRules.some((rule) => rule.text.includes('"Export failed"'))).toBe(true);

    // Why not a toast, from Toast's own entry rather than the neighbour's.
    const toast = json<{ description: { boundary: string }; variants: Array<{ name: string }> }>(
      await client.callTool({ name: "get_component", arguments: { id: "toast" } }),
    );
    expect(toast.description.boundary).toContain("gone in 3.2 seconds");
    expect(toast.variants.map((v) => v.name)).toEqual(["Success", "Fail", "Info", "Neutral"]);
  });

  describe("validate", () => {
    const run = async (code: string) => {
      const client = await connect();
      const result = await client.callTool({ name: "validate", arguments: { code } });
      return json<
        Array<{ rule: string; kind: string; ruleText: string; entryId: string; line: number }>
      >(result);
    };

    it("passes a clean snippet", async () => {
      expect(
        await run(`export const A = () => <div className="p-8 text-small bg-panel" />;`),
      ).toEqual([]);
    });

    it("catches a hard-coded colour, with the rule text and owning entry", async () => {
      const [violation, ...rest] = await run(
        `export const A = () => <div style={{ color: "#ff0000" }} />;`,
      );
      expect(rest).toEqual([]);
      expect(violation).toMatchObject({
        rule: "no-hardcoded-color",
        kind: "lint",
        entryId: "color",
        line: 1,
      });
      expect(violation?.ruleText.length).toBeGreaterThan(0);
    });

    it("catches an off-scale size", async () => {
      const violations = await run(`export const A = () => <p style={{ fontSize: "10.5px" }} />;`);
      expect(violations.map((v) => v.rule)).toContain("no-off-scale-size");
      expect(violations.find((v) => v.rule === "no-off-scale-size")?.entryId).toBe("typography");
    });

    it("catches a second primary action in a Callout", async () => {
      const violations = await run(`
export const A = () => (
  <Callout tone="warning" title="Approaching rate limit">
    Body.
    <Button variant="primary">Upgrade</Button>
    <Button variant="primary">Contact sales</Button>
  </Callout>
);`);
      expect(violations).toHaveLength(1);
      expect(violations[0]).toMatchObject({
        rule: "callout-single-primary-action",
        kind: "validator",
        entryId: "callout",
      });
      expect(violations[0]?.ruleText).toMatch(/At most one action reads as primary/);
    });

    it("catches a later action marked primary, and accepts the documented shape", async () => {
      const bad = await run(
        `export const A = () => <Callout tone="info" title="T" actions={[{ label: "A" }, { label: "B", variant: "primary" }]}>x</Callout>;`,
      );
      expect(bad.map((v) => v.rule)).toEqual(["callout-single-primary-action"]);
      const good = await run(
        `export const A = () => <Callout tone="info" title="T" actions={[{ label: "A" }, { label: "B" }]}>x</Callout>;`,
      );
      expect(good).toEqual([]);
    });

    it("reports an unparseable snippet as an error", async () => {
      const client = await connect();
      const result = await client.callTool({ name: "validate", arguments: { code: "const = ;" } });
      expect(result.isError).toBe(true);
    });
  });
});
