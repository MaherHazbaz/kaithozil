import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { TrackingScreen, type TrackingScreenProps } from './screens/TrackingScreen';

// The data drawn in design/source/Tracking.dc.html.
const designData: TrackingScreenProps = {
  worker: {
    name: 'Murugan K.',
    firstName: 'Murugan',
    initials: 'MK',
    detail: 'Verified Level 2 · ★ 4.8 · 280 jobs',
  },
  titleTamil: 'முருகன் வந்து கொண்டிருக்கிறார்',
  etaMinutes: 9,
  startCode: '4827',
  jobSummary: 'Fan not working',
  estimateRange: '₹400 – 700',
  onBack: jest.fn(),
  onCancel: jest.fn(),
};

describe('TrackingScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<TrackingScreen {...designData} />);
    expect(screen.getByRole('header', { name: 'Murugan is on the way' })).toBeOnTheScreen();
    for (const text of [
      'Arrives in 9 min',
      'முருகன் வந்து கொண்டிருக்கிறார்',
      'MK',
      'Murugan K.',
      'Verified Level 2 · ★ 4.8 · 280 jobs',
      'Give this code when he arrives',
      'He needs it to start the job. Share it only when he is at your door.',
      'Fan not working',
      'Estimate ₹400 – 700',
      'Job finished? Pay now',
      'Cancel booking',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('shows the start code as four digits, read out as one code', async () => {
    await renderScreen(<TrackingScreen {...designData} />);
    for (const digit of ['4', '8', '2', '7']) {
      expect(screen.getByText(digit)).toBeOnTheScreen();
    }
    expect(screen.getByLabelText('Start code 4 8 2 7')).toBeOnTheScreen();
  });

  it('names the icon-only buttons for screen readers', async () => {
    const onCall = jest.fn();
    const onMessage = jest.fn();
    await renderScreen(<TrackingScreen {...designData} onCall={onCall} onMessage={onMessage} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Call Murugan' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Message Murugan' }));
    expect(onCall).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledTimes(1);
  });

  it('goes back, pays and cancels', async () => {
    const onBack = jest.fn();
    const onPay = jest.fn();
    const onCancel = jest.fn();
    await renderScreen(
      <TrackingScreen {...designData} onBack={onBack} onPay={onPay} onCancel={onCancel} />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Job finished? Pay now' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Cancel booking' }));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onPay).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
