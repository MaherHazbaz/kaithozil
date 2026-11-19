# To do when the backend is built

Things decided during frontend work that need the backend (Supabase, Sprint 2 onward). Add to this
list whenever a frontend decision leaves work for the server.

## Estimated price by problem

Asked for by the owner on 2026-11-12.

- **Now:** Describe the job shows one fixed sample range ("₹400 – 700") for every problem. It is
  passed in by the route, `apps/customer/src/app/job/new.tsx`.
- **Wanted:** the range changes with the complexity of the work. Each problem chip has its own range
  (a fan repair costs less than rewiring), and the "Estimated cost" line updates when a chip is
  picked.
- **Rules agreed:**
  - Prices come from the server, so they can change without an app release.
  - "Other" shows no numbers, only "agreed on site".
  - Before a chip is picked, show the range for the whole service.
  - "· agreed on site" stays on every estimate.
- **Needs from the owner:** the real price ranges for each problem of each service.
- **Later, each needing its own pricing rule:** extra charges for urgent "Now" jobs, night hours and
  distance.

## App status: maintenance and minimum version

Added 2026-11-19.

- **Now:** `fetchAppStatus()` in `packages/core/src/appStatus.ts` returns sample data: every
  version allowed, no maintenance. The app checks it at launch and whenever it returns to the
  foreground, and shows Under maintenance or Update required over the app.
- **Wanted:** a public, read-only row on the server with `minimumVersion`, `maintenance` and the
  "back by" time (the `[TIME]` placeholder on Under maintenance). Readable without logging in, so it
  works before log in.
- **Also:** "Update now" opens the Play Store listing once the app is published.

## Connection check

Added 2026-11-19.

- **Now:** `isOnline()` in `packages/core/src/connectivity.ts` sends an empty request to Google's
  `generate_204` address (the one Android itself uses). No package was added for this, so the app is
  no bigger.
- **Wanted:** point it at a tiny endpoint on our own server that answers `204`, so no request goes
  to a third party.
