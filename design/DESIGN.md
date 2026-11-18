# Kaithozhil design handoff (version 3)

This folder is the source of truth for the mobile app's UI: **98 screens** for customers and workers across every trade (repairs, mechanics, painters and carpenters, tailors, construction crews and helpers, housekeeping). Build every screen to match it exactly. The admin panel (web) is not part of this handoff yet.

## What's here

| Folder / file | Contents |
|---|---|
| `source/` | The original design files (`*.dc.html`). Every colour, size, radius, shadow, gap and piece of text is in the inline styles; interaction rules are in each file's script block. `canvas.json` holds the canvas layout and workflow rows. |
| `preview/` | Each screen as a plain HTML file you can open in a browser, in its default state. |
| `screenshots/` | 3x PNG renders of every screen with the real fonts (1170 x 2532; the A4 statement at 2382 x 3369), plus opening-animation frames. |
| `assets/` | `logo.png` (square, cream background) and `logo-transparent.png`. |
| `tokens.json` | Design tokens, version 3. Adds the **motion** tokens (search waves, waiting ripples) to version 2. Nothing was renamed or removed. |
| `CHANGES.md` | What's new or changed since version 2 (58 screens). |

## Rules for matching the design

1. The design frame is **390 x 844**. CSS pixels in the source equal React Native points, 1:1. Layouts must stay correct from 360 to 430 px wide.
2. Use the exact values from `source/` and `tokens.json`. Don't eyeball from screenshots when the source has the number.
3. **English first, Tamil secondary** on every screen. All text comes from the language files (en, ta) so the language setting changes the whole app, including notifications and SMS.
4. Touch targets at least 44 x 44. Content scrolls; headers and bottom bars stay fixed; nothing overlaps the bottom navigation (keep the 8 px gap above it).
5. **Nothing may shrink or overlap:** icons never shrink next to long text; cards, rows and buttons inside scrolling areas keep their height (the equivalent of `flexShrink: 0`); pill labels stay on one line.
6. Respect reduce motion: no waves, ripples or slide animations when it's on.
7. Placeholders in square brackets are decisions still to be made (see the list at the end). Keep them visible and list them in your open questions.
8. Names, numbers and amounts on screens are **sample data**.
9. Check every screen and every state against its screenshot on the emulator and record it in the visual QA report.

### Translating the CSS to React Native

- Flexbox maps directly, but React Native defaults to `flexDirection: 'column'`; set directions explicitly.
- `linear-gradient(angle, …)` → `expo-linear-gradient` start/end points calculated from the angle.
- `line-height` is absolute in React Native (font size x CSS line-height). `box-shadow` → `boxShadow` (New Architecture).
- Interactive rules (what enables a button, what each tap changes) are in each source file's script block.
- Many screens contain several states in one file (`sc-if` blocks), for example Pay and rate (choose, QR, checking, verified, failed, cash), Identity check (DigiLocker, selfie, result) or Booking request sent (waiting, accepted, new time, declined). Build every state.
- Some screens have **design tweaks** in `data-props` (for example "Reply", "Stage", "Role", "View", "Result", "List", "Type", "Step", "Paid by"). They only switch states for review; in the app the state comes from the server or the user's role.

## Key product rules shown in the designs

- **Verified payments:** customers pay through a payment gateway ([PAYMENT PARTNER]) by UPI app or QR. Opening a UPI app is never proof; a job is paid only when the gateway confirms. Cash is allowed with the disclaimer, is marked "not verified", gets no receipt, doesn't count in statements, and leaves the platform fee due.
- **Two door codes:** an **arrival code**, then a **work-start code**, each time-stamped. Workers also take a **start selfie** matched to their verified photo. Housekeepers **check in with a daily code**.
- **Job plan and changes:** when the customer chooses "Not sure", workers and days are agreed in a job plan; changes need both sides to accept.
- **Disputes:** reporting pauses the job and payments; work done is recorded by milestones; a settlement can be agreed in the app or reviewed by Kaithozhil.
- **Role homes:** the worker app shows a different home per role: Worker (repairs), Tailor home, Mestri home, Helper home, Housekeeper home.
- **No contact details** on profiles or portfolios; booking and payment only through the app.

