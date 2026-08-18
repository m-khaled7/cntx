// @ts-check
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";
import { baseConfig } from "@cntx/eslint-config";

export default tseslint.config(
    {
        ignores: ["eslint.config.mjs", "dist/"],
    },
    ...baseConfig,
    {
        languageOptions: {
            globals: {
                ...globals.jest,
            },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-floating-promises": "warn",
            "@typescript-eslint/no-unsafe-argument": "warn",
        },
    },

    // 3. Prettier Formatting Plugin (Always run last to overwrite style conflicts)
    eslintPluginPrettierRecommended,
);

