# 0003: How the app matches the design exactly

Date: 2026-11-11. Status: accepted, with open questions for the owner at the end.

`design/` is the specification and is read-only. These are the rules for translating its CSS into
React Native.

## Tokens

`packages/ui/src/tokens.ts` is generated from `design/tokens.json` by `pnpm tokens`. Values that appear
in `design/source/*.dc.html` but are missing from `tokens.json` live in `packages/ui/tokens.extra.json`,
each with a note saying which source file it comes from. The generator refuses duplicates, and
`pnpm test` fails if `tokens.ts` is out of date.

## Gradients

A CSS `linear-gradient(<angle>)` has a gradient line whose length depends on the box's width and
height. `Gradient` measures itself and computes exact start and end points with
`cssAngleToPoints(angle, width, height)` (the formula from the CSS Images specification, with tests).
Fixed start/end points would be subtly wrong on every box of a different shape.

## Fonts

Fonts are embedded natively by the `expo-font` config plugin (`packages/ui/fonts.config.js`) as four
families with real weights, so `fontFamily: 'Plus Jakarta Sans', fontWeight: '800'` works as in CSS and
no screen ever renders before fonts exist.

The design's CSS font stack falls back per character from Plus Jakarta Sans to Noto Sans Tamil. React
Native has no fallback list, so `AppText` splits each string into Tamil and non-Tamil runs
(`splitByScript`) and sets the font per run. Tamil weights follow CSS font matching: 800 uses 700 and
500 uses 400, because the design loads Noto Sans Tamil in 400, 600 and 700 only.

Text uses `includeFontPadding: false` so Android does not add space above and below it, and
`maxFontSizeMultiplier={1.3}` so large system text cannot overflow fixed-height controls.

## Icons

Icons are drawn from the design's own inline SVG paths with `react-native-svg`
(`packages/ui/src/components/Icon.tsx`), not from `lucide-react-native`. The design uses an older
Lucide release and several glyphs have since been redrawn.

## Shadows

React Native's `boxShadow` style (New Architecture) takes the same offset, blur and colour as CSS. When
a view clips its children to rounded corners, the shadow goes on a wrapper view.

## Safe areas

The design frame (390 x 844) has no status bar or navigation bar drawn. The app adds the safe-area
inset to the design's padding, so backgrounds run behind the system bars and content keeps the design's
spacing below them.

## Opening animation

One Reanimated shared value (`progress`, 0 to 1 over 6 s) drives everything through pure functions in
`splashTimeline.ts`, copied from the keyframes in `Splash.dc.html`. Skia draws the giant letters and
the shimmering word; the logo and Tamil name are ordinary views. Navigation happens at 6.4 s, as in the
source (DESIGN.md's table and the source agree; the brief said 6 s).

## Open questions for the owner

1. **Welcome header spacing.** Its top padding is 56 in the design, against 20 to 22 on other screens,
   which suggests it already allows for a status bar. The app adds the inset on top, like everywhere
   else. Should Welcome use `max(56, inset + something)` instead?
2. **Bebas Neue at weight 800.** The Welcome title asks for weight 800 but Bebas Neue has only 400, so
   browsers (and Android) draw a synthetic bold. Keep the synthetic bold, or use the regular face?
3. **Carousel dots.** The design's dot buttons are 28 x 24, below the 44 pt minimum. The app keeps the
   drawn size and extends the touch area vertically with `hitSlop`; horizontally they stay 28 wide.
4. **Search placeholder colour.** The design does not set one; the app uses the browser default grey
   seen in the screenshot (`#757575`).
5. **Carousel swipe.** The design only auto-advances and responds to dots. A swipe gesture would be
   natural on a phone but is not in the design, so it is not built.
