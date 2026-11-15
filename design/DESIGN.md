# Kaithozhil design handoff (version 2)

This folder is the source of truth for the app's UI: **58 screens**. Build every screen to match it exactly.

## What's here

| Folder / file | Contents |
|---|---|
| `source/` | The original design files (`*.dc.html`). Every colour, size, radius, shadow, gap and piece of text is in the inline styles. `canvas.json` lists every screen and how the canvas groups them. |
| `preview/` | Each screen as a plain HTML file you can open in a browser, in its default state. |
| `screenshots/` | 3x PNG renders of every screen (1170 x 2532 for phone screens; the A4 statement at 2382 x 3369), plus frames of the opening animation. Rendered with the real fonts. |
| `assets/` | `logo.png` (square, cream background) and `logo-transparent.png`. |
| `tokens.json` | All design tokens: colours, gradients, shadows, radii, sizes, fonts, type styles. Version 2 only **adds** values; nothing from version 1 was renamed or removed. |
| `CHANGES.md` | What's new or changed since the first handoff. |

## Rules for matching the design

1. The design frame is **390 x 844**. CSS pixels in the source equal React Native points, 1:1.
2. Use the exact values from `source/` and `tokens.json`. Don't eyeball from screenshots when the source has the number.
3. **English first, Tamil secondary** on every screen, exactly as designed. Don't reword text without asking.
4. Touch targets are at least 44 x 44.
5. Content areas scroll; headers and bottom bars stay fixed. Nothing overlaps the bottom navigation.
6. Layouts must stay correct from 360 to 430 px wide.
7. Respect "reduce motion": show final states without animation.
8. Check each finished screen against its screenshot (visual QA report), on the emulator.
9. Placeholders in square brackets (for example **[VISIT FEE]**, **[DAILY RATE]**, **[CANCELLATION RULE]**, **[RESPONSE TIME]**, **[HELP CENTRE]**, **[TEST CENTRE]**, **[REVIEW TIME]**, **[PICKUP FEE]**) are decisions still to be made: keep them visible and list them in your open questions.
10. Numbers, names and amounts on screens are **sample data**. Real values come from the backend.

### Translating the CSS to React Native

- Flexbox maps directly, but React Native defaults to `flexDirection: 'column'`; set directions explicitly to match the CSS.
- `linear-gradient(angle, …)` → `expo-linear-gradient` start/end points calculated from the angle.
- `line-height` is absolute in React Native (font size x CSS line-height).
- `box-shadow` → `boxShadow` (New Architecture) with the same values.
- Interactive states (selected chips, steppers, toggles, tabs, enabled/disabled buttons) are written in each source file's script block: read it for the rules (for example, which fields must be filled before a button turns on).
- Some screens have several states in one file (shown with `sc-if`): for example the identity check (DigiLocker → selfie → result) and the booking-request outcomes. Build each state.
- **Booking request sent** has a design tweak called "Reply" (Waiting / Accepted / New time suggested / Declined) used to preview the four outcomes; in the app the state comes from the server.

## Fonts (bundle them in the app, all Open Font License)

- **Plus Jakarta Sans** 400, 500, 600, 700, 800: English text
- **Noto Sans Tamil** 400, 600, 700: Tamil text
- **Anton** 400: opening animation
- **Bebas Neue** 400: the app name on the Welcome screen (new in version 2)

Icons are Lucide (stroke 2): use `lucide-react-native`, or the exact SVG paths in the source files.

## Screens, grouped as on the canvas

### Start: opening animation, welcome, login and worker sign-up

| Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|
| Start · Opening animation | `/splash` | `source/Splash.dc.html` | `screenshots/Splash.png` | Welcome |
| Start · Welcome | `/welcome` | `source/Welcome.dc.html` | `screenshots/Welcome.png` | Login |
| Start · Log in with OTP *(updated)* | `/login` | `source/Login.dc.html` | `screenshots/Login.png` | Permissions, WSignup, Welcome |
| Worker · Sign-up *(updated)* | `/w/signup` | `source/WSignup.dc.html` | `screenshots/WSignup.png` | Consent, Login |
| Worker · Verification *(updated)* | `/w/verify` | `source/Verify.dc.html` | `screenshots/Verify.png` | KYC, SkillVideo, WSignup, Worker |

### Customer: book a repair

| Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|
| Customer · Home *(updated)* | `/home` | `source/Main.dc.html` | `screenshots/Main.png` | Book, Bookings, Crew, MechPost, Post, Profile, QuoteRequest, Search, TailorBook |
| Customer · Describe the job *(updated)* | `/job/new` | `source/Post.dc.html` | `screenshots/Post.png` | Addresses, Main, Media, Schedule |
| Customer · Finding a worker *(updated)* | `/job/searching` | `source/Searching.dc.html` | `screenshots/Searching.png` | Main, Tracking |
| Customer · Worker on the way *(updated)* | `/job/:id/tracking` | `source/Tracking.dc.html` | `screenshots/Tracking.png` | CancelBooking, Chat, Pay, Searching |
| Customer · Pay and rate | `/job/:id/pay` | `source/Pay.dc.html` | `screenshots/Pay.png` | Bookings |
| Customer · Worker profile (book again) *(updated)* | `/worker/:id/book` | `source/Book.dc.html` | `screenshots/Book.png` | Main, RequestSent |

### Customer: construction crew and account

| Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|
| Customer · Book construction crew *(updated)* | `/crew/new` | `source/Crew.dc.html` | `screenshots/Crew.png` | CrewProfile, CrewTeam, Main |
| Customer · Crew confirmed | `/crew/:id` | `source/CrewTeam.dc.html` | `screenshots/CrewTeam.png` | Bookings, Crew |
| Customer · Bookings *(updated)* | `/bookings` | `source/Bookings.dc.html` | `screenshots/Bookings.png` | CrewTeam, Main, Profile, Receipt, Searching, Support |
| Customer · Profile *(updated)* | `/profile` | `source/Profile.dc.html` | `screenshots/Profile.png` | Addresses, Bookings, Language, Main, Payments, Support, Welcome |
| Customer · Help and support *(updated)* | `/support` | `source/Support.dc.html` | `screenshots/Support.png` | Profile, Ticket |

### Worker: getting and doing jobs

| Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|
| Worker · Home and new job *(updated)* | `/w/home` | `source/Worker.dc.html` | `screenshots/Worker.png` | ActiveJob, BatteryGuide, CrewRing, Earnings, WProfile, WRequests |
| Worker · Incoming job (ringing) | `/w/incoming` | `source/Ringing.dc.html` | `screenshots/Ringing.png` | ActiveJob, Worker |
| Worker · Incoming team job (mestri) | `/w/incoming-team` | `source/CrewRing.dc.html` | `screenshots/CrewRing.png` | CrewTeam, Worker |
| Worker · Current job *(updated)* | `/w/job/:id` | `source/ActiveJob.dc.html` | `screenshots/ActiveJob.png` | CancelJob, Chat, JobDone, Worker |
| Worker · Finish job and get paid *(updated)* | `/w/job/:id/finish` | `source/JobDone.dc.html` | `screenshots/JobDone.png` | ActiveJob, PostWork |

### Worker: earnings and profile

| Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|
| Worker · Earnings and level | `/w/earnings` | `source/Earnings.dc.html` | `screenshots/Earnings.png` | Statements, WProfile, Worker |
| Worker · Earnings statements | `/w/statements` | `source/Statements.dc.html` | `screenshots/Statements.png` | Earnings, Statement |
| Monthly earnings statement (A4 PDF) | `(server PDF)` | `source/Statement.dc.html` | `screenshots/Statement.png` | - |
| Worker · Profile *(updated)* | `/w/profile` | `source/WProfile.dc.html` | `screenshots/WProfile.png` | Earnings, Language, Schemes, Statements, Support, Training, WPayments, WPortfolio, Welcome, Worker |

### Settings and growth

| Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|
| Customer · Saved addresses **(new)** | `/addresses` | `source/Addresses.dc.html` | `screenshots/Addresses.png` | AddressEdit, Profile |
| Customer · Payments **(new)** | `/payments` | `source/Payments.dc.html` | `screenshots/Payments.png` | Profile |
| Shared · Language **(new)** | `/language` | `source/Language.dc.html` | `screenshots/Language.png` | Profile |
| Worker · Payment details **(new)** | `/w/payment-details` | `source/WPayments.dc.html` | `screenshots/WPayments.png` | Earnings, Statements, WProfile |
| Worker · Government schemes **(new)** | `/w/schemes` | `source/Schemes.dc.html` | `screenshots/Schemes.png` | WProfile |
| Worker · Training and level up **(new)** | `/w/training` | `source/Training.dc.html` | `screenshots/Training.png` | WProfile |

### Booking details

| Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|
| Customer · Schedule a time **(new)** | `/job/new/schedule` | `source/Schedule.dc.html` | `screenshots/Schedule.png` | Post |
| Customer · Add or edit address **(new)** | `/addresses/edit` | `source/AddressEdit.dc.html` | `screenshots/AddressEdit.png` | Addresses |
| Customer · Photos and voice note **(new)** | `/job/new/media` | `source/Media.dc.html` | `screenshots/Media.png` | Post |
| Customer · Mechanic job **(new)** | `/job/new/mechanic` | `source/MechPost.dc.html` | `screenshots/MechPost.png` | Addresses, Main, Media, Schedule |

### Onboarding and trust

| Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|
| Shared · Permissions **(new)** | `/permissions` | `source/Permissions.dc.html` | `screenshots/Permissions.png` | - |
| Worker · Consent **(new)** | `/w/consent` | `source/Consent.dc.html` | `screenshots/Consent.png` | WSignup |
| Worker · Identity check **(new)** | `/w/verify/identity` | `source/KYC.dc.html` | `screenshots/KYC.png` | Verify |
| Worker · Skill video **(new)** | `/w/verify/skill` | `source/SkillVideo.dc.html` | `screenshots/SkillVideo.png` | Verify |
| Worker · Battery guide **(new)** | `` | `source/BatteryGuide.dc.html` | `screenshots/BatteryGuide.png` | Ringing, Worker |

### Cancellations, chat and help

| Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|
| Customer · Cancel booking **(new)** | `/job/:id/cancel` | `source/CancelBooking.dc.html` | `screenshots/CancelBooking.png` | Schedule, Tracking |
| Shared · Chat and masked call **(new)** | `/job/:id/chat` | `source/Chat.dc.html` | `screenshots/Chat.png` | Tracking |
| Customer · Job receipt **(new)** | `/job/:id/receipt` | `source/Receipt.dc.html` | `screenshots/Receipt.png` | Book, Bookings, Support |
| Shared · Support ticket **(new)** | `/support/:id` | `source/Ticket.dc.html` | `screenshots/Ticket.png` | Support |
| Worker · Can't continue a job **(new)** | `/w/job/:id/cancel` | `source/CancelJob.dc.html` | `screenshots/CancelJob.png` | ActiveJob, Support |

### Worker portfolios

| Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|
| Worker · Share your work **(new)** | `/w/job/:id/share` | `source/PostWork.dc.html` | `screenshots/PostWork.png` | Earnings, JobDone, WPortfolio |
| Worker · My work portfolio **(new)** | `/w/portfolio` | `source/WPortfolio.dc.html` | `screenshots/WPortfolio.png` | PostWork, WProfile, WorkerProfile |
| Customer · Search workers **(new)** | `/search` | `source/Search.dc.html` | `screenshots/Search.png` | Main, Post, WorkerProfile |
| Customer · Worker profile **(new)** | `/worker/:id` | `source/WorkerProfile.dc.html` | `screenshots/WorkerProfile.png` | Book, Search |

### Direct booking from a profile

| Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|
| Customer · Booking request sent **(new)** | `/booking/:id` | `source/RequestSent.dc.html` | `screenshots/RequestSent.png` | Bookings, Chat, Schedule, Search, Searching, WorkerProfile |
| Worker · Booking request **(new)** | `/w/request/:id` | `source/BookingRequest.dc.html` | `screenshots/BookingRequest.png` | Chat, WRequests, WSuggest |
| Worker · Suggest another time **(new)** | `/w/request/:id/suggest` | `source/WSuggest.dc.html` | `screenshots/WSuggest.png` | BookingRequest |
| Worker · My jobs **(new)** | `/w/jobs` | `source/WRequests.dc.html` | `screenshots/WRequests.png` | ActiveJob, BookingRequest, Chat, Earnings, PostWork, SendQuote, WProfile, Worker |

### Every trade: quotes, tailors and crews

| Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|
| Customer · Request a site visit **(new)** | `/job/new/visit` | `source/QuoteRequest.dc.html` | `screenshots/QuoteRequest.png` | Addresses, Bookings, Main, Media, QuoteView, Schedule |
| Worker · Send a quote **(new)** | `/w/quote/:id` | `source/SendQuote.dc.html` | `screenshots/SendQuote.png` | WRequests |
| Customer · Your quote **(new)** | `/quote/:id` | `source/QuoteView.dc.html` | `screenshots/QuoteView.png` | Bookings, Chat, Search, WorkerProfile |
| Customer · Tailor booking **(new)** | `/job/new/tailor` | `source/TailorBook.dc.html` | `screenshots/TailorBook.png` | Main, Media |
| Customer · Crew profile **(new)** | `/crews/:id` | `source/CrewProfile.dc.html` | `screenshots/CrewProfile.png` | Crew |

## New flows in version 2, in short

