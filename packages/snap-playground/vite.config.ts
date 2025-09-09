import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  publicDir: "../snap",
  server: {
    fs: {
      allow: [".."],
    },
  },
  plugins: [nodePolyfills()],
});
