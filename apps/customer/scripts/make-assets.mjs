// Builds the app icon assets from the design logo. Run with `pnpm assets`.
//
// WHY a script: design/ is the read-only source of truth, so the app's icon
// files are derived from design/assets/logo.png instead of being hand-edited
// copies that could drift.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PNG } from 'pngjs';

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, '..');
const logoPath = resolve(appRoot, '../../design/assets/logo.png');
const outDir = resolve(appRoot, 'assets');
mkdirSync(outDir, { recursive: true });

const logo = PNG.sync.read(readFileSync(logoPath));

// 1. icon.png: the square logo as-is.
writeFileSync(resolve(outDir, 'icon.png'), PNG.sync.write(logo));

// 2. adaptive-icon-foreground.png: Android masks adaptive icons to a circle or
// squircle and only guarantees the centre ~66% is visible. Placing the logo at
// 66% of a larger canvas keeps the whole mark inside that safe zone.
const SAFE_ZONE = 0.66;
const canvasSize = Math.round(logo.width / SAFE_ZONE);
const offset = Math.round((canvasSize - logo.width) / 2);
const foreground = new PNG({ width: canvasSize, height: canvasSize });
// Fill with the logo's own background colour (top-left pixel) so there is no seam.
const [r, g, b] = [logo.data[0], logo.data[1], logo.data[2]];
for (let i = 0; i < foreground.data.length; i += 4) {
  foreground.data[i] = r;
  foreground.data[i + 1] = g;
  foreground.data[i + 2] = b;
  foreground.data[i + 3] = 255;
}
PNG.bitblt(logo, foreground, 0, 0, logo.width, logo.height, offset, offset);
writeFileSync(resolve(outDir, 'adaptive-icon-foreground.png'), PNG.sync.write(foreground));

// 3. splash-blank.png: one transparent pixel (see app.config.ts for why).
const blank = new PNG({ width: 1, height: 1 });
blank.data.fill(0);
writeFileSync(resolve(outDir, 'splash-blank.png'), PNG.sync.write(blank));

const hex = [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
console.log(`logo ${logo.width}x${logo.height}, background #${hex}`);
console.log(`wrote icon.png, adaptive-icon-foreground.png (${canvasSize}px), splash-blank.png`);
