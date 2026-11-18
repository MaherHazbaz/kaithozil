// The sample job drawn in design/source/{BillApprove,Pay,Receipt}.dc.html.
// It stands in for the server until Supabase is wired (Sprint 2); delete it then.
import type { JobBill, JobReceipt, PaymentResult } from './types';

const worker = { id: 'murugan-k', name: 'Murugan K.', firstName: 'Murugan', initials: 'MK' };

export const sampleBill: JobBill = {
  jobId: 'KT-20481',
  worker,
  service: 'Fan repair',
  workTime: '4:31 – 4:48 PM',
  workDone: 'Fan repair + new regulator',
  lines: [
    { label: 'Labour', amountRupees: 450 },
    { label: 'Parts · new regulator', amountRupees: 200 },
    { label: 'Extra work you approved', amountRupees: 0 },
  ],
  estimate: { minRupees: 400, maxRupees: 700 },
  photoCount: 2,
};

/** The verified payment Pay.dc.html shows after "checking". */
export const sampleVerifiedPayment: PaymentResult = {
  status: 'verified',
  reference: '••4821',
  time: '4:52 PM',
};

export const sampleReceipt: JobReceipt = {
  jobId: 'KT-20481',
  amountRupees: 650,
  paidBy: 'upi',
  worker: { ...worker, detail: 'Verified · Level 2' },
  service: 'Fan repair',
  trade: 'Electrician',
  workDone: 'Fan repaired, regulator replaced',
  date: '10 Nov 2026',
  startedAt: '4:31 PM',
  finishedAt: '4:48 PM',
  address: '12, 4th Street, Anna Nagar',
  upi: { reference: '••••4821', confirmedAt: '4:52 PM' },
  arrivedAt: '4:29 PM',
};
