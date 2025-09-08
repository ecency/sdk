import path from "path";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Ecency Snap",
      formats: ["es"],
      fileName: () => "bundle.js",
    },
    rollupOptions: {
      external: [
        "crypto",
        "@ecency/wallets",
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
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [dtsPlugin(), nodePolyfills()],
});
