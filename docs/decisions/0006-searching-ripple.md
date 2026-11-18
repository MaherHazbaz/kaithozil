# 0006: Ripple animation on Finding a worker (addition to the approved design)

Date: 2026-11-14. Status: built at the owner's request.

## Why

`design/source/Searching.dc.html` is a still image. A screen that says "finding" but does not move
looks frozen, and the customer cannot tell whether anything is happening. The owner asked for a
ripple around the search icon, like the one ride-hailing apps show while finding a driver.

## What was added

Three purple waves start at the edge of the search disc (96pt), spread to the outer ring (220pt) and
fade out, one after another, for as long as the screen is open.

| Value           | Setting                                        |
| --------------- | ---------------------------------------------- |
| Waves           | 3, evenly spaced in time                       |
| One wave's trip | 2.4 s, slowing down as it spreads              |
| Colour          | `color.purple`, from 35% opacity to 0%         |
| Size            | from the disc (96pt) to the outer ring (220pt) |

The two lavender rings, the disc and everything else stay exactly as designed. The code is
`apps/customer/src/features/job/components/SearchRipple.tsx`.

## Consequences

- With the system "reduce motion" setting on, no waves are drawn and the screen is the still design.
- The waves stay inside the outer ring, so the layout does not change.
- `pnpm visual` captures this screen mid-animation, so the ring area never matches the design
  screenshot pixel for pixel.
- The timing and opacity are the developer's choice, not the designer's. If the designer specifies
  the animation, replace the values in `SearchRipple.tsx` with theirs.

## Update, design v3 (2026-11-18)

The designer has now specified the animation (`motion.searchWaves` in `design/tokens.json`): 3 waves,
2.4 s each, 0.8 s apart, ease-out `cubic-bezier(0, 0, 0.2, 1)`, scale 1 to 2.29, opacity 0.35 to 0.
`SearchRipple.tsx` was replaced by the shared `Ripple` component in `packages/ui`, which reads those
values from the tokens. This addition is now part of the approved design.
