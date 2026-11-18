# Implementation plan: customer app, design handoff v3

Status: **customer app first, approved by the owner.** Each phase still waits for the owner's OK
before the next one starts.

Scope: **the customer app only** (`apps/customer`). The worker app is a separate project, built
later (see the end of this file).

Focus: **frontend first.** Every screen is built against typed sample data from `packages/core`, so
it can be finished and reviewed before the backend exists. Screens that need a backend decision are
marked; their UI is built now and wired up when the decision is made.

## Where we are

The design has 98 screens (`design/DESIGN.md`, numbered in workflow order). **57 belong to the
customer app** (customer screens plus the shared screens it uses).

**Built (11):** Opening animation (1), Welcome (2), Log in (3), Home (12), Describe the job (16),
Worker profile (book again) (28), Finding a worker (30), Worker on the way (31), Pay and rate (41),
Bookings (47), Profile (48).

**To build: 46 screens**, plus updating the 11 built ones to v3.

## Sizes and estimates

| Size | Meaning                                                                | Days |
| ---- | ---------------------------------------------------------------------- | ---- |
| S    | List, form, info or state screen using existing components             | 0.5  |
| M    | Several states, a new shared component, or a multi-part form           | 1–2  |
| L    | Device features (camera, mic, map), a multi-step flow or tricky motion | 2–4  |

Days include the quality gates, visual QA against the screenshot, and the owner's review. Rough total
for phases 0–8: **about 60–80 working days**.

## Backend dependencies (UI built now, wired later)

| Tag       | Decision needed                                      | Customer screens           |
| --------- | ---------------------------------------------------- | -------------------------- |
| **PAY**   | Payment partner, verification, cash and platform fee | 33, 37, 40, 41, 42, 45, 51 |
| **CALL**  | Masked calling provider                              | 6, 31                      |
| **SMS**   | SMS / DLT for OTP                                    | 3                          |
| **FILES** | Photo and voice storage                              | 17                         |
| **MAP**   | Maps and location                                    | 19, 31                     |

### Must decide before phase 4: payments conflict with CLAUDE.md

`CLAUDE.md` says: _"The app never holds job money. UPI goes straight from customer to worker
(`upi://pay` links, no payment gateway)."_

Design v3 says: _"customers pay through a payment gateway ([PAYMENT PARTNER])… a job is paid only
when the gateway confirms. Cash is allowed… leaves the platform fee due."_ Pay and rate was rebuilt
around this.

These cannot both be true. The owner needs to confirm which rule wins, then `CLAUDE.md` (and a new
decision record) must be updated before the PAY screens are built. Phases 0–3 do not depend on it.

## Phases

Each phase is done in small steps. After each step: `pnpm check`, `pnpm doctor`, visual QA of every
screen in every state, and the owner's OK. Each phase also leaves the owner one small task to write.

### Phase 0: v3 foundations (about 5–7 days)

Nothing visible changes yet, but every later screen depends on this.

1. **Layout rules** in `packages/ui`: icons never shrink, items in scrolling areas never squash, pill
   labels stay on one line, and there is an 8 px gap above the bottom navigation.
2. **Motion:** a `Ripple` component with search waves, waiting ripple and system ripple, driven by the
   v3 motion tokens and respecting reduce motion. Move Finding a worker onto it.
3. **New shared components** (DESIGN.md "Shared components"): radio row, tick box, toggle, info note
   (lavender/mango), link card, disabled-button reason, day picker, code digits, status timeline, chat
   bubble, photo tile, calendar grid.
4. **Sample data layer:** typed fixtures in `packages/core` behind the same hooks the Supabase calls
   will use later, so screens don't change when the backend arrives. Record this in a decision record.
5. **System states (7–11):** No internet, Something went wrong, Empty list and Under maintenance as
   reusable state components, plus the Update required route (10). Every screen's empty and error
   states use them.

_Owner task:_ write the `TickBox` component and its test.

### Phase 1: update the 11 built screens to v3 (about 5–7 days)

