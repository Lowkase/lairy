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
  it("exposes list_entries, get_component, suggest_alternative and search_guidelines (docs/prd.md §9)", async () => {
    const client = await connect();
    const { tools } = await client.listTools();
    expect(tools.map((tool) => tool.name).sort()).toEqual([
      "get_component",
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