- **Booking details:** schedule picker (2-hour slots, 2 hours' notice, full/passed slots), add or edit address with a map pin, photos (up to 3) and a voice note, and a mechanic job (vehicle type, problem, broken down on the road).
- **Onboarding and trust:** permissions explained one at a time, worker consent (required vs optional), identity check with **DigiLocker (Aadhaar + PAN), selfie with liveness and face match**, skill video, and a battery-settings guide so job alerts ring.
- **Cancellations, chat and help:** cancel a booking, "can't continue this job" for workers, chat with **masked calling**, job receipt with both payment confirmations, support ticket with a status timeline.
- **Worker portfolios:** share work only from completed Kaithozhil jobs, with the customer's permission and automatic blurring; "My work"; customer search; public worker profile. **No contact details anywhere; booking only through the app.**
- **Direct booking from a profile:** request sent (four outcomes), the worker's booking request (accept, suggest a time, decline), suggest another time, and "My jobs" (requests, upcoming, done).
- **Every trade:** painters and carpenters book a site visit, then get an itemised quote (with staged payments); tailors choose shop visit, home measurement or pickup; construction crews have a team profile.
- **Settings and growth:** saved addresses, payments (preferred UPI app), language, worker payment details, government schemes, training and levels.

## Shared components to build once

- **Hero header:** hero gradient, bottom radius 34 (30 on profile headers), padding 20.
- **Floating bottom navigation:** height 68, margin 0 14 16 14, radius 24; active tab has a lavender (#EFE9FB) pill, radius 18. Customer: Home / Bookings / Profile. Worker: Jobs / Earnings / Profile.
- **Primary button:** height 56 (44–48 for small inline buttons), radius 16, button gradient and shadow, white 16/700 text. **Disabled:** 50% opacity, no shadow, with a one-line reason underneath.
- **Gold button:** gold gradient and shadow, text #3B2300.
- **Dark confirm button** (destructive): #1C1730 background, white text.
- **Secondary button:** height 48, radius 14, white, border #DDD8E8, purple 14/700 text.
- **Chip:** height 44, pill; off = white with #DDD8E8 border; on = #EFE9FB with a 2 px #4C1D95 border and purple text.
- **Radio row and tick card:** 22 px radio (7 px purple ring when on) and 28 px tick box.
- **Toggle:** 52 x 30 track, #4C1D95 on, #CFC9DC off, 24 px white knob.
- **Card:** white, radius 20, border #EEEAF6, card shadow.
- **List row, stepper, status pill, avatar initials** as in version 1.
- **Segmented tabs:** #F0EDF5 track, radius 12; active tab white with a soft shadow.
- **Chat bubble:** mine = purple with 18 18 4 18 corners; theirs = white with a border, 18 18 18 4.
- **Photo tile:** square, radius 14, with the gold "Kaithozhil job" badge on job-verified posts.
- **Status timeline:** 24 px dots (done = purple tick, now = gold ring, to do = grey).

## Opening animation (Splash) timeline, 6 s total

| Time | What happens |
|---|---|
| 0 - 3.8 s | Giant "KAITHOZHIL" (Anton, letters filling the screen height) pans steadily left from T-H-O towards Z-H, never stopping or reversing. Letters are filled with a vertical sky gradient #120626 > #3B1574 > #6A3BB5 > #DDD3F5 > #FBDD96 that slowly rises. |
| 1.1 - 3.8 s | The camera smoothly zooms out from scale 1 to 0.27 while still panning (smootherstep easing). |
| 1.3 - 2.5 s | Crossfade: gradient letters on near-black (#0D0420) become dark letters (#0D0420 at 88%) over a sky background with the same gradient. |
| 3.0 - 4.3 s | The sky fades to the deep end gradient #1E0A3F > #2E0F5E > #3A2F4F; the big letters stay as a faint shadow. |
| 3.5 - 4.8 s | "KAITHOZHIL" (Anton 58, letter spacing 2) fades in from blur 4 and scale 1.12; a purple > lavender > gold shimmer runs across it every 4 s. |
| 3.7 - 4.9 s | Logo (108 x 108, radius 32) rises 16 px and scales from 0.86 to 1. |
| 4.3 - 5.4 s | Tamil name கைத்தொழில் rises in (17/600, #DDD3F5). |
| 6.4 s | Navigate to Welcome automatically. Tapping anywhere skips immediately. |

The exact keyframes are in `source/Splash.dc.html`. In React Native, drive every element from one Reanimated shared value (0 → 1 over 6 s) so they all follow the same clock; draw the giant gradient letters with Skia.

