import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "snap.manifest.json"), "utf8"),
);

test("manifest shasum is base64 encoded", () => {
  assert.equal(manifest.source.shasum.length, 44);
  assert.match(manifest.source.shasum, /^[A-Za-z0-9+/]+={0,2}$/);
});

test("manifest shasum matches bundle", () => {
  const bundle = fs.readFileSync(
    path.join(__dirname, "..", "dist", "bundle.js"),
  );
  const digest = crypto.createHash("sha256").update(bundle).digest("base64");
  assert.equal(manifest.source.shasum, digest);
});

test("manifest defines npm registry", () => {
  assert.equal(
    manifest.source.location.npm.registry,
    "https://registry.npmjs.org",
  );
});
