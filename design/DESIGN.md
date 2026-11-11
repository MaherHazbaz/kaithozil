# Kaithozhil design handoff

This folder is the source of truth for the app's UI. Rebuild every screen in Flutter to match it exactly.

## What's here

| Folder | Contents |
|---|---|
| `source/` | The original design files (`*.dc.html`). Every colour, size, radius, shadow, gap and text is in the inline styles. `canvas.json` lists the screens in order. |
| `preview/` | The same screens as plain HTML files you can open in a browser (shown in their default state). |
| `screenshots/` | 3x PNG renders of every screen (1170 x 2532 for phone screens) to compare against, plus frames of the opening animation. |
| `assets/` | `logo.png` (square, cream background) and `logo-transparent.png`. |
| `tokens.json` | All design tokens: colours, gradients, shadows, radii, sizes, fonts, type styles. |

The matching Flutter theme is in `flutter_starter/lib/theme/kaithozhil_theme.dart`.

## Rules for matching the design

1. The design frame is **390 x 844 logical pixels**, which Flutter uses directly as its logical pixels.
2. Use the exact values from `source/` and `tokens.json`. Don't eyeball from screenshots when the source has the number.
3. **English first, Tamil secondary** on every screen, exactly as the design shows.
4. Touch targets are at least 44 x 44.
5. Content areas scroll; headers and bottom bars stay fixed. Nothing may overlap the bottom navigation.
6. Layouts must stay correct from 360 to 430 px wide (use `Expanded` / `Flexible`, never fixed widths for full-width content).
7. Respect the system "reduce motion" setting (show final states without animation).
8. Check each finished screen against its screenshot, ideally with a golden test on a 390 x 844 surface.
9. Screenshots were rendered with stand-in fonts, so letter widths differ slightly; the fonts below are the correct ones.

## Fonts (bundle them in the app, all Open Font License)

- **Plus Jakarta Sans** 400, 500, 600, 700, 800: all English text
- **Noto Sans Tamil** 400, 600, 700: all Tamil text
- **Anton** 400: the giant letters and title in the opening animation

```yaml
flutter:
  fonts:
    - family: PlusJakartaSans
      fonts:
        - asset: assets/fonts/PlusJakartaSans-Regular.ttf
        - asset: assets/fonts/PlusJakartaSans-Medium.ttf
          weight: 500
        - asset: assets/fonts/PlusJakartaSans-SemiBold.ttf
          weight: 600
        - asset: assets/fonts/PlusJakartaSans-Bold.ttf
          weight: 700
        - asset: assets/fonts/PlusJakartaSans-ExtraBold.ttf
          weight: 800
    - family: NotoSansTamil
      fonts:
        - asset: assets/fonts/NotoSansTamil-Regular.ttf
        - asset: assets/fonts/NotoSansTamil-SemiBold.ttf
          weight: 600
        - asset: assets/fonts/NotoSansTamil-Bold.ttf
          weight: 700
    - family: Anton
      fonts:
        - asset: assets/fonts/Anton-Regular.ttf
```

Download the font files from Google Fonts.

## Screens

