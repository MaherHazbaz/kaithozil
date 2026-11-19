# 0009: Mechanic and Housekeeping lead to Finding a worker

Date: 2026-11-19. Status: wording approved by the owner.

## Why

In the design, "Find a mechanic" / "Schedule a mechanic" (`MechPost.dc.html`) and "Find housekeepers" /
"Book a cleaning" (`HousekeepingBook.dc.html`) open Finding a worker (`Searching.dc.html`). That screen
is drawn for Electrician only ("Finding an electrician", "Fan not working · Now"), so the app left both
buttons doing nothing.

## What was decided

| Booking form | Finding a worker heading | Job line under the heading                                                          |
| ------------ | ------------------------ | ----------------------------------------------------------------------------------- |
| Mechanic job | Finding a mechanic       | Vehicle · problem · when, e.g. "Bike or scooter · Won't start · Now"                |
| Housekeeping | Finding a housekeeper    | "Regular help · 6 days a week · 6 – 8 AM" or "One-time cleaning · 2 BHK · 6 – 8 AM" |

- The headings are singular, like "Finding a plumber": the screen calls one worker at a time.
- The job line uses only the form's own labels, so no new wording is added. It is built in
  `mechanicSummary` (`features/job/mechanicDraft.ts`) and `housekeepingSummary`
  (`features/housekeeping/housekeepingDraft.ts`).

## Consequences

- English only, like decision 0008. The Tamil line on Finding a worker is already trade-neutral.
- The job line travels as a route parameter until jobs are saved on the server (Sprint 2); the
  route falls back to the design sample when it is missing or too long to have come from our forms.
- The area, the worker being called and Worker on the way after it are still the electrician sample
  data, as for every other trade.
