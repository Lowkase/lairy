import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { getComponentDetail, listEntries, searchGuidelines, suggestAlternative } from "./tools";

function ok(data: unknown): CallToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function failed(error: unknown): CallToolResult {
  const message = error instanceof Error ? error.message : String(error);
  return { content: [{ type: "text", text: message }], isError: true };
}

/**
 * docs/prd.md §9 (v0 tool set — `get_foundation`/`get_pattern`/`get_tokens`
 * are listed there too, but join once foundation/pattern content entries
 * exist; #8 scopes this server to the four tools its acceptance criteria
 * name). Stdio transport, reads `packages/content` through `@lairy/content`.
 */
export function createServer(): McpServer {
  const server = new McpServer(
    { name: "lairy", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.registerTool(
    "list_entries",
    {
      title: "List catalogue entries",
      description:
        "Foundations, components and patterns in the Lairy catalogue, with status and a one-line purpose. Optionally filtered by section.",
      inputSchema: {
        section: z
          .enum(["foundations", "components", "patterns"])
          .optional()
          .describe("Restrict the list to one section. Omit to list every entry."),
      },
    },
    ({ section }) => ok(listEntries({ section })),
  );

  server.registerTool(
    "get_component",
    {
      title: "Get a component entry",
      description:
        "The full content entry for one component: anatomy, variants, usage, content rules, accessibility notes, token usage, relationships and useInstead rows (resolved to the target's name), and every example's source code, read from its file and returned as text.",
      inputSchema: {
        id: z.string().min(1).describe('The component\'s id, e.g. "callout".'),
      },
    },
    ({ id }) => {
      try {
        return ok(getComponentDetail({ id }));
      } catch (error) {
        return failed(error);
      }
    },
  );

  server.registerTool(
    "suggest_alternative",
    {
      title: "Suggest an alternative to a component",
      description:
        "Given a component under consideration and the situation it would be used for, traverses that component's relationships and useInstead rows (in both directions) to surface every other entry connected to it, with the content's own reasoning text for the connection. Use this to answer \"why not X?\" questions.",
      inputSchema: {
        component: z.string().min(1).describe('The component id being considered, e.g. "toast".'),
        situation: z
          .string()
          .min(1)
          .describe("What the message or UI needs to do. Used to order multiple candidates."),
      },
    },
    ({ component, situation }) => {
      try {
        return ok(suggestAlternative({ component, situation }));
      } catch (error) {
        return failed(error);
      }
    },
  );

  server.registerTool(
    "search_guidelines",
    {
      title: "Search guidelines",
      description:
        "Full-text search across every component's content rules, usage guidance, accessibility notes and relationship text. Returns entry ids and the matching text, ranked by relevance.",
      inputSchema: {
        query: z.string().min(1).describe('Free text, e.g. "export failed" or "toast".'),
      },
    },
    ({ query }) => ok(searchGuidelines({ query })),
  );

  return server;
}