All 11 get the layout fixes. Functional changes from `CHANGES.md`:

| Screen                 | Change                                                                                   |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| Home (12)              | Housekeeping tile, door-code wording                                                     |
| Describe the job (16)  | "How long might it take?" with "Not sure"; schedule link and duration below Now/Schedule |
| Worker on the way (31) | Arrival code, then work-start code; Report a problem; pay goes through Check the bill    |
| Bookings (47)          | Trial day and regular help cards; Upcoming (4)                                           |
| Profile (48)           | Measurements, Safety, Terms and privacy, Log out or delete rows                          |
| Pay and rate (41)      | **PAY, held until phase 4:** rebuilt for gateway payments.                               |

Splash, Welcome, Log in, Worker profile (book again) and Finding a worker get layout fixes only.

_Owner task:_ the visual QA checklist for one updated screen.

### Phases 2–8: new customer screens

| Phase                                      | Screens                                                                                                                                                                                                                     | Size          | Days  | Depends on           |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----- | -------------------- |
| **2. Account and settings**                | Permissions (4), Language (5), Saved addresses (49), Add or edit address (19), Payments (51), Help and support (52), Support ticket (53), Safety (54), Terms and privacy (55), Log out or delete (56), My measurements (50) | 9 S, 2 M      | 8–10  | MAP (19), PAY (51)   |
| **3. Booking a job**                       | Photos and voice note (17), Schedule a time (18), Mechanic job (20), Search workers (13), Worker profile (14), Booking request sent (29), Cancel booking (39), Chat (6)                                                     | 2 S, 4 M, 2 L | 12–15 | FILES (17), CALL (6) |
| **4. Paying for a job**                    | Check the bill (40), Pay and rate rebuild (41), Job receipt (42)                                                                                                                                                            | 1 M, 2 L      | 5–7   | **PAY decision**     |
| **5. Quotes, tailors and change requests** | Request a site visit (21), Your quote (22), Job progress (32), Change request (80), Tailor booking (23), Order status (34), Pickup and delivery (35)                                                                        | 3 S, 4 M      | 9–11  | none                 |
| **6. Housekeeping**                        | Housekeeping (24), After the trial day (36), Regular help (37), Approve leave (38)                                                                                                                                          | 2 S, 2 M      | 5–7   | PAY (37)             |
| **7. Construction crews**                  | Book construction crew (25), Crew profile (15), Job plan (26), Crew confirmed (27), Daily crew payments (33)                                                                                                                | 1 S, 4 M      | 7–9   | PAY (33)             |
| **8. Problems and disputes**               | Report a problem (43), Record the work done (44), Settle the payment (45), Dispute status (46)                                                                                                                              | 1 S, 3 M      | 6–8   | PAY (45)             |

## Why this order

- **Foundations first:** almost every new screen uses the v3 components and ripple. Building them
  once avoids redoing screens.
- **Simple, connected screens first:** phase 2 links from the existing Profile and is mostly small
  screens, which proves the new components quickly.
- **Payments isolated:** phase 4 is kept small and separate, so the payments decision blocks only
  three screens.
- **Specialist flows last:** quotes, tailors, housekeeping, crews and disputes reuse the chat, change
  request, payment and timeline parts built earlier.

## Placeholders

The design's square-bracket placeholders (`[VISIT FEE]`, `[DAILY RATE]`, `[PAYMENT PARTNER]`, …; full
list in DESIGN.md "Placeholders to decide") stay visible as designed. Each phase lists the ones it
touches as open questions for the owner.

## Later: worker app (separate project)

Not in scope now. `apps/worker` doesn't exist yet. It will share `packages/ui` and `packages/core`,
so the phase 0 components carry over. It covers 40 screens: joining and verification (57–62), getting
jobs (63–70), role homes for tailor, housekeeper, mestri and helper (71–73, 86, 89), doing the job
(74–85, except 80), crews (87–88), earnings (90–92) and profile (94–98). Its backend needs add KYC,
push alerts for ringing jobs, video storage, and the statement PDF (93). It gets its own plan when it
starts.
