# Kaithozhil

Customer and worker apps for Kaithozhil, built with React Native (Expo SDK 58) and TypeScript.

- [CLAUDE.md](CLAUDE.md): product, trust rules, stack and coding rules
- [LEARNING.md](LEARNING.md): React Native notes and the current hands-on task
- [design/DESIGN.md](design/DESIGN.md): the approved design (read-only)
- [docs/decisions/](docs/decisions/): why things are the way they are

## Requirements

- Node 22.13+ or 24.3+ (Expo SDK 58)
- pnpm 12 through corepack: `corepack enable pnpm`
- JDK 17, with `JAVA_HOME` pointing to it
- Android SDK with `ANDROID_HOME` set, and an emulator
- On Windows, the one-time fixes in
  [docs/decisions/0002-windows-native-build.md](docs/decisions/0002-windows-native-build.md)

## First run

```
pnpm install
cd apps/customer
pnpm android
```

`pnpm android` generates the Android project, compiles it and installs the development build on the
running emulator. The first build takes about 20 minutes; later ones are incremental. After that,
`pnpm start` is enough for JavaScript changes.

## Checks

```
pnpm check     Prettier, TypeScript, ESLint, Jest
pnpm doctor    expo-doctor
```

In `apps/customer`, `pnpm visual` screenshots each screen on the emulator and compares it with
`design/screenshots/`. Results are written to `apps/customer/visual/compare/`.

## Layout

```
apps/customer    Expo app
packages/ui      design tokens (generated), fonts, icons, shared components
packages/core    shared types and business logic
design/          approved design (read-only)
archive/flutter  the old Flutter starter (obsolete)
```
