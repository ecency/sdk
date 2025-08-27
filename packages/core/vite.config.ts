import path, { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dtsPlugin from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Ecency SDK",
      formats: ["es"],
      fileName: (format) => `ecency-sdk.${format}.js`,
    },
    rollupOptions: {
      external: [
        "crypto",
        "react",
        "@hiveio/dhive",
        "@tanstack/react-query",
        "lru-cache",
        "scheduler",
        "react/jsx-runtime",
        "bip39",
        "hivesigner",
        "remeda",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "near-api-js": "near-api-js/dist/near-api-js.js",
    },
  },
  plugins: [react(), dtsPlugin(), nodePolyfills()],
});
