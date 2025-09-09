import { defineConfig } from "vite";

export default defineConfig({
  publicDir: "../snap",
  server: {
    fs: {
      allow: [".."],
    },
  },
});
