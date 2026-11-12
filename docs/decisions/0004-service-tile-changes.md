# 0004: Service tile changes (differ from the approved design)

Date: 2026-11-12. Status: accepted by the owner. Waiting for the designer to update `design/`.

## Decision

The owner changed the Customer Home services row:

| Tile                | Design            | App                                                                        |
| ------------------- | ----------------- | -------------------------------------------------------------------------- |
| Plumber             | `droplet` icon    | `faucet` icon (a tap), from current Lucide                                 |
| Carpenter           | `wrench` icon     | `sofa` icon, from current Lucide                                           |
| Mechanic (new, 7th) | not in the design | label Mechanic, Tamil வாகன பழுது, `wrench` icon, mango tone, after Painter |

- **Mechanic** is one tile for every vehicle (bike, car and so on). The customer chooses the vehicle
  type on the Describe-the-job screen. That screen's mechanic problem chips are not designed yet.
- **வாகன பழுது** means "vehicle repair" and follows the pattern of ஏசி பழுது.
- **Wrench** is the common symbol for vehicle repair. It reuses the design's own wrench path, which
  Carpenter no longer uses.
- **Mango** continues the row's mango, lavender, lavender pattern.

Tile size, gap, fonts and colours are unchanged from `design/source/Main.dc.html`.

## Icons from Lucide

Every other icon is drawn from the design's own paths (see 0003). `faucet` and `sofa` are not in the
design, so they are copied verbatim from Lucide's current `icons/faucet.svg` and `icons/sofa.svg` (ISC
licence). Their stroke style (24 x 24, stroke 2, round caps and joins) matches the design's icons.

## Consequences

- `pnpm visual` for Home will differ from `design/screenshots/Main.png` on the Plumber and Carpenter
  icons. This is expected. The Mechanic tile starts off-screen in the sideways-scrolling row.
- The `droplet` icon stays in `Icon.tsx` because it is part of the design's icon set.
- The designer should update `design/source/Main.dc.html` and `design/screenshots/Main.png`. When that
  happens, replace the values here with the designer's.
- The worker side also needs a Mechanic trade in Worker sign-up (`WSignup.dc.html`) before mechanics
  can register. That is a separate decision.
