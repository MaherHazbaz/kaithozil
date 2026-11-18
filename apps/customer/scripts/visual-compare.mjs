// Compares the running app against design/screenshots/*.png.
//
//   pnpm visual                       all screens at the design size (390 x 844)
//   pnpm visual -- --screen Welcome   one screen
//   pnpm visual -- --width 360        capture only, at another width (360-430)
//   pnpm visual -- --font-scale 1.3   capture only, with large system text
//
// Requirements: an emulator is running, the development build is installed and
// Metro is serving it (`pnpm start`).
//
// HOW IT WORKS
// 1. The emulator's display is temporarily resized with `adb shell wm size` so
//    that the app's safe area is exactly 1170 x 2532 px at 3x (390 x 844 pt),
//    the size of the design screenshots.
// 2. Each screen is opened by deep link, screenshotted with `adb screencap`,
//    and cropped to the safe area (status bar and navigation bar removed).
// 3. pixelmatch counts differing pixels and writes a diff image. A side-by-side
//    image (design | app | diff) is written for a human to review.
// 4. The display is always restored at the end.
//
// The mismatch percentage is a guide, not a gate: the design screenshots were
// rendered with stand-in fonts (see design/DESIGN.md), so text never matches
// pixel for pixel. Review the side-by-side images.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, '..');
const designDir = resolve(appRoot, '../../design/screenshots');
const outDir = resolve(appRoot, 'visual');

const SCHEME = 'kaithozhil-dev';
const PACKAGE = 'in.kaithozhil.customer.dev';
const DESIGN = { width: 390, height: 844, scale: 3 };

// `fullScreen` screens are compared edge to edge (the opening animation fills
// the whole display). The others are compared inside the safe area.
const SCREENS = [
  { name: 'Welcome', path: 'welcome', settleMs: 2500 },
  { name: 'Login', path: 'login', settleMs: 2500 },
  // Captured before the carousel's first auto-advance at 3.5 s.
  { name: 'Main', path: 'home', settleMs: 2200 },
  { name: 'Bookings', path: 'bookings', settleMs: 2500 },
  { name: 'Profile', path: 'profile', settleMs: 2500 },
  { name: 'Searching', path: 'job/searching?service=electrician', settleMs: 2500 },
  { name: 'Tracking', path: 'job/tracking', settleMs: 2500 },
  { name: 'BillApprove', path: 'job/KT-20481/bill', settleMs: 2500 },
  { name: 'Pay', path: 'job/KT-20481/pay', settleMs: 2500 },
  { name: 'Receipt', path: 'job/KT-20481/receipt', settleMs: 2500 },
  { name: 'Handover', path: 'order/sample-tailor-order/handover', settleMs: 2500 },
  { name: 'Book', path: 'worker/murugan-k/book', settleMs: 2500 },
  // System states (development preview routes, see src/app/dev/states).
  { name: 'NoInternet', path: 'dev/states/no-internet', settleMs: 2500 },
  { name: 'ErrorState', path: 'dev/states/error', settleMs: 2500 },
  { name: 'EmptyState', path: 'dev/states/empty-bookings', settleMs: 2500 },
  { name: 'UpdateApp', path: 'update', settleMs: 2500 },
  // Captured mid-ripple, so the waves never match the still screenshot.
  { name: 'Maintenance', path: 'dev/states/maintenance', settleMs: 2500 },
  // Settings batch.
  { name: 'Permissions', path: 'permissions', settleMs: 2500 },
  { name: 'Language', path: 'language', settleMs: 2500 },
  { name: 'Safety', path: 'safety', settleMs: 2500 },
  { name: 'Legal', path: 'legal', settleMs: 2500 },
  { name: 'DeleteAccount', path: 'account/delete', settleMs: 2500 },
  // Account batch.
  { name: 'Addresses', path: 'addresses', settleMs: 2500 },
  { name: 'AddressEdit', path: 'addresses/edit', settleMs: 2500 },
  { name: 'Payments', path: 'payments', settleMs: 2500 },
  { name: 'MyMeasurements', path: 'measurements', settleMs: 2500 },
  { name: 'Support', path: 'support', settleMs: 2500 },
  { name: 'Ticket', path: 'support/T-1042', settleMs: 2500 },
  // Job details and search. Schedule's day labels follow today's date, so
  // they only match the screenshot on the day it was drawn.
  { name: 'Media', path: 'job/new/media', settleMs: 2500 },
  { name: 'Schedule', path: 'job/new/schedule', settleMs: 2500 },
  { name: 'MechPost', path: 'job/new/mechanic', settleMs: 2500 },
  { name: 'Search', path: 'search', settleMs: 2500 },
  // Worker profile, booking, chat, quotes and tailors.
  { name: 'WorkerProfile', path: 'worker/murugan-k', settleMs: 2500 },
  { name: 'RequestSent', path: 'booking/murugan-k', settleMs: 2500 },
  { name: 'Chat', path: 'job/KT-20517/chat', settleMs: 2500 },
  { name: 'CancelBooking', path: 'job/KT-20517/cancel', settleMs: 2500 },
  { name: 'QuoteRequest', path: 'job/new/visit', settleMs: 2500 },
  { name: 'QuoteView', path: 'quote/Q-1001', settleMs: 2500 },
  { name: 'JobProgress', path: 'job/KT-20517/progress', settleMs: 2500 },
  { name: 'ChangeRequest', path: 'job/KT-20481/change?side=worker', settleMs: 2500 },
  { name: 'TailorBook', path: 'job/new/tailor', settleMs: 2500 },
  { name: 'OrderStatus', path: 'order/sample-tailor-order', settleMs: 2500 },
  { name: 'Splash_frame_1s', path: '?t=1', settleMs: 2500, fullScreen: true },
  { name: 'Splash_frame_2.5s', path: '?t=2.5', settleMs: 2500, fullScreen: true },
  { name: 'Splash_frame_3.5s', path: '?t=3.5', settleMs: 2500, fullScreen: true },
  { name: 'Splash', path: '?t=6', settleMs: 2500, fullScreen: true },
];

