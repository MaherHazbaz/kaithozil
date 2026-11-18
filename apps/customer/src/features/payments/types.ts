/** The customer's preferred UPI app, or "ask" to choose each time. */
export type UpiAppChoice = 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'ask';

/** One row under "Recent payments". Strings arrive formatted for display. */
export type PaymentRecord = {
  id: string;
  /** "Fan repair · Murugan K." */
  title: string;
  /** "10 Nov · UPI ref ••4821" (only the last digits of the reference). */
  detail: string;
  /** "₹650" */
  amount: string;
};
