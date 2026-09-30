import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { getComponentDetail, getTokens, listEntries, searchGuidelines, suggestAlternative } from "./tools";

function ok(data: unknown): CallToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function failed(error: unknown): CallToolResult {
  const message = error instanceof Error ? error.message : String(error);
  return { content: [{ type: "text", text: message }], isError: true };
}

/**
 * docs/prd.md §9 (v0 tool set — `get_foundation`/`get_pattern` are listed
 * there too, but join once foundation/pattern content entries exist).
 * Stdio transport, reads `packages/content` through `@lairy/content`.
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
        "The full content entry for one component: anatomy, variants, usage, content rules, accessibility notes, token usage, relationships and useInstead rows (resolved to the target's name), every example's source code (read from its file and returned as text), and its real props — extracted from source via react-docgen-typescript and merged with any prop guidance, so the documented API can never disagree with the real one.",
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

  server.registerTool(
    "get_tokens",
    {
      title: "Get tokens",
      description:
        "Every token in the given group (colour, typography, spacing, radius, motion, elevation, icon, breakpoint), or every token when no group is given, with its value(s), use for, never for and rationale. A themeable colour token's value is an object with dark and light values unless a theme is requested, in which case it is resolved to a single value; a non-themeable token's value is always a single value.",
      inputSchema: {
        group: z
          .string()
          .min(1)
          .optional()
          .describe(
            'Restrict to one token group, matched case-insensitively (e.g. "Accent", "Spacing", "Typography — tracking"). Omit to list every token.',
          ),
        theme: z
          .enum(["dark", "light"])
          .optional()
          .describe("Resolve a themeable token's value down to this theme. Omit to get both."),
      },
    },
    ({ group, theme }) => ok(getTokens({ group, theme })),
  );

  return server;
}
