import { useState } from 'react';

import { useAsyncAction } from '@/hooks/useAsyncAction';

import { viewForResult, type PayView } from '../payFlow';
import type { PayMethod, PaymentResult } from '../types';

export type PayFlowActions = {
  /**
   * Starts a payment through the payment partner and resolves with what the
   * bank confirmed. Rejects when the app could not get an answer at all.
   */
  onStartPayment: (method: PayMethod) => Promise<PaymentResult>;
  /** Records that the customer paid in cash. Rejects to stay on the disclaimer. */
  onConfirmCash: () => Promise<void>;
};

/**
 * The states of Pay and rate and how taps move between them (the script in
 * Pay.dc.html). The screen only renders what this returns.
 */
export function usePayFlow(
  { onStartPayment, onConfirmCash }: PayFlowActions,
  initialView: PayView = 'choose',
) {
  const [view, setView] = useState<PayView>(initialView);
  const [verified, setVerified] = useState<Extract<PaymentResult, { status: 'verified' }> | null>(
    null,
  );
  const { busy, run } = useAsyncAction();

  const startPay = (method: PayMethod) => {
    const from = view;
    void run(async () => {
      setView('checking');
      try {
        const result = await onStartPayment(method);
        if (result.status === 'verified') setVerified(result);
        setView(viewForResult(result));
      } catch (error) {
        // No answer is not the same as "didn't go through": the failed state
        // promises no money was taken, which the app cannot know. Go back to
        // where the customer was; the server's idempotency key stops a retry
        // from charging twice.
        setView(from);
        throw error;
      }
    });
  };

  const confirmCash = () => {
    void run(async () => {
      await onConfirmCash();
      setView('cashDone');
    });
  };

  return {
    view,
    verified,
    busy,
    startPay,
    confirmCash,
    showQr: () => setView('qr'),
    toCash: () => setView('cash'),
    backToChoose: () => setView('choose'),
  };
}
