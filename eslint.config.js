// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tailwindcss from "eslint-plugin-tailwindcss";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.next-e2e/**",
      "**/.turbo/**",
      "**/test-results/**",
      "**/playwright-report/**",
      "archive/**",
      "reference/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.mjs", "**/*.config.{js,ts,mjs}"],
    languageOptions: { globals: globals.node },
  },
  {
    // Tailwind's theme removal (ADR-0003) blocks off-system named utilities
    // (bg-blue-500, rounded-lg). It can't block arbitrary-value syntax
    // (text-[10.5px]), which bypasses the theme entirely — that's lint's job
    // until the full Lairy plugin (LDS-047) replaces this narrow rule.
    files: ["packages/ui/**/*.{ts,tsx}", "apps/docs/**/*.{ts,tsx}"],
    plugins: { tailwindcss },
    rules: {
      "tailwindcss/no-arbitrary-value": "error",
    },
  },
  eslintConfigPrettier,
);
