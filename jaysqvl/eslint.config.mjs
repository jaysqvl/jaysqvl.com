import { fixupConfigRules } from "@eslint/compat";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts", "tailwind.config.js"],
  },
  // Next's React plugin still uses APIs removed in ESLint 10. Restore those
  // APIs with ESLint's official adapter while retaining every configured rule.
  ...fixupConfigRules(nextVitals),
  ...fixupConfigRules(nextTypescript),
];

export default eslintConfig;
