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
  progress: { stage: 'onTheWay' },
  arrivalCode: '4827',
  workStartCode: '3159',
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
      'Step 1 · Arrival code',
      'வருகைக் குறியீடு',
      'Give this only when Murugan is at your door. It confirms he has really arrived.',
      'Fan not working',
      'Estimate ₹400 – 700',
      'Job finished? Pay now',
      'Cancel booking',
      'Report a problem',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('shows the arrival code as four digits, read out as one code', async () => {
    await renderScreen(<TrackingScreen {...designData} />);
    for (const digit of ['4', '8', '2', '7']) {
      expect(screen.getByText(digit)).toBeOnTheScreen();
    }
    expect(screen.getByLabelText('Arrival code 4 8 2 7')).toBeOnTheScreen();
    expect(screen.queryByText('Step 2 · Work-start code')).toBeNull();
  });

  it('after arrival, confirms it and shows the work-start code', async () => {
    await renderScreen(
      <TrackingScreen {...designData} progress={{ stage: 'arrived', arrivedAt: '4:29 PM' }} />,
    );
    for (const text of [
      'Murugan arrived · 4:29 PM',
      'Arrival code and location matched',
      'Step 2 · Work-start code',
      'வேலை தொடக்கக் குறியீடு',
      "Give this when you're ready for the work to begin.",
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByLabelText('Work-start code 3 1 5 9')).toBeOnTheScreen();
    expect(screen.queryByText('Step 1 · Arrival code')).toBeNull();
  });

  it('once work has started, shows both steps and no code', async () => {
    await renderScreen(
      <TrackingScreen
        {...designData}
        progress={{ stage: 'workStarted', arrivedAt: '4:29 PM', startedAt: '4:31 PM' }}
      />,
    );
    for (const text of [
      'Murugan arrived · 4:29 PM',
      'Work started · 4:31 PM',
      'Work-start code matched',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.queryByText(/Step \d/)).toBeNull();
  });

  it('reports a problem', async () => {
    const onReportProblem = jest.fn();
    await renderScreen(<TrackingScreen {...designData} onReportProblem={onReportProblem} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Report a problem' }));
    expect(onReportProblem).toHaveBeenCalledTimes(1);
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
