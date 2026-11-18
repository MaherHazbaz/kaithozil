// Exact wording from design/source/{Support,Ticket}.dc.html.
// English first, Tamil secondary. These move into en.json / ta.json when i18next is added.
//
// Square-bracket values are decisions still to be made (DESIGN.md "Placeholders to decide").

/** The issues a customer can raise, in the design's order. Each opens a ticket. */
export const supportIssues = {
  notArrived: "Worker didn't arrive",
  poorWork: "Work wasn't done properly",
  paidShowsUnpaid: 'I paid, but it shows unpaid',
  overcharged: 'Charged more than agreed',
  unsafe: 'I feel unsafe',
  other: 'Something else',
} as const;

export type SupportIssue = keyof typeof supportIssues;

export const supportCopy = {
  title: 'Help and support',
  titleTamil: 'உதவி',
  lastJob: 'About your last job',
  whatWentWrong: 'What went wrong?',
  call: 'Call us',
  whatsApp: 'WhatsApp us',
  hours: 'Support in English and Tamil · [SUPPORT HOURS]',
} as const;

export const ticketStatuses = {
  received: 'Received',
  lookingIntoIt: 'Looking into it',
  resolved: 'Resolved',
} as const;

export type TicketStatus = keyof typeof ticketStatuses;

export const ticketCopy = {
  title: (reference: string) => `Ticket ${reference}`,
  titleTamil: 'உதவி கோரிக்கை',
  back: 'Back',
  yourIssue: 'Your issue',
  messages: 'Messages',
  you: 'You',
  support: 'Support',
  messageMeta: (author: string, time: string) => `${author} · ${time}`,
  unsafe: 'Feel unsafe? ',
  callSafetyLine: 'Call our safety line now',
  // aria-label in the design (the attach and send buttons show only icons).
  attach: 'Attach a screenshot',
  replyLabel: 'Reply',
  replyPlaceholder: 'Write a reply',
  send: 'Send reply',
  // NOT visible in the design: read after "Status" so the pill makes sense on its own.
  statusLabel: (status: string) => `Status: ${status}`,
} as const;