function argValue(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const onlyScreen = argValue('--screen');
const widthPt = Number(argValue('--width') ?? DESIGN.width);
const fontScale = argValue('--font-scale');
// Other widths and font scales have no design reference: capture only.
const captureOnly = widthPt !== DESIGN.width || fontScale !== undefined;

const sdk =
  process.env.ANDROID_HOME ??
  process.env.ANDROID_SDK_ROOT ??
  join(process.env.LOCALAPPDATA ?? '', 'Android', 'Sdk');
const adbPath = join(sdk, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb');

function adb(args, options = {}) {
  return execFileSync(adbPath, args, { maxBuffer: 128 * 1024 * 1024, ...options });
}
const shell = (command) => adb(['shell', command]).toString();
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

/** Status bar and navigation bar heights in pixels, read from the window manager. */
function readInsets() {
  const dump = shell('dumpsys window');
  const frame = (type) => {
    const match = dump.match(
      new RegExp(`type=${type}[^\\n]*?frame=\\[(\\d+),(\\d+)\\]\\[(\\d+),(\\d+)\\]`),
    );
    return match ? Number(match[4]) - Number(match[2]) : 0;
  };
  return { top: frame('statusBars'), bottom: frame('navigationBars') };
}

function screenshot() {
  return PNG.sync.read(adb(['exec-out', 'screencap', '-p']));
}

function crop(image, top, height) {
  const out = new PNG({ width: image.width, height });
  PNG.bitblt(image, out, 0, top, image.width, height, 0, 0);
  return out;
}

function sideBySide(images) {
  const gap = 24;
  const width = images.reduce((sum, img) => sum + img.width, 0) + gap * (images.length - 1);
  const height = Math.max(...images.map((img) => img.height));
  const out = new PNG({ width, height });
  out.data.fill(255);
  let x = 0;
  for (const img of images) {
    PNG.bitblt(img, out, 0, 0, img.width, img.height, x, 0);
    x += img.width + gap;
  }
  return out;
}

async function main() {
  if (!existsSync(adbPath)) {
    throw new Error(`adb not found at ${adbPath}. Set ANDROID_HOME.`);
  }
  for (const dir of ['actual', 'diff', 'compare']) {
    mkdirSync(join(outDir, dir), { recursive: true });
  }

  const widthPx = widthPt * DESIGN.scale;
  const heightPx = DESIGN.height * DESIGN.scale;
  const screens = SCREENS.filter((s) => !onlyScreen || s.name === onlyScreen);
  if (screens.length === 0) {
    throw new Error(
      `No screen named "${onlyScreen}". Known: ${SCREENS.map((s) => s.name).join(', ')}`,
    );
  }

  const results = [];
  try {
    // 480 dpi = 3x, so 1170 px is 390 pt.
    shell(`wm density ${160 * DESIGN.scale}`);
    shell(`wm size ${widthPx}x${heightPx}`);
    if (fontScale) shell(`settings put system font_scale ${fontScale}`);
    await sleep(1500);

    const insets = readInsets();
    console.log(`insets: status bar ${insets.top}px, navigation bar ${insets.bottom}px`);

    let currentHeight = heightPx;
    for (const screen of screens) {
      // Safe-area screens get a taller display so the area between the system
      // bars is exactly the design height.
      const wanted = screen.fullScreen ? heightPx : heightPx + insets.top + insets.bottom;
      if (wanted !== currentHeight) {
        shell(`wm size ${widthPx}x${wanted}`);
        currentHeight = wanted;
        await sleep(1500);
      }

      const url = `${SCHEME}:///${screen.path}`;
      shell(`am start -W -a android.intent.action.VIEW -d '${url}' ${PACKAGE}`);
      await sleep(screen.settleMs);

      const shot = screenshot();
      const top = screen.fullScreen ? 0 : insets.top;
      const actual = crop(shot, top, Math.min(heightPx, shot.height - top));
      const suffix = captureOnly ? `@${widthPt}${fontScale ? `-font${fontScale}` : ''}` : '';
      writeFileSync(join(outDir, 'actual', `${screen.name}${suffix}.png`), PNG.sync.write(actual));

      if (captureOnly) {
        console.log(`${screen.name}: captured ${actual.width}x${actual.height}`);
        continue;
      }

      const design = PNG.sync.read(readFileSync(join(designDir, `${screen.name}.png`)));
      if (design.width !== actual.width || design.height !== actual.height) {
        console.log(
          `${screen.name}: size differs (design ${design.width}x${design.height}, app ${actual.width}x${actual.height})`,
        );
        results.push({ name: screen.name, mismatch: null });
        continue;
      }
      const diff = new PNG({ width: design.width, height: design.height });
      const differing = pixelmatch(
        design.data,
        actual.data,
        diff.data,
        design.width,
        design.height,
        {
          threshold: 0.1,
        },
      );
      const mismatch = (differing / (design.width * design.height)) * 100;
      writeFileSync(join(outDir, 'diff', `${screen.name}.png`), PNG.sync.write(diff));
      writeFileSync(
        join(outDir, 'compare', `${screen.name}.png`),
        PNG.sync.write(sideBySide([design, actual, diff])),
      );
      results.push({ name: screen.name, mismatch });
      console.log(`${screen.name}: ${mismatch.toFixed(2)}% of pixels differ`);
    }
  } finally {
    // Always put the emulator back the way it was.
    shell('wm size reset');
    shell('wm density reset');
    if (fontScale) shell('settings put system font_scale 1.0');
  }

  console.log(`\nImages written to ${outDir} (compare/ = design | app | diff)`);
  return results;
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
