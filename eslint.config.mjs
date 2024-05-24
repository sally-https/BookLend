import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default {
  globals: globals.browser,
  extends: [
    pluginJs.configs.recommended,
    tseslint.configs.recommended,
    pluginVue.configs["flat/essential"],
    "plugin:prettier/recommended"
  ],
  plugins: ["vue"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser"
  }
};
