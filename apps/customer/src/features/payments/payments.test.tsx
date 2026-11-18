import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { PaymentsScreen } from './screens/PaymentsScreen';
import type { PaymentRecord } from './types';

const payments: PaymentRecord[] = [
  { id: 'p1', title: 'Fan repair · Murugan K.', detail: '10 Nov · UPI ref ••4821', amount: '₹650' },
  { id: 'p2', title: 'Tap leak · Ravi S.', detail: '2 Nov · UPI ref ••1907', amount: '₹350' },
];

describe('PaymentsScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<PaymentsScreen initialApp="ask" payments={payments} onBack={jest.fn()} />);
    expect(screen.getByRole('header', { name: 'Payments' })).toBeOnTheScreen();
    for (const text of [
      'பணம் செலுத்துதல்',
      'You pay workers directly',
      "Payments go from your UPI app straight to the worker's bank. Kaithozhil never stores your bank or card details.",
      'Preferred UPI app',
      "We'll open this app when you pay · நீங்கள் விரும்பும் UPI செயலி",
      'G',
      'Google Pay',
      'P',
      'PhonePe',
      'Pt',
      'Paytm',
      'B',
      'BHIM',
      '?',
      'Ask me every time',
      'Recent payments',
      'Fan repair · Murugan K.',
      '10 Nov · UPI ref ••4821',
      '₹650',
      'Tap leak · Ravi S.',
      '2 Nov · UPI ref ••1907',
      '₹350',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getAllByText('Paid ✓')).toHaveLength(2);
    expect(screen.getByRole('radio', { name: 'Ask me every time' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Google Pay' })).not.toBeChecked();
  });

  it('reports the chosen app straight away', async () => {
    const onPreferredAppChange = jest.fn();
    await renderScreen(
      <PaymentsScreen
        initialApp="ask"
        payments={payments}
        onBack={jest.fn()}
        onPreferredAppChange={onPreferredAppChange}
      />,
    );
    await fireEvent.press(screen.getByRole('radio', { name: 'PhonePe' }));
    expect(onPreferredAppChange).toHaveBeenCalledWith('phonepe');
    expect(screen.getByRole('radio', { name: 'PhonePe' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Ask me every time' })).not.toBeChecked();
  });

  it('leaves out the history when there are no payments yet', async () => {
    await renderScreen(<PaymentsScreen initialApp="gpay" payments={[]} onBack={jest.fn()} />);
    expect(screen.queryByText('Recent payments')).toBeNull();
  });
});