## Fonts (bundle them, all Open Font License)

- **Plus Jakarta Sans** 400–800 (English), **Noto Sans Tamil** 400/600/700 (Tamil), **Anton** 400 (opening animation), **Bebas Neue** 400 (Welcome title). Icons: Lucide (stroke 2), `lucide-react-native` or the SVG paths in the source.

## Screens, in workflow order (as on the canvas)

### Shared: start, language and chat (1–6)

| # | Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|---|
| 1 | Start · Opening animation | `/splash` | `source/Splash.dc.html` | `screenshots/Splash.png` | Welcome |
| 2 | Start · Welcome *(updated)* | `/welcome` | `source/Welcome.dc.html` | `screenshots/Welcome.png` | Login |
| 3 | Start · Log in with OTP *(updated)* | `/login` | `source/Login.dc.html` | `screenshots/Login.png` | Permissions, WSignup, Welcome |
| 4 | Shared · Permissions *(updated)* | `/permissions` | `source/Permissions.dc.html` | `screenshots/Permissions.png` | - |
| 5 | Shared · Language *(updated)* | `/language` | `source/Language.dc.html` | `screenshots/Language.png` | Profile |
| 6 | Shared · Chat and masked call *(updated)* | `/job/:id/chat` | `source/Chat.dc.html` | `screenshots/Chat.png` | Tracking |

### Shared: system states (7–11)

| # | Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|---|
| 7 | Shared · No internet **(new)** | `(state)` | `source/NoInternet.dc.html` | `screenshots/NoInternet.png` | - |
| 8 | Shared · Something went wrong **(new)** | `(state)` | `source/ErrorState.dc.html` | `screenshots/ErrorState.png` | Main, Support |
| 9 | Shared · Empty list **(new)** | `(state)` | `source/EmptyState.dc.html` | `screenshots/EmptyState.png` | - |
| 10 | Shared · Update required **(new)** | `/update` | `source/UpdateApp.dc.html` | `screenshots/UpdateApp.png` | Main |
| 11 | Shared · Under maintenance **(new)** | `(state)` | `source/Maintenance.dc.html` | `screenshots/Maintenance.png` | - |

### Customer: home and finding workers (12–15)

| # | Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|---|
| 12 | Customer · Home *(updated)* | `/home` | `source/Main.dc.html` | `screenshots/Main.png` | Book, Bookings, Crew, HousekeepingBook, MechPost, Post, Profile, QuoteRequest, Search, TailorBook |
| 13 | Customer · Search workers *(updated)* | `/search` | `source/Search.dc.html` | `screenshots/Search.png` | Main, Post, WorkerProfile |
| 14 | Customer · Worker profile *(updated)* | `/worker/:id` | `source/WorkerProfile.dc.html` | `screenshots/WorkerProfile.png` | Book, Search |
| 15 | Customer · Crew profile *(updated)* | `/crews/:id` | `source/CrewProfile.dc.html` | `screenshots/CrewProfile.png` | Crew |

### Customer: booking a job (16–24)

| # | Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|---|
| 16 | Customer · Describe the job *(updated)* | `/job/new` | `source/Post.dc.html` | `screenshots/Post.png` | Addresses, Main, Media, Schedule |
| 17 | Customer · Photos and voice note *(updated)* | `/job/new/media` | `source/Media.dc.html` | `screenshots/Media.png` | Post |
| 18 | Customer · Schedule a time *(updated)* | `/job/new/schedule` | `source/Schedule.dc.html` | `screenshots/Schedule.png` | Post |
| 19 | Customer · Add or edit address *(updated)* | `/addresses/edit` | `source/AddressEdit.dc.html` | `screenshots/AddressEdit.png` | Addresses |
| 20 | Customer · Mechanic job *(updated)* | `/job/new/mechanic` | `source/MechPost.dc.html` | `screenshots/MechPost.png` | Addresses, Main, Media, Schedule |
| 21 | Customer · Request a site visit *(updated)* | `/job/new/visit` | `source/QuoteRequest.dc.html` | `screenshots/QuoteRequest.png` | Addresses, Bookings, Main, Media, QuoteView, Schedule |
| 22 | Customer · Your quote *(updated)* | `/quote/:id` | `source/QuoteView.dc.html` | `screenshots/QuoteView.png` | Bookings, Chat, JobProgress, Search, WorkerProfile |
| 23 | Customer · Tailor booking *(updated)* | `/job/new/tailor` | `source/TailorBook.dc.html` | `screenshots/TailorBook.png` | Main, Media |
| 24 | Customer · Housekeeping **(new)** | `/job/new/housekeeping` | `source/HousekeepingBook.dc.html` | `screenshots/HousekeepingBook.png` | HousekeepingPlan, Main |

### Customer: crews and booking a chosen worker (25–29)

| # | Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|---|
| 25 | Customer · Book construction crew *(updated)* | `/crew/new` | `source/Crew.dc.html` | `screenshots/Crew.png` | CrewProfile, Main |
| 26 | Customer · Job plan **(new)** | `/job/:id/plan` | `source/JobPlan.dc.html` | `screenshots/JobPlan.png` | Bookings, Crew, CrewTeam |
| 27 | Customer · Crew confirmed *(updated)* | `/crew/:id` | `source/CrewTeam.dc.html` | `screenshots/CrewTeam.png` | Bookings, Crew, CrewPayments |
| 28 | Customer · Worker profile (book again) *(updated)* | `/worker/:id/book` | `source/Book.dc.html` | `screenshots/Book.png` | Main, RequestSent |
| 29 | Customer · Booking request sent *(updated)* | `/booking/:id` | `source/RequestSent.dc.html` | `screenshots/RequestSent.png` | Bookings, Chat, Schedule, Search, Searching, WorkerProfile |

### Customer: during and after the job (30–42)

| # | Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|---|
| 30 | Customer · Finding a worker *(updated)* | `/job/searching` | `source/Searching.dc.html` | `screenshots/Searching.png` | Main, Tracking |
| 31 | Customer · Worker on the way *(updated)* | `/job/:id/tracking` | `source/Tracking.dc.html` | `screenshots/Tracking.png` | BillApprove, CancelBooking, Chat, ReportProblem, Searching |
| 32 | Customer · Job progress **(new)** | `/job/:id/progress` | `source/JobProgress.dc.html` | `screenshots/JobProgress.png` | Bookings, ChangeRequest, Chat, ReportProblem |
| 33 | Customer · Daily crew payments **(new)** | `/crew/:id/payments` | `source/CrewPayments.dc.html` | `screenshots/CrewPayments.png` | CrewTeam, Pay, ReportProblem |
| 34 | Customer · Order status (tailor) **(new)** | `/order/:id` | `source/OrderStatus.dc.html` | `screenshots/OrderStatus.png` | Bookings, ChangeRequest, Chat, Handover, MyMeasurements, Pay, ReportProblem |
| 35 | Customer · Pickup and delivery **(new)** | `/order/:id/handover` | `source/Handover.dc.html` | `screenshots/Handover.png` | Chat, OrderStatus, ReportProblem |
| 36 | Customer · After the trial day **(new)** | `/help/:id/trial` | `source/TrialDecision.dc.html` | `screenshots/TrialDecision.png` | Bookings, HousekeepingPlan, Searching |
| 37 | Customer · Regular help **(new)** | `/help/:id` | `source/HousekeepingPlan.dc.html` | `screenshots/HousekeepingPlan.png` | Bookings, CancelBooking, Chat, LeaveApprove, Pay, ReportProblem, Schedule |
| 38 | Customer · Approve leave **(new)** | `/help/:id/leave/:leaveId` | `source/LeaveApprove.dc.html` | `screenshots/LeaveApprove.png` | Chat, HousekeepingPlan |
| 39 | Customer · Cancel booking *(updated)* | `/job/:id/cancel` | `source/CancelBooking.dc.html` | `screenshots/CancelBooking.png` | Schedule, Tracking |
| 40 | Customer · Check the bill **(new)** | `/job/:id/bill` | `source/BillApprove.dc.html` | `screenshots/BillApprove.png` | Pay, ReportProblem, Tracking |
| 41 | Customer · Pay and rate *(updated)* | `/job/:id/pay` | `source/Pay.dc.html` | `screenshots/Pay.png` | Bookings, Receipt |
| 42 | Customer · Job receipt *(updated)* | `/job/:id/receipt` | `source/Receipt.dc.html` | `screenshots/Receipt.png` | Book, Bookings, Support |

