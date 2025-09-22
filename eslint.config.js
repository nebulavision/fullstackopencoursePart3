import js from "@eslint/js";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    // Archivos a lintar
    files: ["src/**/*.{js,mjs,cjs}"],

    // Parsear y opciones
    languageOptions: { 
      parserOptions: {
        sourceType: "module",
        requireConfigFile: false
      }, 
      globals: globals.node 
    },

    // Plugins
    plugins: { js, stylistic },

    // Extends
    extends: ["js/recommended"],

    // Reglas
    rules: {
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-console": "off"
    }
  },

  // Ignorar dist y node_modules
  globalIgnores(["dist"]),
]);
