// Paying for a finished job: Check the bill (BillApprove.dc.html), Pay and
// rate (Pay.dc.html) and the Job receipt (Receipt.dc.html). Every amount is
// whole rupees; the server sends them and recalculates them. The app only
// decides what to show.

export type BillLine = {
  /** "Labour", "Parts · new regulator", "Extra work you approved". */
  label: string;
  amountRupees: number;
};

/** The worker's estimate before the job, e.g. ₹400 – 700. */
export type Estimate = { minRupees: number; maxRupees: number };

export type BillWorker = {
  id: string;
  /** "Murugan K." */
  name: string;
  firstName: string;
  initials: string;
};

/** The finished job and its bill, as the worker submitted it. */
export type JobBill = {
  /** "KT-20481" */
  jobId: string;
  worker: BillWorker;
  /** "Fan repair" */
  service: string;
  /** "4:31 – 4:48 PM" */
  workTime: string;
  /** Pay.dc.html "Work done": "Fan repair + new regulator". */
  workDone: string;
  lines: readonly BillLine[];
  estimate: Estimate;
  /** How many photos of the finished work the worker added. */
  photoCount: number;
};

/** The UPI apps on Pay.dc.html, plus the QR code. */
export type PayMethod = 'googlePay' | 'phonePe' | 'paytm' | 'otherUpi' | 'qr';

/**
 * What the payment partner reported. A job is paid only when the bank
 * confirms; opening a UPI app proves nothing (DESIGN.md "Verified payments").
 */
export type PaymentResult =
  | {
      status: 'verified';
      /** Last digits of the UPI reference, e.g. "••4821". */
      reference: string;
      /** "4:52 PM" */
      time: string;
    }
  | { status: 'failed' };

/** Receipt.dc.html "Paid by" tweak: a verified UPI payment or cash. */
export type PaidBy = 'upi' | 'cash';

export type JobReceipt = {
  jobId: string;
  amountRupees: number;
  paidBy: PaidBy;
  worker: BillWorker & {
    /** "Verified · Level 2" */
    detail: string;
  };
  service: string;
  /** "Electrician" */
  trade: string;
  /** "Fan repaired, regulator replaced" */
  workDone: string;
  /** "10 Nov 2026" */
  date: string;
  /** "4:31 PM" */
  startedAt: string;
  /** "4:48 PM" */
  finishedAt: string;
  /** "12, 4th Street, Anna Nagar" */
  address: string;
  /** For verified payments only. */
  upi?: {
    /** "••••4821" */
    reference: string;
    /** "4:52 PM" */
    confirmedAt: string;
  };
  /** "4:29 PM": the arrival code was matched. */
  arrivedAt: string;
};
