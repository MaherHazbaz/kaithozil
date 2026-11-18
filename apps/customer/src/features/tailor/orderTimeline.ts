import { orderCopy } from './copy';
import type { OrderDates, OrderStage } from './types';

export type OrderStepState = 'done' | 'current' | 'upcoming';

export type OrderStep = { key: string; label: string; time: string; state: OrderStepState };

const STAGES: readonly OrderStage[] = ['stitching', 'ready', 'delivered'];

/** Reads a stage from a URL (`?stage=Ready`); anything else is null. */
export function parseOrderStage(value: unknown): OrderStage | null {
  if (typeof value !== 'string') return null;
  const lower = value.toLowerCase();
  return STAGES.find((stage) => stage === lower) ?? null;
}

/**
 * The timeline rows for a stage, exactly as OrderStatus.dc.html draws them.
 *
 * WHY the labels change with the stage: the step in progress is worded as
 * what is happening ("Stitching", "Ready · out for delivery") and the same
 * step, once finished, as what was done ("Stitched"). After delivery the
 * "Ready" step is dropped: it no longer tells the customer anything.
 */
export function orderTimeline(stage: OrderStage, dates: OrderDates): readonly OrderStep[] {
  const steps = orderCopy.steps;
  const booked: OrderStep = {
    key: 'booked',
    label: steps.booked,
    time: dates.booked,
    state: 'done',
  };
  const measured: OrderStep = {
    key: 'measured',
    label: steps.measured,
    time: dates.measured,
    state: 'done',
  };
  const stitched: OrderStep = {
    key: 'stitching',
    label: steps.stitched,
    time: dates.stitched ?? '',
    state: 'done',
  };
  const delivered: OrderStep = {
    key: 'delivered',
    label: steps.delivered,
    time: '',
    state: 'upcoming',
  };

  switch (stage) {
    case 'stitching':
      return [
        booked,
        measured,
        { key: 'stitching', label: steps.stitching, time: orderCopy.now, state: 'current' },
        {
          key: 'ready',
          label: steps.ready,
          time: orderCopy.readyBy(dates.due),
          state: 'upcoming',
        },
        delivered,
      ];
    case 'ready':
      return [
        booked,
        measured,
        stitched,
        { key: 'ready', label: steps.readyOut, time: orderCopy.today, state: 'current' },
        delivered,
      ];
    case 'delivered':
      return [
        booked,
        measured,
        stitched,
        { ...delivered, time: dates.delivered ?? '', state: 'done' },
      ];
  }
}
