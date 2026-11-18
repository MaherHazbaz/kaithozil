import type { IconName } from '@kaithozhil/ui';

import type { SupportIssue, TicketStatus } from './copy';

/** The job a ticket is about ("Fan repair · KT-20481"). */
export type SupportJob = {
  /** The job's service icon, e.g. "zap" for electrical. */
  icon: IconName;
  /** "Fan repair · KT-20481" */
  title: string;
  /** "10 Nov · Murugan K. · ₹650" */
  detail: string;
};

export type TicketMessage = {
  id: string;
  from: 'customer' | 'support';
  text: string;
  /** "5:02 PM". Absent on a reply that has just been sent from this screen. */
  time?: string;
};

export type SupportTicket = {
  /** "T-1042" */
  reference: string;
  issue: SupportIssue;
  job: SupportJob;
  status: TicketStatus;
  /** When each step was reached, e.g. { received: '5:02 PM' }. */
  times: Partial<Record<TicketStatus, string>>;
  messages: readonly TicketMessage[];
};
