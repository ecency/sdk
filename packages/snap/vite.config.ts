import path from "path";
import fs from "fs";
import { createHash } from "crypto";
import { defineConfig } from "vite";
import type { Plugin } from "vite";
import dtsPlugin from "vite-plugin-dts";
// Polyfills are usually not needed in the snap runtime. Keep it only if you know you need specific shims.
// import { nodePolyfills } from "vite-plugin-node-polyfills";

function updateManifestShasum(): Plugin {
  return {
    name: "update-manifest-shasum",
    closeBundle() {
      const bundlePath = path.resolve(__dirname, "dist", "bundle.js");
      if (!fs.existsSync(bundlePath)) return;

      const source = fs.readFileSync(bundlePath);
      const shasum = createHash("sha256").update(source).digest("base64"); // MetaMask expects base64 sha256

      const manifestPath = path.resolve(__dirname, "snap.manifest.json");
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

      // IMPORTANT: this URL must match how the file will be fetched by MetaMask
      // Your playground serves ../snap at http://localhost:5173/
      manifest.source = manifest.source ?? {};
      manifest.source.location = manifest.source.location ?? {};
      manifest.source.location.http = {
        url: "http://localhost:5173/dist/bundle.js",
      };
      manifest.source.shasum = shasum;

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log("[snap] Updated manifest shasum");
    },
  };
}

export default defineConfig({
  build: {
    target: "es2020",
    sourcemap: false,
    minify: "esbuild",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "EcencySnap",
      formats: ["iife"], // self-executing, no imports
      fileName: () => "bundle.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // single file
      },
      treeshake: true,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    dtsPlugin({ insertTypesEntry: false }),
    // nodePolyfills(),
    updateManifestShasum(),
  ],
});
