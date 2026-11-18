# What changed since version 2

Version 2 had 58 screens. Version 3 has **98**.

## New screens (40)

- **Shared · No internet** (`source/NoInternet.dc.html`)
- **Shared · Something went wrong** (`source/ErrorState.dc.html`)
- **Shared · Empty list** (`source/EmptyState.dc.html`)
- **Shared · Update required** (`source/UpdateApp.dc.html`)
- **Shared · Under maintenance** (`source/Maintenance.dc.html`)
- **Customer · Housekeeping** (`source/HousekeepingBook.dc.html`)
- **Customer · Job plan** (`source/JobPlan.dc.html`)
- **Customer · Job progress** (`source/JobProgress.dc.html`)
- **Customer · Daily crew payments** (`source/CrewPayments.dc.html`)
- **Customer · Order status (tailor)** (`source/OrderStatus.dc.html`)
- **Customer · Pickup and delivery** (`source/Handover.dc.html`)
- **Customer · After the trial day** (`source/TrialDecision.dc.html`)
- **Customer · Regular help** (`source/HousekeepingPlan.dc.html`)
- **Customer · Approve leave** (`source/LeaveApprove.dc.html`)
- **Customer · Check the bill** (`source/BillApprove.dc.html`)
- **Shared · Report a problem** (`source/ReportProblem.dc.html`)
- **Shared · Record the work done** (`source/WorkRecord.dc.html`)
- **Shared · Settle the payment** (`source/Settlement.dc.html`)
- **Shared · Dispute status** (`source/DisputeStatus.dc.html`)
- **Customer · My measurements** (`source/MyMeasurements.dc.html`)
- **Shared · Safety and emergency contacts** (`source/Safety.dc.html`)
- **Shared · Terms and privacy** (`source/Legal.dc.html`)
- **Shared · Log out or delete account** (`source/DeleteAccount.dc.html`)
- **Worker · Site-visit request** (`source/VisitRequest.dc.html`)
- **Worker · Tailor home** (`source/TailorHome.dc.html`)
- **Worker · Tailor's orders** (`source/TailorOrders.dc.html`)
- **Worker · Housekeeper home** (`source/HousekeeperHome.dc.html`)
- **Worker · Start selfie** (`source/SelfieCheck.dc.html`)
- **Worker · Daily check-in (housekeeper)** (`source/HouseCheckIn.dc.html`)
- **Worker · Today's update** (`source/DailyUpdate.dc.html`)
- **Worker · Request a payment** (`source/StageRequest.dc.html`)
- **Worker · Record measurements (tailor)** (`source/Measurements.dc.html`)
- **Shared · Change request** (`source/ChangeRequest.dc.html`)
- **Worker · Ask for leave (housekeeper)** (`source/LeaveRequest.dc.html`)
- **Worker · Rate the customer** (`source/RateCustomer.dc.html`)
- **Worker · Mestri home** (`source/MestriHome.dc.html`)
- **Worker · Daily attendance (mestri)** (`source/CrewAttendance.dc.html`)
- **Worker · Crew invite (helper)** (`source/CrewJoin.dc.html`)
- **Worker · Helper home** (`source/HelperHome.dc.html`)
- **Worker · Platform fee due** (`source/FeeDue.dc.html`)

## Updated screens (56)

**Every updated screen** also received the layout fixes: icons never shrink, items in scrolling areas never squash, pill labels stay on one line, and there's an 8 px gap above the bottom navigation. These don't change the look; they stop overlaps on real phones.

Screens with functional changes:

- **Worker · Current job**: Start selfie first, then arrival and work-start codes; Finish job disabled until work starts; links to change request, daily update, report a problem
- **Customer · Bookings**: Trial day and regular help cards; Upcoming (4)
- **Customer · Book construction crew**: "Not sure how many workers or days?" toggle leading to the job plan; link to crew profiles; full 844 height restored
- **Customer · Crew confirmed**: Link to attendance and daily payments
- **Worker · Earnings and level**: Cash jobs shown separately with the platform fee due (opens Platform fee due)
- **Worker · Finish job and get paid**: Itemised bill; waiting for verified payment, verified, or cash (Payment tweak); then Rate the customer
- **Worker · Identity check**: Rebuilt: DigiLocker with Aadhaar and PAN, Aadhaar QR fallback, selfie liveness, face and name match; ripple while checking
- **Customer · Home**: New Housekeeping tile; wording for door codes
- **Customer · Pay and rate**: Rebuilt for verified gateway payments: UPI app or QR, bank check with ripple, verified or failed, cash with disclaimer; rating only after payment
- **Customer · Describe the job**: "How long might it take?" with "Not sure" option; schedule link and duration placed below the Now/Schedule row
- **Customer · Profile**: Measurements, Safety, Terms and privacy, Log out or delete
- **Customer · Request a site visit**: "How many days and painters?" with "Not sure" option
- **Customer · Your quote**: After accepting, opens Job progress
- **Customer · Job receipt**: Verified payment or "Cash, not verified" (Paid by tweak), arrival and start times
- **Customer · Booking request sent**: Ripple while waiting; door-code wording
- **Customer · Tailor booking**: Booking opens Order status
- **Customer · Worker on the way**: Arrival code, then work-start code (Stage tweak); "Report a problem"; pay goes through Check the bill
- **Worker · Profile**: Safety, Terms and privacy, Log out or delete
- **Worker · My jobs**: Site-visit request and quote cards
- **Worker · Sign-up**: Mechanic and Housekeeping added to trades

Layout fixes only: Customer · Add or edit address, Customer · Saved addresses, Worker · Battery guide, Customer · Worker profile (book again), Worker · Booking request, Customer · Cancel booking, Worker · Can't continue a job, Shared · Chat and masked call, Worker · Consent, Customer · Crew profile, Worker · Incoming team job (mestri), Shared · Language, Start · Log in with OTP, Customer · Mechanic job, Customer · Photos and voice note, Customer · Payments, Shared · Permissions, Worker · Share your work, Worker · Incoming job (ringing), Customer · Schedule a time, Worker · Government schemes, Customer · Search workers, Customer · Finding a worker, Worker · Send a quote, Worker · Skill video, Worker · Earnings statements, Customer · Help and support, Shared · Support ticket, Worker · Training and level up, Worker · Verification, Worker · Payment details, Worker · My work portfolio, Worker · Suggest another time, Start · Welcome, Worker · Home and new job, Customer · Worker profile.

## Tokens

`tokens.json` version 3 adds the **motion** section (search waves, waiting ripple, system ripple, reduce motion) and two colours (`dangerStrong`, `waveGold`). Nothing was renamed or removed.
