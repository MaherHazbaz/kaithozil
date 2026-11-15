# What changed since the first handoff

## New screens (33)

- **Customer · Saved addresses** (`source/Addresses.dc.html`)
- **Customer · Payments** (`source/Payments.dc.html`)
- **Shared · Language** (`source/Language.dc.html`)
- **Worker · Payment details** (`source/WPayments.dc.html`)
- **Worker · Government schemes** (`source/Schemes.dc.html`)
- **Worker · Training and level up** (`source/Training.dc.html`)
- **Customer · Schedule a time** (`source/Schedule.dc.html`)
- **Customer · Add or edit address** (`source/AddressEdit.dc.html`)
- **Customer · Photos and voice note** (`source/Media.dc.html`)
- **Customer · Mechanic job** (`source/MechPost.dc.html`)
- **Shared · Permissions** (`source/Permissions.dc.html`)
- **Worker · Consent** (`source/Consent.dc.html`)
- **Worker · Identity check** (`source/KYC.dc.html`)
- **Worker · Skill video** (`source/SkillVideo.dc.html`)
- **Worker · Battery guide** (`source/BatteryGuide.dc.html`)
- **Customer · Cancel booking** (`source/CancelBooking.dc.html`)
- **Shared · Chat and masked call** (`source/Chat.dc.html`)
- **Customer · Job receipt** (`source/Receipt.dc.html`)
- **Shared · Support ticket** (`source/Ticket.dc.html`)
- **Worker · Can't continue a job** (`source/CancelJob.dc.html`)
- **Worker · Share your work** (`source/PostWork.dc.html`)
- **Worker · My work portfolio** (`source/WPortfolio.dc.html`)
- **Customer · Search workers** (`source/Search.dc.html`)
- **Customer · Worker profile** (`source/WorkerProfile.dc.html`)
- **Customer · Booking request sent** (`source/RequestSent.dc.html`)
- **Worker · Booking request** (`source/BookingRequest.dc.html`)
- **Worker · Suggest another time** (`source/WSuggest.dc.html`)
- **Worker · My jobs** (`source/WRequests.dc.html`)
- **Customer · Request a site visit** (`source/QuoteRequest.dc.html`)
- **Worker · Send a quote** (`source/SendQuote.dc.html`)
- **Customer · Your quote** (`source/QuoteView.dc.html`)
- **Customer · Tailor booking** (`source/TailorBook.dc.html`)
- **Customer · Crew profile** (`source/CrewProfile.dc.html`)

## Updated screens (16)

- **Worker · Current job**: "Running late?" opens chat; new "Can't continue this job" link
- **Customer · Worker profile (book again)**: Book button now sends a booking request (Booking request sent)
- **Customer · Bookings**: "Book again" on past jobs is now "View receipt"
- **Customer · Book construction crew**: New "Prefer to choose your crew?" link to crew profiles; screen height on the canvas is now 673
- **Worker · Finish job and get paid**: "Yes, received" now leads to Share your work
- **Start · Log in with OTP**: Verify and continue now goes to Permissions
- **Customer · Home**: Plumber (tap) and Carpenter (sofa) icons, new Mechanic tile, search bar opens Search, Painter/Carpenter/Tailor tiles open their own flows
- **Customer · Describe the job**: No problem preselected, button disabled with a reason, empty description with a hint (required for "Other"), photo/voice and schedule links, address Change link
- **Customer · Profile**: Saved addresses, Payments and Language rows open their screens
- **Customer · Finding a worker**: Ripple waves around the search circle (2.4 s, staggered)
- **Customer · Help and support**: Each issue opens a support ticket
- **Customer · Worker on the way**: Cancel opens Cancel booking; call and message open Chat
- **Worker · Verification**: Aadhaar KYC and Skill check rows open their screens
- **Worker · Profile**: New "My work" row; Payments, Schemes, Training and Language rows open their screens
- **Worker · Sign-up**: Continue now goes to Consent
- **Worker · Home and new job**: New "Booking requests" and "Make sure job alerts ring" cards

## Design tokens

`tokens.json` gains new colours (danger, disabled text, toggle off, mango border…), gradients (welcome hero, deep and lavender cards, photo placeholders), the Bebas Neue font and the dark confirm button. Nothing was renamed or removed.

## Changes made in the app code and brought back into the design

- Plumber and Carpenter icons, the Mechanic tile (decision record 0004)
- Clearer job descriptions on Describe the job (0005)
- Ripple waves on Finding a worker (0006)
