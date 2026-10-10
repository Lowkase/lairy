import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import { recommended as lairy } from "@lairy/eslint-plugin";

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
    // Lairy's own rules (LDS-047). Each quotes the content rule it enforces.
    // Tests and examples deliberately write bad code, so they are exempt.
    ...lairy,
    files: ["packages/ui/**/*.{ts,tsx}", "apps/docs/**/*.{ts,tsx}"],
    ignores: ["**/*.test.{ts,tsx}", "**/examples/**", "**/e2e/**"],
  },
  eslintConfigPrettier,
);
