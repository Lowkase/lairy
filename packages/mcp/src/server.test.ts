import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";
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
  it("exposes list_entries, get_component, get_tokens, suggest_alternative and search_guidelines (docs/prd.md §9)", async () => {
    const client = await connect();
    const { tools } = await client.listTools();
    expect(tools.map((tool) => tool.name).sort()).toEqual([
      "get_component",
      "get_tokens",
      "list_entries",
      "search_guidelines",
      "suggest_alternative",
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

    it("filters by section — patterns has no entries yet", async () => {
      const client = await connect();
      const result = await client.callTool({
        name: "list_entries",
        arguments: { section: "patterns" },
      });
      expect(json(result)).toEqual([]);
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
      expect(entry.props.map((p) => p.name).sort()).toEqual(["actions", "children", "title", "tone"]);
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

  describe("get_tokens", () => {
    it("filters by group, case-insensitively", async () => {
      const client = await connect();
      const result = await client.callTool({ name: "get_tokens", arguments: { group: "accent" } });
      const tokens = json<Array<{ name: string; group: string }>>(result);
      expect(tokens.map((t) => t.name).sort()).toEqual(["--accent", "--accent-line", "--accent-soft"]);
      expect(tokens.every((t) => t.group === "Accent")).toBe(true);
    });

    it("returns every token, with use for, never for and rationale, when no group is given", async () => {
      const client = await connect();
      const result = await client.callTool({ name: "get_tokens", arguments: {} });
      const tokens = json<
        Array<{ name: string; useFor: string[]; neverFor: string[]; rationale?: string }>
      >(result);
      expect(tokens).toHaveLength(89);
      const faint = tokens.find((t) => t.name === "--faint");
      expect(faint?.useFor).toContain("Tertiary only — never body.");
      expect(faint?.neverFor.some((n) => n.includes("Body text"))).toBe(true);
    });

    it("keeps a themeable token's value as dark/light when no theme is given", async () => {
      const client = await connect();
      const result = await client.callTool({ name: "get_tokens", arguments: { group: "Accent" } });
      const tokens = json<Array<{ name: string; value: { dark: string; light: string } }>>(result);
      const accent = tokens.find((t) => t.name === "--accent");
      expect(accent?.value).toEqual({ dark: "#f7bd63", light: "#9a6208" });
    });

    it("resolves a themeable token's value to the requested theme", async () => {
      const client = await connect();
      const result = await client.callTool({
        name: "get_tokens",
        arguments: { group: "Accent", theme: "light" },
      });
      const tokens = json<Array<{ name: string; value: string }>>(result);
      const accent = tokens.find((t) => t.name === "--accent");
      expect(accent?.value).toBe("#9a6208");
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
      expect(alarm?.rationale).toContain("a theme should never be able to redefine what broken looks like");
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
      expect(suggestions[0]?.id).toBe("callout");
      expect(suggestions[0]?.reasons.some((r) => r.kind === "often-confused-with")).toBe(true);
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

    const alternative = suggestions[0];
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
  });
});
