import path, { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ecency-wallets",
      fileName: "ecency-wallets",
    },

    rollupOptions: {
      external: [
        "crypto",
        "react",
        "@hiveio/dhive",
        "@tanstack/react-query",
        "lru-cache",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [dts()],
});
