import { ticketStatuses, type TicketStatus } from './copy';

export type StepState = 'done' | 'current' | 'upcoming';

const ORDER = Object.keys(ticketStatuses) as TicketStatus[];

/**
 * How each timeline step is drawn for a ticket's status. Steps before the
 * status are done and the status itself is current, except "Resolved": a
 * resolved ticket has nothing left in progress, so every step is done.
 */
export function stepState(step: TicketStatus, status: TicketStatus): StepState {
  if (status === 'resolved') return 'done';
  const stepIndex = ORDER.indexOf(step);
  const statusIndex = ORDER.indexOf(status);
  if (stepIndex < statusIndex) return 'done';
  return stepIndex === statusIndex ? 'current' : 'upcoming';
}

export const TICKET_STEPS = ORDER;
