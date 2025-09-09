import path from "path";
import fs from "fs";
import { createHash } from "crypto";
import { defineConfig } from "vite";
import type { Plugin } from "vite";
import dtsPlugin from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const pkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "package.json"), "utf8"),
);

function updateManifestShasum(): Plugin {
  return {
    name: "update-manifest-shasum",
    writeBundle() {
      const bundlePath = path.resolve(__dirname, "dist", "bundle.js");
      if (!fs.existsSync(bundlePath)) return;

      const source = fs.readFileSync(bundlePath);
      const shasum = createHash("sha256").update(source).digest("base64"); // MetaMask expects base64 sha256

      const manifestPath = path.resolve(__dirname, "snap.manifest.json");
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

      manifest.source = manifest.source ?? {};
      manifest.source.location = manifest.source.location ?? {};
      manifest.source.location.npm =
        manifest.source.location.npm ?? {
          filePath: "dist/bundle.js",
          packageName: pkg.name,
          registry: "https://registry.npmjs.org",
        };
      delete manifest.source.location.http;
      manifest.source.shasum = shasum;

      fs.writeFileSync(
        manifestPath,
        JSON.stringify(manifest, null, 2) + "\n",
      );
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
    nodePolyfills(),
    updateManifestShasum(),
  ],
});
