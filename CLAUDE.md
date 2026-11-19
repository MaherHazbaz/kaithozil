# Kaithozhil

Kaithozhil (கைத்தொழில், "handiwork") connects customers in Tamil Nadu with verified local workers
(electricians, plumbers, AC repair, carpenters, tailors, painters) and construction crews. Customers
describe a job, a nearby verified worker accepts it, and the customer pays the worker directly by UPI.
Workers build an income record (monthly earnings statements) from the jobs they complete.

> **To confirm with the owner:** the original `CLAUDE.md` (Flutter era) was not in this folder when the
> project moved to React Native, so the product description above and the trust rules below were
> rebuilt from the project brief and the design. Replace them with the original wording if it differs.

## Trust rules (never break these)

- **Payments.** The app never holds job money. UPI goes straight from customer to worker
  (`upi://pay` links, no payment gateway). Payments are recorded in an append-only ledger with
  idempotency keys. A job is paid only when the customer's "Paid" AND the worker's "Received" are both
  confirmed through a server function.
- **Identity.** Never store raw Aadhaar numbers. Record every consent.
- **Privacy.** Never log personal data. Only `EXPO_PUBLIC_` variables may reach the app; secrets stay in
  Supabase / EAS.
- **Data access.** Row Level Security on every table, with tests. Anything that must not happen twice
  (accepting a job) runs in a database transaction. The server is the source of truth; validate on
  client and server.
- **Safety.** A 4-digit start code confirms the right worker arrived. Workers are ID-checked and
  skill-tested before their first job.
- **Language.** English first, Tamil secondary, exactly as designed.

## The design is the specification

`design/` is the approved design and is **read-only**. Never edit it.

- `design/source/<Screen>.dc.html`: every colour, size, gap, radius, shadow, gradient, font and piece
  of text, in inline CSS. Read values from here. Never estimate from screenshots.
- `design/screenshots/<Screen>.png`: 3x renders (1170 x 2532) to compare against. They use stand-in
  fonts, so letter widths differ; the bundled fonts are the correct ones.
- `design/DESIGN.md`: screens, routes, behaviours, shared components, opening animation timeline.
- `design/tokens.json`: design tokens.

Before building or changing a screen: open its source file, list the exact values, then build.
Do not add, remove or reword text without asking. If something is unclear, impossible in React
Native, or hurts accessibility, stop and ask.

## Stack

Expo SDK 58 (React Native 0.88, React 19.3, New Architecture, Hermes), TypeScript strict, Expo Router
with typed routes, development builds (not Expo Go). pnpm workspaces + Turborepo.

```
apps/customer    Expo app (routes in src/app, code in src/features/<name>/)
apps/worker      Expo app (Sprint 2)
apps/admin       Next.js admin panel (Sprint 6)
packages/ui      tokens (generated), fonts, icons, shared components
packages/core    types, zod schemas, Supabase client, shared business logic
supabase/        migrations, RLS policies, tests, Edge Functions (Sprint 2)
design/          approved design (read-only)
archive/flutter  the old Flutter starter (obsolete; ignore)
docs/decisions   decision records
```

Planned libraries, added when first needed: TanStack Query, Zustand, react-hook-form + zod, MMKV,
expo-secure-store, i18next, Supabase JS, expo-notifications + Notifee, expo-location,
react-native-maps, FlashList, Sentry.

## Rules for code

- **Tokens only.** Screens use `@kaithozhil/ui` tokens and components. No hard-coded colours, gradients,
  shadows or radii. `packages/ui/src/tokens.ts` is generated: change `design/tokens.json` (designer) or
  `packages/ui/tokens.extra.json` (values found in `design/source` but missing from tokens.json), then
  run `pnpm tokens`.
- **Text.** Use `AppText`. It sets Tamil characters in Noto Sans Tamil automatically. Wording lives in
  each feature's `copy.ts` (moves to `en.json` / `ta.json` with i18next).
- **Gradients.** Use `Gradient` with a token name. It converts the CSS angle for the measured box.
- **Icons.** Use `Icon` from `@kaithozhil/ui`. Its paths are copied from the design's inline SVGs. Add a
  new icon by copying its shapes from the design source.
- **Shadows.** `boxShadow` from tokens, on a wrapper view when the child clips its corners.
- **Safe areas.** Add the inset to the design's padding (`paddingTop: 22 + insets.top`). Never replace
  the design's spacing.
- **Architecture.** Feature-first: `src/features/<name>/{api,hooks,components,screens,types}`. Route
  files in `src/app` stay thin. Business logic in hooks and pure functions. All Supabase access through
  `packages/core`.
- **Every screen** handles loading, data, empty and error states, has `accessibilityLabel`/`Role` on
  interactive elements, touch targets of at least 44 pt, and respects reduce motion.
- **Comments** explain why, not what. The owner is an experienced React/TypeScript developer who is new
  to React Native: explain React Native-specific concepts briefly where they first appear.

## Working agreement

- Small steps. After each step run the quality gates, show what changed, and wait for the owner's OK.
- For each feature leave the owner one small, well-defined task to write, then review it.
- Unsure about an API or version? Check the installed package or the official docs. Never guess.
  Expo SDK 58 is newer than most reference material.
- Ask before anything destructive.
- The app is still in development. Never make a production or release build (no EAS production
  profile, no `--variant release`, no store submission) until the owner says so. Development builds
  only.
- Never start a native build (`pnpm android`, `pnpm prebuild`) unless the owner asks for one. Day to
  day work is code plus the code checks. When a build is asked for, make it the fastest correct one:
  keep the build caches (`android/`, `node_modules/*/android/build` and `.cxx`), build incrementally,
  never clean first, and close the emulator while compiling if memory is short.
- The owner tests on the Android Studio emulator (no physical phone yet).

## Commands

```
pnpm install            install (pnpm 12, hoisted layout)
pnpm tokens             regenerate packages/ui/src/tokens.ts
pnpm typecheck          tsc --noEmit, strict, all packages
pnpm lint               ESLint, zero warnings
pnpm test               Jest (also checks tokens.ts is current)
pnpm format:check       Prettier
pnpm check              all of the above
pnpm run doctor         expo-doctor for the customer app (plain `pnpm doctor` is pnpm 12's own check)

cd apps/customer
pnpm prebuild           generate android/ (never edit android/ by hand; it is build output)
pnpm android            build and install the development build on the emulator
pnpm start              start Metro for an installed development build
pnpm visual             screenshot the screens and compare with design/screenshots
```

Quality gates before showing any change: `pnpm check`, `pnpm run doctor`, and the app still runs on the
emulator.

## Windows build notes

See `docs/decisions/0002-windows-native-build.md`. In short: pnpm must use `nodeLinker: hoisted`, JDK
17 (not Android Studio's bundled JDK), and the Android SDK's CMake 3.22.1 needs Ninja 1.12 or newer
for paths over 260 characters.
