import fs from 'fs';
import path from 'path';

const ASSETS = [
  'amenities.webp',
  'catamaran-aerial.webp',
  'galeria-1.webp',
  'galeria-3.webp',
  'galeria-4.webp',
  'galeria-5.webp',
  'galeria-7.webp',
  'galeria-8.webp',
  'galeria-9.webp',
  'galeria-10.webp',
  'galeria-11.webp',
  'galeria-13.webp',
  'galeria-14.webp',
  'hero.jpg',
  'logo.webp',
  'red-icon.svg',
];

const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'tucan');
const GITHUB_RAW_BASE =
  'https://raw.githubusercontent.com/joleal08/catamaran-tucan-arenal/main/public/images/tucan';

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const file of ASSETS) {
    const target = path.join(OUT_DIR, file);
    if (fs.existsSync(target) && fs.statSync(target).size > 0) {
      continue;
    }
    const url = `${GITHUB_RAW_BASE}/${file}`;
    console.log(`[ensure-assets] Fetching ${url}...`);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(target, buf);
  }
}

main().catch((err) => {
  console.error('[ensure-assets] Error:', err);
  process.exit(1);
});
