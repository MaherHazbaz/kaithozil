import type { PaymentResult } from './types';

/**
 * Where Pay and rate is. The design draws these as one screen with
 * several states (Pay.dc.html `view`):
 * - choose: pick a UPI app, a QR code or cash
 * - qr: the QR code for this job
 * - checking: waiting for the bank to confirm
 * - verified / failed: what the payment partner reported
 * - cash: the cash disclaimer, cashDone once the customer confirms it
 */
export type PayView = 'choose' | 'qr' | 'checking' | 'verified' | 'failed' | 'cash' | 'cashDone';

/** The view to show once the payment partner has answered. */
export function viewForResult(result: PaymentResult): PayView {
  return result.status === 'verified' ? 'verified' : 'failed';
}

/**
 * Rating opens only after the job is settled: a verified payment, or cash the
 * customer confirmed (CHANGES.md: "rating only after payment").
 */
export function canRate(view: PayView): boolean {
  return view === 'verified' || view === 'cashDone';
}
