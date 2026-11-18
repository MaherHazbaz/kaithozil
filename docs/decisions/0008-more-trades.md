# 0008: Plumber, AC repair and Carpenter on Describe the job

Date: 2026-11-18. Status: wording approved by the owner.

## Why

Home has Plumber, AC repair and Carpenter tiles, but `design/source/Post.dc.html` (Describe the job)
is drawn for Electrician only. Plumber and AC repair did nothing when tapped, and Carpenter opened
the painter's site-visit request ("How many days and painters?").

## What was decided

Each trade opens the same Describe the job screen as Electrician, with its own wording, in
`jobServices` (`apps/customer/src/features/job/copy.ts`). The keys match the Home tiles (`plumber`,
`ac`, `carpenter`).

|                              | Plumber                                                                            | AC repair                                                                                             | Carpenter                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Title / Tamil                | Plumber · குழாய்                                                                   | AC repair · ஏசி பழுது                                                                                 | Carpenter · தச்சர்                                                               |
| Problem chips                | Tap / Leak, Blocked drain, Toilet / Flush, Water tank / Motor, Pipe fitting, Other | Not cooling, Water leaking, Noise / Smell, Gas refill, Service / Cleaning, Install / Uninstall, Other | Door / Lock, Window, Furniture repair, Cupboard / Shelf, Hinges / Handles, Other |
| Example in empty box         | e.g. Kitchen tap leaking under the sink.                                           | e.g. Bedroom AC runs but doesn't cool, drips water.                                                   | e.g. Bedroom door won't close, hinge is loose.                                   |
| Main button (now / schedule) | Find a plumber / Schedule a plumber                                                | Find an AC technician / Schedule an AC technician                                                     | Find a carpenter / Schedule a carpenter                                          |
| Finding a worker heading     | Finding a plumber                                                                  | Finding an AC technician                                                                              | Finding a carpenter                                                              |

Carpenter uses the quick flow for small repairs. Custom furniture fits a site visit and quote (like
Painter) and is added once that wording is approved.

## Consequences

- The Tamil titles are the design's Home tile labels. Everything else is English only until the owner
  gives the Tamil.
- The sample address and estimate (`₹400 – 700`) on Describe the job and the sample job on Finding a
  worker are the electrician's; real values come from the server (Sprint 2).
- "Other" needs a description for every trade (decision 0005).
- The designer should add these trades to `Post.dc.html`; when that happens, use the designer's values.
