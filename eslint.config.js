// @ts-check
import { configApp } from "@adonisjs/eslint-config";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

/* @type { import('eslint').Linter.Config } */
export default configApp({
  ...eslintPluginPrettierRecommended,
  rules: {
    eqeqeq: [1, "smart"],
    semi: ["warn", "always"],
  },
});