| Screen | Suggested route | Source | Screenshot | Behaviour | Links to |
|---|---|---|---|---|---|
| Start · Opening animation | `/splash` | `source/Splash.dc.html` | `screenshots/Splash.png` | Opening animation (6 s), then goes to Welcome automatically; tap anywhere to skip | Welcome |
| Start · Welcome | `/welcome` | `source/Welcome.dc.html` | `screenshots/Welcome.png` | Language choice (English / Tamil) and role choice | Login |
| Start · Log in with OTP | `/login` | `source/Login.dc.html` | `screenshots/Login.png` | Mobile number + 6-digit OTP | Main, WSignup, Welcome |
| Worker · Sign-up | `/worker/signup` | `source/WSignup.dc.html` | `screenshots/WSignup.png` | Worker details: name, trade (single choice), years (stepper), UPI ID with name match, e-Shram UAN | Login, Verify |
| Worker · Verification | `/worker/verify` | `source/Verify.dc.html` | `screenshots/Verify.png` | Verification checklist; Start on Safety basics marks it done and moves progress to 4 of 5 | WSignup, Worker |
| Customer · Home | `/home` | `source/Main.dc.html` | `screenshots/Main.png` | Customer home: hero header, scrollable service tiles, auto-sliding benefits carousel (3.5 s per slide, 4 slides, tap dots), crew card, book again | Book, Bookings, Crew, Main, Post, Profile |
| Customer · Describe the job | `/job/new` | `source/Post.dc.html` | `screenshots/Post.png` | Problem chips (single), description, photo, voice note, Now vs Schedule (button text changes), address | Main, Searching |
| Customer · Finding a worker | `/job/searching` | `source/Searching.dc.html` | `screenshots/Searching.png` | Calling workers one at a time | Main, Tracking |
| Customer · Worker on the way | `/job/tracking` | `source/Tracking.dc.html` | `screenshots/Tracking.png` | Map, ETA, call/message, 4-digit start code, pay link, cancel | Main, Pay, Searching |
| Customer · Pay and rate | `/job/pay` | `source/Pay.dc.html` | `screenshots/Pay.png` | Job summary, Pay with UPI (opens UPI app), 1-5 star rating with label, feedback chips (multi) | Bookings |
| Customer · Worker profile (book again) | `/worker/:id` | `source/Book.dc.html` | `screenshots/Book.png` | Worker profile, time-slot choice (button text updates) | Main, Tracking |
| Customer · Book construction crew | `/crew/new` | `source/Crew.dc.html` | `screenshots/Crew.png` | Work type chips, steppers per role (0-20), days stepper (1-60), mestri toggle, live summary | CrewTeam, Main |
| Customer · Crew confirmed | `/crew/:id` | `source/CrewTeam.dc.html` | `screenshots/CrewTeam.png` | Crew confirmed: mestri, members by role, stats, attendance note | Bookings, Crew |
| Customer · Bookings | `/bookings` | `source/Bookings.dc.html` | `screenshots/Bookings.png` | Tabs Upcoming / Past switch the list | Book, Bookings, CrewTeam, Main, Profile, Searching, Support |
| Customer · Profile | `/profile` | `source/Profile.dc.html` | `screenshots/Profile.png` | Customer profile rows | Bookings, Main, Profile, Support, Welcome |
| Customer · Help and support | `/support` | `source/Support.dc.html` | `screenshots/Support.png` | Last job, issue list (I feel unsafe highlighted), call / WhatsApp | Profile |
| Worker · Home and new job | `/w/home` | `source/Worker.dc.html` | `screenshots/Worker.png` | Worker home: online toggle (offline card), stats, new job card with Accept and Decline (waiting card + undo), team jobs link | ActiveJob, CrewRing, Earnings, WProfile, Worker |
| Worker · Incoming job (ringing) | `/w/incoming` | `source/Ringing.dc.html` | `screenshots/Ringing.png` | Full-screen job alert: 30 s countdown, job card, listen, Accept, Decline | ActiveJob, Worker |
| Worker · Incoming team job (mestri) | `/w/incoming-team` | `source/CrewRing.dc.html` | `screenshots/CrewRing.png` | Team job alert for mestris (45 s) | CrewTeam, Worker |
| Worker · Current job | `/w/job/:id` | `source/ActiveJob.dc.html` | `screenshots/ActiveJob.png` | Progress steps, customer card, navigate/call, voice note, start-code entry | JobDone, Worker |
| Worker · Finish job and get paid | `/w/job/:id/finish` | `source/JobDone.dc.html` | `screenshots/JobDone.png` | Work done chips (multi), final amount, photo, bill sent, Not yet (reminder message) / Yes received | ActiveJob, Earnings |
| Worker · Earnings and level | `/w/earnings` | `source/Earnings.dc.html` | `screenshots/Earnings.png` | Month total, weekly bars, level progress, recent payments, Statements link | Earnings, Statements, WProfile, Worker |
| Worker · Earnings statements | `/w/statements` | `source/Statements.dc.html` | `screenshots/Statements.png` | Statement list, 6-month download, WhatsApp share | Earnings, Statement |
| Monthly earnings statement (A4 PDF) | `(PDF)` | `source/Statement.dc.html` | `screenshots/Statement.png` | A4 monthly earnings statement template | - |
| Worker · Profile | `/w/profile` | `source/WProfile.dc.html` | `screenshots/WProfile.png` | Worker profile rows | Earnings, Statements, Support, WProfile, Welcome, Worker |

## Shared components to build once

- **Hero header**: `KGradients.hero`, bottom radius 34, padding 20, used on customer and worker home.
- **Floating bottom navigation**: height 68, margin 0 14 16 14, radius 24, `KShadows.nav`; active tab has a lavender (#EFE9FB) pill, radius 18. Customer: Home / Bookings / Profile. Worker: Jobs / Earnings / Profile.
- **Primary button**: height 56 (48-72 by context), radius 16, `KGradients.button`, `KShadows.button`, white 16/700 text.
- **Gold button** (accept on alerts): `KGradients.goldButton`, `KShadows.goldButton`, text #3B2300.
- **Secondary button**: height 48, radius 14, white, border #DDD8E8, purple 14/700 text.
- **Chip**: height 44, pill radius, off = white with #DDD8E8 border, on = #EFE9FB fill with 2 px #4C1D95 border and purple text.
- **Card**: white, radius 20, border #EEEAF6, `KShadows.card`.
- **List row**: min height 52, icon box 36 (radius 12, lavender), title 15/700, subtitle 12 muted, chevron.
- **Stepper**: two 44 x 44 buttons (outline minus, filled purple plus) around a bold number.
- **Status pill**: 12/700 text, radius 8, padding 4 x 8 (purple on lavender, or mango text on mango tint).
- **Avatar initials**: circle, mango tint background, #7C4A03 text.
- **Icons**: the design uses Lucide-style 24 px stroke icons (stroke 2). The `lucide_icons` Flutter package matches them.

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

The exact keyframes are in `source/Splash.dc.html`. In Flutter, build it with one `AnimationController` (6 s) and `Interval`s so every element follows the same clock.
