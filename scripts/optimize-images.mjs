// Generates display-sized copies of the heaviest source images into
// src/assets/optimized. Run with `npm run images` after adding or
// replacing a source image; the originals stay untouched.
//
// Grid cards show at most ~560px wide, the lightbox and case card at most
// ~1600px, so thumbs are 1200px wide (2x for retina) and large copies 2000px.
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const outDir = path.join(root, "src/assets/optimized");

const jobs = [
  ...["backyard-1", "backyard-2", "backyard-3"].flatMap((name) => [
    { src: `full-images/${name}.webp`, out: `${name}-thumb.webp`, width: 1200, quality: 80 },
    { src: `full-images/${name}.webp`, out: `${name}-large.webp`, width: 2000, quality: 82 },
  ]),
  { src: "full-images/thesis-poster-flat.webp", out: "thesis-poster-flat-large.webp", width: 2400, quality: 82 },
  { src: "case-studies/putmeon/covernew.png", out: "putmeon-cover.webp", width: 2000, quality: 82 },
  // Put Me On case study page
  { src: "case-studies/putmeon/demo-poster.jpg", out: "putmeon-demo-poster.webp", width: 1280, quality: 80 },
  ...["home1", "home2", "home3", "home-popup", "account1", "account2", "account3", "library", "onboarding"].map((name) => ({
    src: `case-studies/putmeon/${name}.png`, out: `putmeon-${name}.webp`, width: 804, quality: 88,
  })),
];

await mkdir(outDir, { recursive: true });

for (const job of jobs) {
  const input = path.join(root, "src/assets", job.src);
  const output = path.join(outDir, job.out);
  await sharp(input)
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: job.quality })
    .toFile(output);
  const before = (await stat(input)).size;
  const after = (await stat(output)).size;
  console.log(
    `${job.out.padEnd(32)} ${(before / 1024).toFixed(0).padStart(6)} KB -> ${(after / 1024).toFixed(0).padStart(5)} KB`,
  );
}
