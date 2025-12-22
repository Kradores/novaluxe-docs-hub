import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-plugin-prettier";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default defineConfig([
  // 1. Next.js Base & TypeScript Configs
  ...nextVitals,
  ...nextTs,

  // 2. Global Ignores (Combines your list with Next.js defaults)
  globalIgnores([
    ".now/*",
    "**/*.css",
    "**/.changeset",
    "**/dist",
    "esm/*",
    "public/*",
    "tests/*",
    "scripts/*",
    "**/*.config.js",
    "**/.DS_Store",
    "**/coverage",
    "**/build",
    "components/ui/*",
    // Next.js defaults
    ".next/**",
    "out/**",
    "next-env.d.ts",
  ]),

  // 3. Your Custom Configuration & Overrides
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "unused-imports": unusedImports,
      "prettier": prettier,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2017,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // Your custom rules here
      "no-console": "warn",
      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "prettier/prettier": "warn",
      "unused-imports/no-unused-imports": "warn",

      "@typescript-eslint/no-unused-vars": ["warn", {
        args: "after-used",
        ignoreRestSiblings: false,
        argsIgnorePattern: "^_.*?$",
      }],

      "import/order": ["warn", {
        groups: ["type", "builtin", "object", "external", "internal", "parent", "sibling", "index"],
        pathGroups: [{ pattern: "~/**", group: "external", position: "after" }],
        "newlines-between": "always",
      }],

      "react/self-closing-comp": "warn",
      "react/jsx-sort-props": ["warn", {
        callbacksLast: true, shorthandFirst: true, reservedFirst: true,
      }],

      "no-restricted-imports": [
        "error",
        {
          "paths": [
            {
              "name": "@radix-ui/react-tooltip",
              "message": "Please import from '@/components//ui/tooltip' instead.",
              "importNames": ["Tooltip", "TooltipTrigger", "TooltipContent"]
            },
            {
              "name": "sooner",
              "message": "Please import from '@/components/ui/sonner' instead.",
              "importNames": ["Toaster"]
            },
            {
              "name": "@/config/i18n/navigation",
              "message": "Please import from '@/components/link' instead.",
              "importNames": ["Link"]
            },
            {
              "name": "next/link",
              "message": "Please import from '@/components/link' instead.",
              "importNames": ["default"]
            },
            {
              "name": "next/navigation",
              "message": "Please import from '@/config/i18n/navigation' instead.",
              "importNames": [
                "redirect",
                "permanentRedirect",
                "usePathname",
                "useRouter",
                "getPathname"
              ]
            }
          ]
        }
      ]
    },
  },
]);
