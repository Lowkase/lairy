import { RuleTester } from "eslint";
import { describe, expect, it } from "vitest";
import { lintRules, ruleText } from "./rule-text";
import { rules } from "./index";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

const message = (id: string, detail: string) => `${detail} Lairy rule: "${ruleText(id)}"`;

describe("plugin coverage", () => {
  it("implements every content rule tagged enforceable: lint, and nothing else", () => {
    expect(Object.keys(rules).sort()).toEqual([...lintRules().keys()].sort());
  });
});

tester.run("no-arbitrary-tailwind-value", rules["no-arbitrary-tailwind-value"], {
  valid: [
    {
      code: `const a = <div className="text-small p-8 hover:bg-panel data-[state=open]:flex [&>svg]:size-4" />;`,
    },
    { code: `const a = cn("px-12", cond && "gap-8");` },
    { code: `const a = "w-[3px]";` },
    {
      code: `const a = <div className="[scrollbar-color:var(--border-2)_transparent] hover:[scrollbar-width:thin] [mask-type:alpha]" />;`,
    },
  ],
  invalid: [
    {
      code: `const a = <div className="text-[10.5px]" />;`,
      errors: [
        {
          message: message(
            "no-arbitrary-tailwind-value",
            'Arbitrary value "text-[10.5px]" is off-system; use a token utility.',
          ),
        },
      ],
    },
    {
      code: `const a = cn("p-4", { "hover:w-[3px]": on });`,
      errors: [{ messageId: "violation" }],
    },
    {
      code: "const a = <div className={`flex bg-[#fff]`} />;",
      errors: [{ messageId: "violation" }],
    },
    {
      code: `const a = <div className="[width:13px]" />;`,
      errors: [
        {
          message: message(
            "no-arbitrary-tailwind-value",
            'Arbitrary property "[width:13px]" is off-system.',
          ),
        },
      ],
    },
    {
      code: `const a = <div className="[margin:var(--a)_4px]" />;`,
      errors: [{ messageId: "violation" }],
    },
    {
      code: `const a = <div className="-mt-4" />;`,
      errors: [
        {
          message: message(
            "no-arbitrary-tailwind-value",
            'Negative margin "-mt-4" is a magic offset.',
          ),
        },
      ],
    },
  ],
});

tester.run("no-hardcoded-color", rules["no-hardcoded-color"], {
  valid: [
    { code: `const a = { color: "var(--accent)" };` },
    { code: `const a = <a href="#fff">x</a>;` },
    { code: `const a = "url(#abc123)";` },
    { code: `import x from "#abc";` },
    { code: `const a = "see issue #12 and #foo";` },
  ],
  invalid: [
    {
      code: `const a = { color: "#fff" };`,
      errors: [{ message: message("no-hardcoded-color", 'Hard-coded colour "#fff".') }],
    },
    { code: `const a = <rect fill="#1a2b3c" />;`, errors: [{ messageId: "violation" }] },
    { code: "const a = `border: 1px solid #ffffff80`;", errors: [{ messageId: "violation" }] },
    {
      code: `const a = { background: "rgba(0, 0, 0, .5)" };`,
      errors: [{ messageId: "violation" }],
    },
    { code: `const a = "oklch(0.7 0.1 80)";`, errors: [{ messageId: "violation" }] },
  ],
});

tester.run("no-off-scale-size", rules["no-off-scale-size"], {
  valid: [
    { code: `const a = { fontSize: "var(--text-small)" };` },
    { code: `const a = { fontSize: "inherit" };` },
    { code: `const a = <text fontSize="var(--text-micro)" />;` },
    { code: `const a = "font-size: var(--text-small)";` },
  ],
  invalid: [
    {
      code: `const a = { fontSize: 13 };`,
      errors: [
        {
          message: message(
            "no-off-scale-size",
            "Literal font size is off the type scale; use a text-* token.",
          ),
        },
      ],
    },
    { code: `const a = { "font-size": "13px" };`, errors: [{ messageId: "violation" }] },
    { code: `const a = <text fontSize={9} />;`, errors: [{ messageId: "violation" }] },
    { code: `const a = "font-size: 13px; color: red";`, errors: [{ messageId: "violation" }] },
  ],
});

tester.run("no-off-scale-spacing", rules["no-off-scale-spacing"], {
  valid: [
    { code: `const a = { padding: "var(--spacing-8)" };` },
    { code: `const a = { margin: 0, gap: "0" };` },
    { code: `const a = { width: 132 };` },
    { code: `const a = { padding: "calc(var(--spacing-8) * 2)" };` },
  ],
  invalid: [
    {
      code: `const a = { padding: 13 };`,
      errors: [
        {
          message: message(
            "no-off-scale-spacing",
            "Literal padding is not a ramp token; use a spacing token.",
          ),
        },
      ],
    },
    { code: `const a = { gap: "7px" };`, errors: [{ messageId: "violation" }] },
    { code: `const a = { marginTop: "1rem" };`, errors: [{ messageId: "violation" }] },
    { code: `const a = { paddingInline: "4px 9px" };`, errors: [{ messageId: "violation" }] },
  ],
});

tester.run("no-removed-focus-outline", rules["no-removed-focus-outline"], {
  valid: [
    { code: `const a = <button className="focus-ring" />;` },
    { code: `const a = <button className="outline-none focus-ring" />;` },
    { code: `const a = <button className="outline-none focus-visible:ring-2" />;` },
    { code: `const a = { outline: "2px solid var(--accent-line)" };` },
    { code: `const a = { outline: "none", boxShadow: "var(--shadow-focus)" };` },
  ],
  invalid: [
    {
      code: `const a = <button className="outline-none" />;`,
      errors: [
        {
          message: message(
            "no-removed-focus-outline",
            '"outline-none" removes the focus outline with no replacement.',
          ),
        },
      ],
    },
    {
      code: `const a = <button className="focus:outline-0" />;`,
      errors: [{ messageId: "violation" }],
    },
    {
      code: `const a = <button className="outline-hidden" />;`,
      errors: [{ messageId: "violation" }],
    },
    { code: `const a = { outline: "none" };`, errors: [{ messageId: "violation" }] },
    { code: `const a = { outlineStyle: "none" };`, errors: [{ messageId: "violation" }] },
    { code: `const a = "button:focus { outline: none; }";`, errors: [{ messageId: "violation" }] },
  ],
});

tester.run("no-positive-tabindex", rules["no-positive-tabindex"], {
  valid: [
    { code: `const a = <div tabIndex={0} />;` },
    { code: `const a = <div tabIndex={-1} />;` },
    { code: `const a = <div tabIndex={selected ? 0 : -1} />;` },
    { code: `const a = { tabIndex: 0 };` },
  ],
  invalid: [
    {
      code: `const a = <div tabIndex={1} />;`,
      errors: [
        { message: message("no-positive-tabindex", "Positive tabindex overrides source order.") },
      ],
    },
    { code: `const a = <div tabIndex="3" />;`, errors: [{ messageId: "violation" }] },
    {
      code: `const a = createElement("div", { tabIndex: 2 });`,
      errors: [{ messageId: "violation" }],
    },
  ],
});