### Shared: problems and disputes (43–46)

| # | Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|---|
| 43 | Shared · Report a problem **(new)** | `/job/:id/problem` | `source/ReportProblem.dc.html` | `screenshots/ReportProblem.png` | Chat, Support, Tracking, WorkRecord |
| 44 | Shared · Record the work done **(new)** | `/job/:id/problem/work` | `source/WorkRecord.dc.html` | `screenshots/WorkRecord.png` | ReportProblem, Settlement |
| 45 | Shared · Settle the payment **(new)** | `/job/:id/problem/settle` | `source/Settlement.dc.html` | `screenshots/Settlement.png` | DisputeStatus, Pay, WorkRecord |
| 46 | Shared · Dispute status **(new)** | `/dispute/:id` | `source/DisputeStatus.dc.html` | `screenshots/DisputeStatus.png` | Pay, Settlement, Ticket |

### Customer: account and help (47–56)

| # | Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|---|
| 47 | Customer · Bookings *(updated)* | `/bookings` | `source/Bookings.dc.html` | `screenshots/Bookings.png` | CrewTeam, HousekeepingPlan, Main, Profile, Receipt, Searching, Support, TrialDecision |
| 48 | Customer · Profile *(updated)* | `/profile` | `source/Profile.dc.html` | `screenshots/Profile.png` | Addresses, Bookings, DeleteAccount, Language, Legal, Main, MyMeasurements, Payments, Safety, Support |
| 49 | Customer · Saved addresses *(updated)* | `/addresses` | `source/Addresses.dc.html` | `screenshots/Addresses.png` | AddressEdit, Profile |
| 50 | Customer · My measurements **(new)** | `/measurements` | `source/MyMeasurements.dc.html` | `screenshots/MyMeasurements.png` | Profile, TailorBook |
| 51 | Customer · Payments *(updated)* | `/payments` | `source/Payments.dc.html` | `screenshots/Payments.png` | Profile |
| 52 | Customer · Help and support *(updated)* | `/support` | `source/Support.dc.html` | `screenshots/Support.png` | Profile, Ticket |
| 53 | Shared · Support ticket *(updated)* | `/support/:id` | `source/Ticket.dc.html` | `screenshots/Ticket.png` | Support |
| 54 | Shared · Safety and emergency contacts **(new)** | `/safety` | `source/Safety.dc.html` | `screenshots/Safety.png` | Profile, Support |
| 55 | Shared · Terms and privacy **(new)** | `/legal` | `source/Legal.dc.html` | `screenshots/Legal.png` | Consent, DeleteAccount, Profile |
| 56 | Shared · Log out or delete account **(new)** | `/account/delete` | `source/DeleteAccount.dc.html` | `screenshots/DeleteAccount.png` | Profile, Welcome |

### Worker: joining and verification (57–62)

| # | Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|---|
| 57 | Worker · Sign-up *(updated)* | `/w/signup` | `source/WSignup.dc.html` | `screenshots/WSignup.png` | Consent, Login |
| 58 | Worker · Consent *(updated)* | `/w/consent` | `source/Consent.dc.html` | `screenshots/Consent.png` | WSignup |
| 59 | Worker · Verification *(updated)* | `/w/verify` | `source/Verify.dc.html` | `screenshots/Verify.png` | KYC, SkillVideo, WSignup, Worker |
| 60 | Worker · Identity check *(updated)* | `/w/verify/identity` | `source/KYC.dc.html` | `screenshots/KYC.png` | Verify |
| 61 | Worker · Skill video *(updated)* | `/w/verify/skill` | `source/SkillVideo.dc.html` | `screenshots/SkillVideo.png` | Verify |
| 62 | Worker · Battery guide *(updated)* | `/w/battery` | `source/BatteryGuide.dc.html` | `screenshots/BatteryGuide.png` | Ringing, Worker |

### Worker: getting jobs (63–73)

| # | Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|---|
| 63 | Worker · Home and new job *(updated)* | `/w/home` | `source/Worker.dc.html` | `screenshots/Worker.png` | ActiveJob, BatteryGuide, CrewRing, Earnings, WProfile, WRequests |
| 64 | Worker · Incoming job (ringing) *(updated)* | `/w/incoming` | `source/Ringing.dc.html` | `screenshots/Ringing.png` | ActiveJob, Worker |
| 65 | Worker · Incoming team job (mestri) *(updated)* | `/w/incoming-team` | `source/CrewRing.dc.html` | `screenshots/CrewRing.png` | CrewTeam, Worker |
| 66 | Worker · My jobs *(updated)* | `/w/jobs` | `source/WRequests.dc.html` | `screenshots/WRequests.png` | ActiveJob, BookingRequest, Chat, Earnings, PostWork, SendQuote, VisitRequest, WProfile, Worker |
| 67 | Worker · Booking request *(updated)* | `/w/request/:id` | `source/BookingRequest.dc.html` | `screenshots/BookingRequest.png` | Chat, WRequests, WSuggest |
| 68 | Worker · Suggest another time *(updated)* | `/w/request/:id/suggest` | `source/WSuggest.dc.html` | `screenshots/WSuggest.png` | BookingRequest |
| 69 | Worker · Site-visit request **(new)** | `/w/visit/:id` | `source/VisitRequest.dc.html` | `screenshots/VisitRequest.png` | Chat, SendQuote, WRequests, WSuggest |
| 70 | Worker · Send a quote *(updated)* | `/w/quote/:id` | `source/SendQuote.dc.html` | `screenshots/SendQuote.png` | WRequests |
| 71 | Worker · Tailor home **(new)** | `/w/home (tailor)` | `source/TailorHome.dc.html` | `screenshots/TailorHome.png` | Earnings, Handover, Measurements, TailorOrders, WProfile, Worker |
| 72 | Worker · Tailor's orders **(new)** | `/w/orders` | `source/TailorOrders.dc.html` | `screenshots/TailorOrders.png` | Earnings, Measurements, TailorHome, WProfile, Worker |
| 73 | Worker · Housekeeper home **(new)** | `/w/home (housekeeper)` | `source/HousekeeperHome.dc.html` | `screenshots/HousekeeperHome.png` | Earnings, HouseCheckIn, LeaveRequest, Safety, Support, Tracking, WProfile, Worker |

### Worker: doing the job (74–85)

| # | Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|---|
| 74 | Worker · Start selfie **(new)** | `/w/job/:id/selfie` | `source/SelfieCheck.dc.html` | `screenshots/SelfieCheck.png` | ActiveJob, Support |
| 75 | Worker · Current job *(updated)* | `/w/job/:id` | `source/ActiveJob.dc.html` | `screenshots/ActiveJob.png` | CancelJob, ChangeRequest, Chat, DailyUpdate, ReportProblem, SelfieCheck, Worker |
| 76 | Worker · Daily check-in (housekeeper) **(new)** | `/w/visit/:id/check-in` | `source/HouseCheckIn.dc.html` | `screenshots/HouseCheckIn.png` | HousekeeperHome |
| 77 | Worker · Today's update **(new)** | `/w/job/:id/update` | `source/DailyUpdate.dc.html` | `screenshots/DailyUpdate.png` | ActiveJob, StageRequest |
| 78 | Worker · Request a payment **(new)** | `/w/job/:id/request-payment` | `source/StageRequest.dc.html` | `screenshots/StageRequest.png` | ActiveJob, DailyUpdate |
| 79 | Worker · Record measurements (tailor) **(new)** | `/w/order/:id/measure` | `source/Measurements.dc.html` | `screenshots/Measurements.png` | TailorOrders |
| 80 | Shared · Change request **(new)** | `/job/:id/change` | `source/ChangeRequest.dc.html` | `screenshots/ChangeRequest.png` | ActiveJob, Chat, Tracking |
| 81 | Worker · Can't continue a job *(updated)* | `/w/job/:id/cancel` | `source/CancelJob.dc.html` | `screenshots/CancelJob.png` | ActiveJob, Support |
| 82 | Worker · Ask for leave (housekeeper) **(new)** | `/w/leave` | `source/LeaveRequest.dc.html` | `screenshots/LeaveRequest.png` | HousekeeperHome |
| 83 | Worker · Finish job and get paid *(updated)* | `/w/job/:id/finish` | `source/JobDone.dc.html` | `screenshots/JobDone.png` | ActiveJob, RateCustomer |
| 84 | Worker · Rate the customer **(new)** | `/w/job/:id/rate` | `source/RateCustomer.dc.html` | `screenshots/RateCustomer.png` | JobDone, PostWork, ReportProblem |
| 85 | Worker · Share your work *(updated)* | `/w/job/:id/share` | `source/PostWork.dc.html` | `screenshots/PostWork.png` | Earnings, JobDone, WPortfolio |

### Worker: construction crews (86–89)

| # | Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|---|
| 86 | Worker · Mestri home **(new)** | `/w/home (mestri)` | `source/MestriHome.dc.html` | `screenshots/MestriHome.png` | CrewAttendance, CrewJoin, CrewProfile, CrewRing, Earnings, WProfile, Worker |
| 87 | Worker · Daily attendance (mestri) **(new)** | `/w/crew/attendance` | `source/CrewAttendance.dc.html` | `screenshots/CrewAttendance.png` | CrewTeam, MestriHome |
| 88 | Worker · Crew invite (helper) **(new)** | `/w/crew/invite/:id` | `source/CrewJoin.dc.html` | `screenshots/CrewJoin.png` | HelperHome, KYC |
| 89 | Worker · Helper home **(new)** | `/w/home (helper)` | `source/HelperHome.dc.html` | `screenshots/HelperHome.png` | Earnings, Support, Tracking, WProfile, Worker |

### Worker: earnings (90–93)

| # | Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|---|
| 90 | Worker · Earnings and level *(updated)* | `/w/earnings` | `source/Earnings.dc.html` | `screenshots/Earnings.png` | FeeDue, Statements, WProfile, Worker |
| 91 | Worker · Platform fee due **(new)** | `/w/fees` | `source/FeeDue.dc.html` | `screenshots/FeeDue.png` | Earnings |
| 92 | Worker · Earnings statements *(updated)* | `/w/statements` | `source/Statements.dc.html` | `screenshots/Statements.png` | Earnings, Statement |
| 93 | Monthly earnings statement (A4 PDF) | `(server PDF)` | `source/Statement.dc.html` | `screenshots/Statement.png` | - |

### Worker: profile and growth (94–98)

| # | Screen | Route | Source | Screenshot | Links to |
|---|---|---|---|---|---|
| 94 | Worker · Profile *(updated)* | `/w/profile` | `source/WProfile.dc.html` | `screenshots/WProfile.png` | DeleteAccount, Earnings, Language, Legal, Safety, Schemes, Statements, Support, Training, WPayments, WPortfolio, Worker |
| 95 | Worker · My work portfolio *(updated)* | `/w/portfolio` | `source/WPortfolio.dc.html` | `screenshots/WPortfolio.png` | PostWork, WProfile, WorkerProfile |
| 96 | Worker · Payment details *(updated)* | `/w/payment-details` | `source/WPayments.dc.html` | `screenshots/WPayments.png` | Earnings, Statements, WProfile |
| 97 | Worker · Government schemes *(updated)* | `/w/schemes` | `source/Schemes.dc.html` | `screenshots/Schemes.png` | WProfile |
| 98 | Worker · Training and level up *(updated)* | `/w/training` | `source/Training.dc.html` | `screenshots/Training.png` | WProfile |

