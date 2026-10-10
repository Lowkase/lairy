import { Linter } from "eslint";
import tseslint from "typescript-eslint";
import ts from "typescript";
import { listComponents, listFoundations, listPatterns, type Rule } from "@lairy/content";
import { plugin, rules as lintRuleModules } from "@lairy/eslint-plugin";

export interface Violation {
  /** The `enforceable.id` of the rule that was broken. */
  rule: string;
  kind: "lint" | "validator";
  /** The content rule's own sentence (docs/prd.md D6). */
  ruleText: string;
  /** Id of the catalogue entry that owns the rule. */
  entryId: string;
  message: string;
  line: number;
  column: number;
}

interface OwnedRule {
  entryId: string;
  rule: Rule;
}

/** Every content rule tagged `enforceable`, by kind and id, with its owning entry. */
function enforceableRules(): Map<string, OwnedRule> {
  const found = new Map<string, OwnedRule>();
  const add = (entryId: string, rules: Rule[]) => {
    for (const rule of rules) {
      if (rule.enforceable)
        found.set(`${rule.enforceable.kind}:${rule.enforceable.id}`, { entryId, rule });
    }
  };
  for (const entry of listFoundations()) add(entry.meta.id, entry.principles);
  for (const entry of listComponents()) add(entry.meta.id, entry.contentRules);
  for (const entry of listPatterns()) add(entry.meta.id, entry.rules);
  return found;
}

type Check = (source: ts.SourceFile) => Array<{ node: ts.Node; message: string }>;

function jsxName(node: ts.JsxOpeningLikeElement): string {
  return node.tagName.getText();
}

function stringAttribute(node: ts.JsxOpeningLikeElement, name: string): string | undefined {
  for (const attr of node.attributes.properties) {
    if (!ts.isJsxAttribute(attr) || attr.name.getText() !== name) continue;
    const init = attr.initializer;
    if (init && ts.isStringLiteral(init)) return init.text;
    if (
      init &&
      ts.isJsxExpression(init) &&
      init.expression &&
      ts.isStringLiteralLike(init.expression)
    ) {
      return init.expression.text;
    }
  }
  return undefined;
}

function isPrimaryProperty(node: ts.Node): boolean {
  return (
    ts.isPropertyAssignment(node) &&
    node.name.getText() === "variant" &&
    ts.isStringLiteralLike(node.initializer) &&
    node.initializer.text === "primary"
  );
}

/** Callout Content rule 4: the first action is implicitly primary, so a
 * second primary — an explicit `variant: "primary"` on a later action, or any
 * `<Button variant="primary">` placed in the callout — is a violation. */
const calloutSinglePrimaryAction: Check = (source) => {
  const out: ReturnType<Check> = [];

  const inspect = (callout: ts.JsxElement | ts.JsxSelfClosingElement) => {
    const opening = ts.isJsxElement(callout) ? callout.openingElement : callout;
    const primaries: ts.Node[] = [];
    let implicit = 0;

    for (const attr of opening.attributes.properties) {
      if (!ts.isJsxAttribute(attr) || attr.name.getText() !== "actions") continue;
      const expr =
        attr.initializer && ts.isJsxExpression(attr.initializer)
          ? attr.initializer.expression
          : undefined;
      if (expr && ts.isArrayLiteralExpression(expr)) {
        implicit = expr.elements.length > 0 ? 1 : 0;
        expr.elements.forEach((element, index) => {
          if (!ts.isObjectLiteralExpression(element)) return;
          const marked = element.properties.find(isPrimaryProperty);
          if (marked && index > 0) primaries.push(marked);
        });
      }
    }

    const visit = (node: ts.Node) => {
      if (
        (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
        jsxName(node) === "Button" &&
        stringAttribute(node, "variant") === "primary"
      ) {
        primaries.push(node);
      }
      ts.forEachChild(node, visit);
    };
    if (ts.isJsxElement(callout)) callout.children.forEach(visit);

    if (implicit + primaries.length > 1) {
      out.push({
        node: primaries[0] ?? opening,
        message: "This Callout has more than one primary action.",
      });
    }
  };

  const walk = (node: ts.Node) => {
    if (
      (ts.isJsxElement(node) && jsxName(node.openingElement) === "Callout") ||
      (ts.isJsxSelfClosingElement(node) && jsxName(node) === "Callout")
    ) {
      inspect(node);
    }
    ts.forEachChild(node, walk);
  };
  walk(source);
  return out;
};

/** Keyed by the `enforceable.id` tagged on the content rule each one checks. */
const validators: Record<string, Check> = {
  "callout-single-primary-action": calloutSinglePrimaryAction,
};

const LINT_PREFIX = "lairy/";

/**
 * docs/prd.md §9 `validate({ code })`: runs the Lairy lint rules and the
 * `enforceable: validator` checks against a TSX snippet and returns each
 * violation with its rule text and the id of the entry that owns the rule.
 * A snippet that does not parse is reported as an error, not as violations.
 */
export function validate(input: { code: string }): Violation[] {
  const owned = enforceableRules();
  const violations: Violation[] = [];

  const linter = new Linter();
  const messages = linter.verify(
    input.code,
    [
      {
        files: ["**/*.tsx"],
        languageOptions: {
          parser: tseslint.parser,
          parserOptions: { ecmaFeatures: { jsx: true } },
        },
        plugins: { lairy: plugin },
        rules: Object.fromEntries(
          Object.keys(lintRuleModules).map((id) => [`${LINT_PREFIX}${id}`, "error"]),
        ),
      },
    ],
    "snippet.tsx",
  );

  for (const message of messages) {
    if (message.fatal) throw new Error(`Could not parse the snippet: ${message.message}`);
    const id = message.ruleId?.startsWith(LINT_PREFIX)
      ? message.ruleId.slice(LINT_PREFIX.length)
      : undefined;
    const match = id ? owned.get(`lint:${id}`) : undefined;
    if (!id || !match) continue;
    violations.push({
      rule: id,
      kind: "lint",
      ruleText: match.rule.text,
      entryId: match.entryId,
      message: message.message,
      line: message.line,
      column: message.column,
    });
  }

  const source = ts.createSourceFile(
    "snippet.tsx",
    input.code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  for (const [id, check] of Object.entries(validators)) {
    const match = owned.get(`validator:${id}`);
    if (!match) continue;
    for (const { node, message } of check(source)) {
      const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source));
      violations.push({
        rule: id,
        kind: "validator",
        ruleText: match.rule.text,
        entryId: match.entryId,
        message,
        line: line + 1,
        column: character + 1,
      });
    }
  }

  return violations.sort((a, b) => a.line - b.line || a.column - b.column);
}
