# 0007: Waves on the Permissions screen (addition to the approved design)

Date: 2026-11-18. Status: built at the owner's request.

## Why

The owner asked for the same waving animation as Finding a worker around the icon on each
Permissions step (location, notifications, camera). `design/source/Permissions.dc.html` draws the
icon still.

## What was added

Three purple waves start at the edge of the 84pt icon disc and spread to the 180pt outer ring,
fading out, one after another, for as long as the step is shown. They use the design's own
`motion.systemRipple` tokens (2.4 s per wave, 0.8 s apart, scale 1 to 2.14, opacity 0.32 to 0), the
same timing as the search waves on Finding a worker. Scale 2.14 is exactly 180 / 84, so the waves end
at the outer ring.

## Consequences

- With the system "reduce motion" setting on, no waves are drawn and the screen is the still design.
- The waves stay inside the rings, so the layout does not change.
- `pnpm visual` captures this screen mid-animation, so the ring area never matches the design
  screenshot pixel for pixel.
- If the designer adds motion to this screen, replace these values with theirs.
