import type { SupportJob, SupportTicket } from './types';

// The design's sample data (design/source/Support.dc.html and Ticket.dc.html).
// Used by the routes until tickets come from Supabase; delete this file then.

export const SAMPLE_LAST_JOB: SupportJob = {
  icon: 'zap',
  title: 'Fan repair · KT-20481',
  detail: '10 Nov · Murugan K. · ₹650',
};

export const SAMPLE_TICKET: SupportTicket = {
  reference: 'T-1042',
  issue: 'paidShowsUnpaid',
  job: SAMPLE_LAST_JOB,
  status: 'lookingIntoIt',
  times: { received: '5:02 PM', lookingIntoIt: '5:10 PM' },
  messages: [
    {
      id: 'm1',
      from: 'customer',
      text: 'I paid ₹650 by UPI but the app still shows unpaid. UPI ref ending 4821.',
      time: '5:02 PM',
    },
    {
      id: 'm2',
      from: 'support',
      text: "Thanks, Priya. We've asked Murugan to confirm he received it, and we're checking the UPI reference. We'll update you within [RESPONSE TIME]. — Kavya, Kaithozhil support",
      time: '5:10 PM',
    },
  ],
};
