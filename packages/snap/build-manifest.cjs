const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "package.json"), "utf8"),
);
const bundlePath = path.join(__dirname, "dist", "bundle.js");
const source = fs.readFileSync(bundlePath);
const shasum = crypto.createHash("sha256").update(source).digest("hex");

const manifest = {
  version: pkg.version,
  proposedName: "Ecency Snap",
  description: "MetaMask Snap providing multi-chain wallet capabilities.",
  repository: pkg.repository,
  source: {
    shasum,
    location: {
      local: "dist/bundle.js",
    },
  },
  initialPermissions: {
    snap_getBip44Entropy: [{ coinType: 756 }],
    "endowment:rpc": { dapps: true },
    snap_dialog: {},
    "endowment:webassembly": {},
  },
  manifestVersion: "0.1",
};

fs.writeFileSync(
  path.join(__dirname, "snap.manifest.json"),
  JSON.stringify(manifest, null, 2),
);
