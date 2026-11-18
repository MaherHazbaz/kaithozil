import { formatRupees } from '@kaithozhil/core';
import { act, fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { billTotal, formatRupeeRange, isWithinEstimate } from './billMoney';
import { toggleFeedbackTag } from './jobFeedback';
import { canRate, viewForResult } from './payFlow';
import { sampleBill, sampleReceipt, sampleVerifiedPayment } from './sampleData';
import { BillScreen } from './screens/BillScreen';
import { PayScreen, type PayScreenProps } from './screens/PayScreen';
import { ReceiptScreen } from './screens/ReceiptScreen';

// Amounts go through formatRupees, so these tests hold before and after its
// Indian digit grouping is written (the owner's task).
const rupees = formatRupees;

describe('bill money', () => {
  it('adds the bill lines in whole rupees', () => {
    expect(billTotal(sampleBill.lines)).toBe(650);
    expect(billTotal([])).toBe(0);
    expect(() => billTotal([{ amountRupees: 1.5 }])).toThrow(RangeError);
    expect(() => billTotal([{ amountRupees: -1 }])).toThrow(RangeError);
  });

  it('checks the total against the estimate, both ends included', () => {
    const estimate = { minRupees: 400, maxRupees: 700 };
    expect(isWithinEstimate(650, estimate)).toBe(true);
    expect(isWithinEstimate(400, estimate)).toBe(true);
    expect(isWithinEstimate(700, estimate)).toBe(true);
    expect(isWithinEstimate(701, estimate)).toBe(false);
    expect(isWithinEstimate(399, estimate)).toBe(false);
  });

  it('writes a range with the rupee sign once', () => {
    expect(formatRupeeRange({ minRupees: 400, maxRupees: 700 })).toBe('₹400 – 700');
  });
});

describe('pay flow', () => {
  it('maps the payment partner answer to a view', () => {
    expect(viewForResult(sampleVerifiedPayment)).toBe('verified');
    expect(viewForResult({ status: 'failed' })).toBe('failed');
  });

  it('opens rating only once the job is settled', () => {
    expect(canRate('verified')).toBe(true);
    expect(canRate('cashDone')).toBe(true);
    for (const view of ['choose', 'qr', 'checking', 'failed', 'cash'] as const) {
      expect(canRate(view)).toBe(false);
    }
  });

  it('toggles feedback chips without changing the list it was given', () => {
    const tags = ['onTime'] as const;
    expect(toggleFeedbackTag(tags, 'neatWork')).toEqual(['onTime', 'neatWork']);
    expect(toggleFeedbackTag(tags, 'onTime')).toEqual([]);
    expect(tags).toEqual(['onTime']);
  });
});

describe('BillScreen', () => {
  const props = { bill: sampleBill, onBack: jest.fn(), onApprove: jest.fn(async () => {}) };

  it('shows the exact design wording', async () => {
    await renderScreen(<BillScreen {...props} />);
    expect(screen.getByRole('header', { name: 'Check the bill' })).toBeOnTheScreen();
    for (const text of [
      'கட்டணத்தைச் சரிபாருங்கள்',
      'Murugan finished the job',
      'Fan repair · KT-20481 · 4:31 – 4:48 PM',
      'Bill · கட்டண விவரம்',
      'Labour',
      'Parts · new regulator',
      'Extra work you approved',
      'Total',
      'Within the estimate of ₹400 – 700',
      'Photos of the finished work',
      "Something's not right",
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByTestId('bill-total')).toHaveTextContent(rupees(650));
    expect(screen.getByRole('image', { name: 'Finished work photo 1' })).toBeOnTheScreen();
    expect(screen.getByRole('image', { name: 'Finished work photo 2' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: `Looks right, pay ${rupees(650)}` })).toBeEnabled();
  });

  it('hides the estimate line when the total is outside it', async () => {
    const bill = { ...sampleBill, estimate: { minRupees: 100, maxRupees: 300 } };
    await renderScreen(<BillScreen {...props} bill={bill} />);
    expect(screen.queryByText(/Within the estimate/)).toBeNull();
  });

  it('opens and closes the "not right" note', async () => {
    const onReportProblem = jest.fn();
    await renderScreen(<BillScreen {...props} onReportProblem={onReportProblem} />);
    await fireEvent.press(screen.getByRole('button', { name: "Something's not right" }));
    expect(screen.getByText(/Don't pay yet\./)).toBeOnTheScreen();
    await fireEvent.press(screen.getByTestId('bill-report'));
    expect(onReportProblem).toHaveBeenCalled();

    await fireEvent.press(screen.getByRole('button', { name: 'Never mind, the bill is fine' }));
    expect(screen.queryByText(/Don't pay yet\./)).toBeNull();
  });

  it('approves the bill once, even on a double tap while it is saving', async () => {
    // Never settles, so the second tap arrives while the first is still running.
    const onApprove = jest.fn(() => new Promise<void>(() => {}));
    await renderScreen(<BillScreen {...props} onApprove={onApprove} />);
    const pay = screen.getByRole('button', { name: `Looks right, pay ${rupees(650)}` });
    await fireEvent.press(pay);
    await fireEvent.press(pay);
    expect(onApprove).toHaveBeenCalledTimes(1);
  });
});

describe('PayScreen', () => {
  const base: PayScreenProps = {
    worker: { name: 'Murugan K.', firstName: 'Murugan' },
    workDone: 'Fan repair + new regulator',
    jobId: 'KT-20481',
    amountRupees: 650,
    initialFeedback: { rating: 4 },
    onStartPayment: jest.fn(async () => sampleVerifiedPayment),
    onConfirmCash: jest.fn(async () => {}),
    onDone: jest.fn(async () => {}),
  };
  const amount = rupees(650);

  it('shows the choose state with the exact design wording', async () => {
    await renderScreen(<PayScreen {...base} />);
    expect(screen.getByRole('header', { name: 'Job completed' })).toBeOnTheScreen();
    for (const text of [
      'Murugan marked your job as done. Check the work, then pay.',
      'Work done',
      'Fan repair + new regulator',
      'Murugan K.',
      'KT-20481',
      `Pay ${amount} securely`,
      'பாதுகாப்பாகச் செலுத்துங்கள்',
      'Google Pay',
      'PhonePe',
      'Paytm',
      'Other UPI',
      'Show a QR code instead',
      'Payment goes through [PAYMENT PARTNER], a licensed payment company. Murugan is paid as soon as your bank confirms, and the job is marked paid only then.',
      'Paying in cash instead?',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    // No rating before payment.
    expect(screen.queryByText('How was the work?')).toBeNull();
  });

  it('waits for the bank, then shows the verified payment and the rating', async () => {
    let answer: (value: typeof sampleVerifiedPayment) => void = () => {};
    const onStartPayment = jest.fn(
      () => new Promise<typeof sampleVerifiedPayment>((resolve) => (answer = resolve)),
    );
    const onViewReceipt = jest.fn();
    await renderScreen(
      <PayScreen {...base} onStartPayment={onStartPayment} onViewReceipt={onViewReceipt} />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Pay with PhonePe' }));
    expect(onStartPayment).toHaveBeenCalledWith('phonePe');
    expect(screen.getByText('Waiting for your bank to confirm…')).toBeOnTheScreen();

    await act(async () => answer(sampleVerifiedPayment));
    expect(screen.getByText(`Payment verified · ${amount}`)).toBeOnTheScreen();
    expect(screen.getByText('UPI ref ••4821 · 4:52 PM · paid to Murugan K.')).toBeOnTheScreen();
    expect(screen.getByText('How was the work?')).toBeOnTheScreen();
    expect(screen.getByText('Very good')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('link', { name: 'View receipt' }));
    expect(onViewReceipt).toHaveBeenCalled();
  });

  it('shows the failed state and goes back to choosing on Try again', async () => {
    await renderScreen(
      <PayScreen {...base} onStartPayment={jest.fn(async () => ({ status: 'failed' as const }))} />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Pay with Google Pay' }));
    expect(screen.getByText("Payment didn't go through")).toBeOnTheScreen();
    expect(
      screen.getByText(
        "No money was taken. If your bank did take it, it's refunded automatically within [REFUND DAYS].",
      ),
    ).toBeOnTheScreen();
    expect(screen.queryByText('How was the work?')).toBeNull();

    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByText(`Pay ${amount} securely`)).toBeOnTheScreen();
  });

  it('goes back to where the customer was when no answer comes', async () => {
    await renderScreen(
      <PayScreen
        {...base}
        onStartPayment={jest.fn(async () => {
          throw new Error('offline');
        })}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Pay with Paytm' }));
    expect(screen.getByText(`Pay ${amount} securely`)).toBeOnTheScreen();
    expect(screen.queryByText("Payment didn't go through")).toBeNull();
  });

  it('shows the QR code and checks with "I\'ve paid"', async () => {
    const onStartPayment = jest.fn(async () => sampleVerifiedPayment);
    await renderScreen(<PayScreen {...base} onStartPayment={onStartPayment} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Show a QR code instead' }));
    expect(screen.getByRole('image', { name: `UPI QR code for ${amount}` })).toBeOnTheScreen();
    expect(screen.getByText(`Scan with any UPI app · ${amount}`)).toBeOnTheScreen();
    expect(
      screen.getByText('This code is only for job KT-20481 and expires in 10 minutes.'),
    ).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: "I've paid, check now" }));
    expect(onStartPayment).toHaveBeenCalledWith('qr');
    expect(screen.getByText(`Payment verified · ${amount}`)).toBeOnTheScreen();
  });

  it('records cash only after the disclaimer, then opens the rating', async () => {
    const onConfirmCash = jest.fn(async () => {});
    const onDone = jest.fn(async () => {});
    await renderScreen(<PayScreen {...base} onConfirmCash={onConfirmCash} onDone={onDone} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Paying in cash instead?' }));
    expect(screen.getByText('Paying in cash')).toBeOnTheScreen();
    expect(screen.getByText(/Cash payments are not recorded or verified/)).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Pay in the app instead' }));
    expect(screen.getByText(`Pay ${amount} securely`)).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Paying in cash instead?' }));
    await fireEvent.press(
      screen.getByRole('button', { name: `I understand, I paid ${amount} in cash` }),
    );
    expect(onConfirmCash).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Recorded as cash · not verified')).toBeOnTheScreen();
    expect(
      screen.getByText('No receipt or payment proof is created for cash payments.'),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: '5 stars' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Fair price' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Done' }));
    expect(onDone).toHaveBeenCalledWith({ rating: 5, tags: ['fairPrice'] });
  });

  it('starts unrated unless a rating is passed in', async () => {
    await renderScreen(<PayScreen {...base} initialFeedback={undefined} initialView="cashDone" />);
    expect(screen.getByTestId('pay-rating-word')).toHaveTextContent('');
    expect(screen.getByRole('button', { name: '4 stars' })).not.toBeSelected();
  });
});

describe('ReceiptScreen', () => {
  const props = { receipt: sampleReceipt, onBack: jest.fn() };

  it('shows a verified UPI receipt as designed', async () => {
    const onBookAgain = jest.fn();
    const onHelp = jest.fn();
    await renderScreen(<ReceiptScreen {...props} onBookAgain={onBookAgain} onHelp={onHelp} />);
    expect(screen.getByRole('header', { name: 'Job receipt' })).toBeOnTheScreen();
    for (const text of [
      'வேலை ரசீது',
      'Kaithozhil',
      'Receipt · KT-20481',
      'Paid to Murugan K. by UPI · verified',
      'Fan repair',
      'Electrician',
      'Fan repaired, regulator replaced',
      '10 Nov 2026',
      'Started 4:31 PM · finished 4:48 PM',
      '12, 4th Street, Anna Nagar',
      'Verified · Level 2',
      '••••4821',
      'Verified payment ✓',
      'Confirmed by the bank through [PAYMENT PARTNER] · 4:52 PM',
      'Arrived ✓',
      '4:29 PM · code matched',
      'Work started ✓',
      '4:31 PM · code matched',
      "Kaithozhil's fee is shown separately. This receipt can be used as proof of payment.",
      'Download PDF',
      'Share',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByTestId('receipt-amount')).toHaveTextContent(rupees(650));
    await fireEvent.press(screen.getByRole('button', { name: 'Book Murugan again' }));
    await fireEvent.press(screen.getByRole('link', { name: 'Something wrong? Get help' }));
    expect(onBookAgain).toHaveBeenCalled();
    expect(onHelp).toHaveBeenCalled();
  });

  it('marks cash as not verified, with no reference or proof', async () => {
    await renderScreen(
      <ReceiptScreen {...props} receipt={{ ...sampleReceipt, paidBy: 'cash', upi: undefined }} />,
    );
    expect(screen.getByText('Paid to Murugan K. in cash (not verified)')).toBeOnTheScreen();
    expect(screen.getByText('None (cash)')).toBeOnTheScreen();
    expect(screen.getByText('Cash, not verified.')).toBeOnTheScreen();
    expect(
      screen.getByText(
        "Cash jobs have no payment proof and are not counted in the worker's statement.",
      ),
    ).toBeOnTheScreen();
    expect(screen.queryByText('Verified payment ✓')).toBeNull();
  });
});
