// Wording for paying a finished job, exactly as in the design. Moves to
// en.json / ta.json with i18next. Square-bracket placeholders ([PAYMENT
// PARTNER], [REFUND DAYS]) are decisions still to be made (DESIGN.md
// "Placeholders to decide") and stay visible until they are.

// design/source/BillApprove.dc.html
export const billCopy = {
  back: 'Back',
  title: 'Check the bill',
  titleTamil: 'கட்டணத்தைச் சரிபாருங்கள்',
  finished: (firstName: string) => `${firstName} finished the job`,
  jobLine: (service: string, jobId: string, time: string) => `${service} · ${jobId} · ${time}`,
  billHeading: 'Bill · கட்டண விவரம்',
  total: 'Total',
  withinEstimate: (range: string) => `Within the estimate of ${range}`,
  photosHeading: 'Photos of the finished work',
  photoLabel: (n: number) => `Finished work photo ${n}`,
  flaggedLead: "Something's not right?",
  flaggedBody: (firstName: string) =>
    ` Don't pay yet. Tell us what's wrong; we'll pause the job and help you and ${firstName} sort it out. `,
  reportProblem: 'Report a problem',
  pay: (amount: string) => `Looks right, pay ${amount}`,
  flag: "Something's not right",
  unflag: 'Never mind, the bill is fine',
} as const;

// design/source/Pay.dc.html
export const payCopy = {
  title: 'Job completed',
  subtitle: (firstName: string) =>
    `${firstName} marked your job as done. Check the work, then pay.`,
  workDone: 'Work done',
  worker: 'Worker',
  jobId: 'Job ID',
  total: 'Total',
  payHeading: (amount: string) => `Pay ${amount} securely`,
  payHeadingTamil: 'பாதுகாப்பாகச் செலுத்துங்கள்',
  apps: [
    { method: 'googlePay', badge: 'G', label: 'Google Pay' },
    { method: 'phonePe', badge: 'P', label: 'PhonePe' },
    { method: 'paytm', badge: 'Pt', label: 'Paytm' },
    { method: 'otherUpi', badge: 'U', label: 'Other UPI' },
  ],
  payWith: (app: string) => `Pay with ${app}`,
  showQr: 'Show a QR code instead',
  partnerNote: (firstName: string) =>
    `Payment goes through [PAYMENT PARTNER], a licensed payment company. ${firstName} is paid as soon as your bank confirms, and the job is marked paid only then.`,
  toCash: 'Paying in cash instead?',
  qrLabel: (amount: string) => `UPI QR code for ${amount}`,
  qrTitle: (amount: string) => `Scan with any UPI app · ${amount}`,
  qrNote: (jobId: string) => `This code is only for job ${jobId} and expires in 10 minutes.`,
  qrPaid: "I've paid, check now",
  checkingTitle: 'Waiting for your bank to confirm…',
  checkingBody:
    "Please don't close this screen. Opening a UPI app alone doesn't complete the payment.",
  verifiedTitle: (amount: string) => `Payment verified · ${amount}`,
  verifiedDetail: (reference: string, time: string, workerName: string) =>
    `UPI ref ${reference} · ${time} · paid to ${workerName}`,
  viewReceipt: 'View receipt',
  failedTitle: "Payment didn't go through",
  failedBody:
    "No money was taken. If your bank did take it, it's refunded automatically within [REFUND DAYS].",
  tryAgain: 'Try again',
  cashTitle: 'Paying in cash',
  cashDisclaimer:
    'Cash payments are not recorded or verified by Kaithozhil. The platform cannot provide payment confirmation or proof for cash transactions. Any cash payment is settled directly between the customer and the worker.',
  cashConfirm: (amount: string) => `I understand, I paid ${amount} in cash`,
  payInApp: 'Pay in the app instead',
  cashDoneTitle: 'Recorded as cash · not verified',
  cashDoneBody: 'No receipt or payment proof is created for cash payments.',
  ratingHeading: 'How was the work?',
  ratingGroupLabel: 'Rate from 1 to 5 stars',
  starLabel: (stars: number) => `${stars} ${stars === 1 ? 'star' : 'stars'}`,
  /** Shown beside the heading; index = number of stars, 0 = not rated yet. */
  ratingWords: ['', 'Poor', 'Okay', 'Good', 'Very good', 'Excellent'],
  feedbackTags: [
    { key: 'onTime', label: 'On time' },
    { key: 'neatWork', label: 'Neat work' },
    { key: 'fairPrice', label: 'Fair price' },
  ],
  done: 'Done',
} as const;

// design/source/Receipt.dc.html
export const receiptCopy = {
  back: 'Back',
  title: 'Job receipt',
  titleTamil: 'வேலை ரசீது',
  brand: 'Kaithozhil',
  receiptNo: (jobId: string) => `Receipt · ${jobId}`,
  paidLine: {
    upi: (workerName: string) => `Paid to ${workerName} by UPI · verified`,
    cash: (workerName: string) => `Paid to ${workerName} in cash (not verified)`,
  },
  service: 'Service',
  workDone: 'Work done',
  date: 'Date',
  times: (started: string, finished: string) => `Started ${started} · finished ${finished}`,
  address: 'Address',
  worker: 'Worker',
  upiReference: 'UPI reference',
  noReference: 'None (cash)',
  verifiedTitle: 'Verified payment ✓',
  verifiedDetail: (time: string) => `Confirmed by the bank through [PAYMENT PARTNER] · ${time}`,
  arrived: 'Arrived ✓',
  workStarted: 'Work started ✓',
  codeMatched: (time: string) => `${time} · code matched`,
  cashLead: 'Cash, not verified.',
  cashBody:
    ' Cash payments are not recorded or verified by Kaithozhil. The platform cannot provide payment confirmation or proof for cash transactions. Any cash payment is settled directly between the customer and the worker.',
  footNote: {
    upi: "Kaithozhil's fee is shown separately. This receipt can be used as proof of payment.",
    cash: "Cash jobs have no payment proof and are not counted in the worker's statement.",
  },
  download: 'Download PDF',
  share: 'Share',
  bookAgain: (firstName: string) => `Book ${firstName} again`,
  help: 'Something wrong? Get help',
} as const;