## Shared components

- **Hero header**, **floating bottom navigation** (68 high, 8 px gap above it; customer: Home / Bookings / Profile; worker: Jobs / Earnings / Profile).
- **Buttons:** primary (gradient, 56), gold, secondary (48, outlined), dark confirm (destructive), disabled (50% opacity with a one-line reason underneath).
- **Chips** (44, pill, one line), **radio rows**, **tick boxes**, **toggles** (52 x 30), **steppers**, **segmented tabs**, **day pickers**, **status pills**, **avatars with initials**.
- **Cards** (white, radius 20, soft purple shadow), **info notes** (lavender for information, mango for warnings), **link cards**.
- **Code digits** (door, pickup, check-in codes), **status timeline** (done / now / to do), **chat bubbles**, **photo tiles** (with the "Kaithozhil job" badge), **calendar grid** (housekeeping attendance).
- **Waiting icon with ripple waves** (see Motion).

## Motion

| Name | Where | Spec |
|---|---|---|
| Search waves | Finding a worker | 3 waves, 2.4 s each, 0.8 s apart, ease-out `cubic-bezier(0, 0, 0.2, 1)`, scale 1 → 2.29, opacity 0.35 → 0, purple |
| Waiting ripple | Every waiting state: Booking request sent, Change request, Job plan, Settlement, Share your work, Request a payment, Ask for leave, Pay (bank check), Platform fee (bank check), Identity check, Start selfie | Same timing, scale 1 → 1.9, opacity 0.32 → 0; purple on lavender icons, gold on mango icons; reserve a box 1.9x the icon so waves never cover text |
| System ripple | No internet (while checking), Under maintenance | Same timing, scale 1 → 2.14 |
| Opening animation | Splash | See below |

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



## Placeholders to decide

| Placeholder | Used on |
|---|---|
| `[AMOUNT]` | HousekeepingPlan |
| `[APP SIZE]` | UpdateApp |
| `[CANCELLATION RULE]` | CancelBooking, Legal |
| `[DAILY RATE]` | CrewJoin, CrewProfile, CrewRing, HelperHome, JobPlan |
| `[DATE]` | Legal |
| `[DATE + 30 DAYS]` | DeleteAccount |
| `[DAY TOTAL]` | CrewPayments |
| `[EMAIL]` | Legal |
| `[FEE]` | Earnings, FeeDue, JobDone, Legal |
| `[FEE TOTAL]` | FeeDue |
| `[GRIEVANCE OFFICER]` | Legal |
| `[HELP CENTRE]` | KYC |
| `[LEAVE DAYS]` | HousekeepingPlan |
| `[MONTHLY RATE]` | HousekeepingBook, TrialDecision |
| `[PAID SO FAR]` | CrewPayments |
| `[PAYMENT PARTNER]` | JobDone, Pay, Receipt |
| `[PICKUP FEE]` | TailorBook |
| `[RATE]` | CrewPayments |
| `[REFUND DAYS]` | Pay |
| `[RESPONSE TIME]` | Legal, Ticket |
| `[RETENTION PERIOD]` | DeleteAccount, Legal |
| `[REVIEW TIME]` | SkillVideo |
| `[SAFETY NUMBER]` | Safety |
| `[SUPPORT HOURS]` | Support |
| `[SUPPORT NUMBER]` | Maintenance, NoInternet |
| `[TEST CENTRE]` | SkillVideo, Verify |
| `[TIME]` | Maintenance |
| `[VERSION]` | Legal, UpdateApp |
| `[VISIT FEE]` | QuoteRequest, VisitRequest |
| `[VISIT RATE]` | HousekeepingBook, TrialDecision |
| `[YOUR WEBSITE]` | Statement |
