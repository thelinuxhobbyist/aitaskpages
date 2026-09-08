import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";
import sharp from "sharp";

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const OUT_DIR = path.join(ROOT_DIR, "generated_favicons");

const CLEAN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <g>
    <path fill="#4579BC" d="M364.203,217.319c0,96.402-78.149,174.551-174.548,174.551c-96.403,0-174.553-78.148-174.553-174.551 c0-96.401,78.149-174.549,174.553-174.549C286.054,42.771,364.203,120.918,364.203,217.319"/>
    <path fill="#1D9D75" d="M496.898,294.68c0,96.401-78.149,174.55-174.553,174.55c-96.401,0-174.553-78.148-174.553-174.55 s78.152-174.551,174.553-174.551C418.749,120.129,496.898,198.278,496.898,294.68"/>
  </g>
</svg>
`;

const SIZES = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 48, name: "favicon-48x48.png" },
  { size: 96, name: "favicon-96x96.png" },
  { size: 144, name: "favicon-144x144.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "favicon-192x192.png" },
  { size: 512, name: "favicon-512x512.png" },
];

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const svgBuffer = Buffer.from(CLEAN_SVG, "utf-8");

  // 1. Write clean SVGs
  await fs.writeFile(path.join(OUT_DIR, "favicon.svg"), svgBuffer);
  await fs.writeFile(path.join(PUBLIC_DIR, "favicon.svg"), svgBuffer);
  await fs.writeFile(path.join(PUBLIC_DIR, "AI JobsMarket-512x512_favicons.svg"), svgBuffer);

  // 2. Generate PNGs using Sharp
  for (const { size, name } of SIZES) {
    const pngBuffer = await sharp(svgBuffer, { density: 300 })
      .resize(size, size, {
        kernel: sharp.kernel.lanczos3,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toBuffer();

    await fs.writeFile(path.join(OUT_DIR, name), pngBuffer);
    await fs.writeFile(path.join(PUBLIC_DIR, name), pngBuffer);
    console.log(`Generated: ${name} (${size}x${size})`);
  }

  // 3. Generate multi-resolution favicon.ico (16, 32, 48) using ImageMagick
  const icoOutPath = path.join(OUT_DIR, "favicon.ico");
  const icoPublicPath = path.join(PUBLIC_DIR, "favicon.ico");
  const p16 = path.join(OUT_DIR, "favicon-16x16.png");
  const p32 = path.join(OUT_DIR, "favicon-32x32.png");
  const p48 = path.join(OUT_DIR, "favicon-48x48.png");

  execSync(`magick "${p16}" "${p32}" "${p48}" "${icoOutPath}"`);
  await fs.copyFile(icoOutPath, icoPublicPath);
  console.log("Generated: favicon.ico (16, 32, 48 multi-res)");

  console.log("All favicon assets generated successfully!");
}

main().catch((err) => {
  console.error("Error generating favicons:", err);
  process.exit(1);
});
