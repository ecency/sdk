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
        "@ecency/sdk",
        "lru-cache",
        "scheduler",
        "react/jsx-runtime",
        "@okxweb3/coin-aptos",
        "@okxweb3/coin-base",
        "@okxweb3/coin-bitcoin",
        "@okxweb3/coin-cosmos",
        "@okxweb3/coin-ethereum",
        "@okxweb3/coin-solana",
        "@okxweb3/coin-ton",
        "@okxweb3/coin-tron",
        "@okxweb3/crypto-lib",
        "bip39",
        "hivesigner",
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
