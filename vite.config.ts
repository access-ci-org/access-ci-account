import { defineConfig, configDefaults } from "vitest/config";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      exclude: [
        ...(configDefaults.coverage.exclude ?? []),
        "src/routeTree.gen.ts",
        "src/components/ui/**",
        "src/main.tsx",
        "src/reportWebVitals.ts",
        "src/test/**",
        "**/*.gen.ts",
      ],
    },
  },
});
