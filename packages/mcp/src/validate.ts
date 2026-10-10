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

const ruleKey = (kind: Violation["kind"], id: string) => `${kind}:${id}`;

/** Every content rule tagged `enforceable`, by `kind:id`, with its owning entry. */
export function enforceableRules(): Map<string, OwnedRule> {
  const found = new Map<string, OwnedRule>();
  const add = (entryId: string, rules: Rule[]) => {
    for (const rule of rules) {
      if (rule.enforceable)
        found.set(ruleKey(rule.enforceable.kind, rule.enforceable.id), { entryId, rule });
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

/** Local names a module binds `name` to: `name` itself, plus any
 * `import { name as Alias }`. A snippet has no module graph to follow beyond
 * that. */
function localNames(source: ts.SourceFile, name: string): Set<string> {
  const names = new Set([name]);
  source.forEachChild((node) => {
    const bindings = ts.isImportDeclaration(node) ? node.importClause?.namedBindings : undefined;
    if (!bindings || !ts.isNamedImports(bindings)) return;
    for (const specifier of bindings.elements) {
      if ((specifier.propertyName ?? specifier.name).text === name) names.add(specifier.name.text);
    }
  });
  return names;
}

/** The array literal an `actions` value stands for: the literal itself, or the
 * initialiser of a same-file `const` it names. Anything else (a prop, a call)
 * can't be read statically. */
function actionsArray(
  expr: ts.Expression,
  source: ts.SourceFile,
): ts.ArrayLiteralExpression | undefined {
  if (ts.isArrayLiteralExpression(expr)) return expr;
  if (!ts.isIdentifier(expr)) return undefined;
  let found: ts.ArrayLiteralExpression | undefined;
  source.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const decl of node.declarationList.declarations) {
      if (
        ts.isIdentifier(decl.name) &&
        decl.name.text === expr.text &&
        decl.initializer &&
        ts.isArrayLiteralExpression(decl.initializer)
      ) {
        found = decl.initializer;
      }
    }
  });
  return found;
}

/** Callout Content rule 4: the first action is implicitly primary, so a
 * second primary — an explicit `variant: "primary"` on a later action, or any
 * `<Button variant="primary">` placed in the callout — is a violation. Every
 * primary beyond the first is reported. */
const calloutSinglePrimaryAction: Check = (source) => {
  const out: ReturnType<Check> = [];
  const calloutNames = localNames(source, "Callout");
  const buttonNames = localNames(source, "Button");
  const isCallout = (node: ts.Node) =>
    (ts.isJsxElement(node) && calloutNames.has(jsxName(node.openingElement))) ||
    (ts.isJsxSelfClosingElement(node) && calloutNames.has(jsxName(node)));

  /** Primary Buttons under `node`, in this Callout only: a nested Callout is
   * its own check, and of two exclusive ternary branches only the larger counts. */
  const buttons = (node: ts.Node): ts.Node[] => {
    if (isCallout(node)) return [];
    if (ts.isConditionalExpression(node)) {
      const whenTrue = buttons(node.whenTrue);
      const whenFalse = buttons(node.whenFalse);
      return [
        ...buttons(node.condition),
        ...(whenFalse.length > whenTrue.length ? whenFalse : whenTrue),
      ];
    }
    const here =
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      buttonNames.has(jsxName(node)) &&
      stringAttribute(node, "variant") === "primary"
        ? [node]
        : [];
    const below: ts.Node[] = [];
    ts.forEachChild(node, (child) => void below.push(...buttons(child)));
    return [...here, ...below];
  };

  const inspect = (callout: ts.JsxElement | ts.JsxSelfClosingElement) => {
    const opening = ts.isJsxElement(callout) ? callout.openingElement : callout;
    const primaries: ts.Node[] = [];
    let implicit = false;

    for (const attr of opening.attributes.properties) {
      if (!ts.isJsxAttribute(attr) || attr.name.getText() !== "actions") continue;
      const expr =
        attr.initializer && ts.isJsxExpression(attr.initializer)
          ? attr.initializer.expression
          : undefined;
      const array = expr && actionsArray(expr, source);
      if (!array) continue;
      implicit = array.elements.length > 0;
      // A spread stands for earlier actions of unknown number, so anything
      // after it is "later" like any element past index 0.
      array.elements.forEach((element, index) => {
        if (index === 0 || !ts.isObjectLiteralExpression(element)) return;
        const marked = element.properties.find(isPrimaryProperty);
        if (marked) primaries.push(marked);
      });
    }

    if (ts.isJsxElement(callout))
      callout.children.forEach((child) => primaries.push(...buttons(child)));
    primaries.sort((a, b) => a.getStart(source) - b.getStart(source));

    for (const extra of implicit ? primaries : primaries.slice(1)) {
      out.push({ node: extra, message: "This Callout has more than one primary action." });
    }
  };

  const walk = (node: ts.Node) => {
    if (isCallout(node)) inspect(node as ts.JsxElement | ts.JsxSelfClosingElement);
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

  const toViolation = (
    kind: Violation["kind"],
    id: string,
    match: OwnedRule,
    message: string,
    line: number,
    column: number,
  ): Violation => ({
    rule: id,
    kind,
    ruleText: match.rule.text,
    entryId: match.entryId,
    message,
    line,
    column,
  });

  for (const message of messages) {
    if (message.fatal) throw new Error(`Could not parse the snippet: ${message.message}`);
    if (!message.ruleId?.startsWith(LINT_PREFIX)) continue;
    const id = message.ruleId.slice(LINT_PREFIX.length);
    const match = owned.get(ruleKey("lint", id));
    // A plugin rule with no content tag is a build-time inconsistency; dropping
    // the hit would let the snippet pass validate while failing lint.
    if (!match) throw new Error(`Lint rule "${id}" has no content rule tagged enforceable: lint.`);
    violations.push(toViolation("lint", id, match, message.message, message.line, message.column));
  }

  const source = ts.createSourceFile(
    "snippet.tsx",
    input.code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  for (const [id, check] of Object.entries(validators)) {
    const match = owned.get(ruleKey("validator", id));
    if (!match) continue;
    for (const { node, message } of check(source)) {
      const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source));
      violations.push(toViolation("validator", id, match, message, line + 1, character + 1));
    }
  }

  return violations.sort((a, b) => a.line - b.line || a.column - b.column);
}
