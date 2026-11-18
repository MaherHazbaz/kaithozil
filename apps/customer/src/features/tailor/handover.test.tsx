import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { SAMPLE_HANDOVER, SAMPLE_RECEIVED_AT } from './sampleData';
import { HandoverScreen } from './screens/HandoverScreen';

describe('HandoverScreen', () => {
  const base = {
    handover: SAMPLE_HANDOVER,
    onBack: jest.fn(),
    onConfirmReceived: jest.fn(async () => ({ receivedAt: SAMPLE_RECEIVED_AT })),
  };

  it('shows the pickup step as designed', async () => {
    const onMessage = jest.fn();
    await renderScreen(<HandoverScreen {...base} step="pickup" onMessage={onMessage} />);
    expect(screen.getByRole('header', { name: 'Pickup and delivery' })).toBeOnTheScreen();
    for (const text of [
      'எடுத்தல் · ஒப்படைத்தல்',
      'Arun K. is coming for pickup',
      'For Meena S. (tailor) · verified · about 15 min',
      'Pickup code',
      'எடுப்புக் குறியீடு',
      'Give this only when you hand over your fabric to Arun.',
      "What you're handing over",
      '2 blouse fabric pieces',
      '1 lining cloth',
      'Design photo (shared in the app)',
      "Arun photographs the items at pickup, so there's a record.",
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByLabelText('Pickup code 6 1 5 2')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Message Arun' }));
    expect(onMessage).toHaveBeenCalled();
    expect(screen.queryByText("I've received everything")).toBeNull();
  });

  it('confirms a delivery once and shows when it was received', async () => {
    const onConfirmReceived = jest.fn(async () => ({ receivedAt: SAMPLE_RECEIVED_AT }));
    const onBackToOrder = jest.fn();
    const onReportProblem = jest.fn();
    await renderScreen(
      <HandoverScreen
        {...base}
        step="delivery"
        onConfirmReceived={onConfirmReceived}
        onBackToOrder={onBackToOrder}
        onReportProblem={onReportProblem}
      />,
    );
    for (const text of [
      'Your clothes are here',
      'Arun K. · delivering for Meena S.',
      'Check before you confirm',
      '2 stitched blouses',
      'Leftover fabric returned',
      'Photos taken by Meena when the order was packed:',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByRole('image', { name: 'Packed order photo 3' })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('link', { name: "Something's missing or damaged" }));
    expect(onReportProblem).toHaveBeenCalled();

    const received = screen.getByRole('button', { name: "I've received everything" });
    await fireEvent.press(received);
    expect(onConfirmReceived).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Received · Fri 21 Nov, 5:12 PM')).toBeOnTheScreen();
    expect(screen.getByText('Try them on, then pay')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Back to your order' }));
    expect(onBackToOrder).toHaveBeenCalled();
  });
});
