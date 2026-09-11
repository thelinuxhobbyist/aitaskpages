import { execSync } from "node:child_process";
import path from "node:path";

const BUCKET = "aitaskpages-images";
const OUT_DIR = path.join(process.cwd(), "generated_favicons");

const UPLOADS = [
  { file: "favicon.ico", key: "images/logos/favicon.ico", ct: "image/x-icon" },
  { file: "favicon.svg", key: "images/logos/favicon.svg", ct: "image/svg+xml" },
  { file: "favicon-16x16.png", key: "images/logos/favicon-16x16.png", ct: "image/png" },
  { file: "favicon-32x32.png", key: "images/logos/favicon-32x32.png", ct: "image/png" },
  { file: "favicon-48x48.png", key: "images/logos/favicon-48x48.png", ct: "image/png" },
  { file: "favicon-96x96.png", key: "images/logos/favicon-96x96.png", ct: "image/png" },
  { file: "favicon-144x144.png", key: "images/logos/favicon-144x144.png", ct: "image/png" },
  { file: "apple-touch-icon.png", key: "images/logos/apple-touch-icon.png", ct: "image/png" },
  { file: "favicon-192x192.png", key: "images/logos/favicon-192x192.png", ct: "image/png" },
  { file: "favicon-512x512.png", key: "images/logos/favicon-512x512.png", ct: "image/png" },
];

for (const item of UPLOADS) {
  const filePath = path.join(OUT_DIR, item.file);
  const target = `${BUCKET}/${item.key}`;
  console.log(`Uploading ${item.file} -> ${target} (${item.ct})...`);
  const cmd = `npx wrangler r2 object put "${target}" --file "${filePath}" --content-type "${item.ct}" --remote -y`;
  execSync(cmd, { stdio: "inherit" });
}

console.log("All favicon assets uploaded to R2 successfully!");
