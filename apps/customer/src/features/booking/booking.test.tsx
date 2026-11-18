import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { SAMPLE_REQUEST, SAMPLE_SIMILAR_WORKERS, SAMPLE_SUGGESTION } from './sampleRequest';
import { RequestSentScreen, type RequestSentScreenProps } from './screens/RequestSentScreen';
import { isBookingOutcome } from './types';

const designData: RequestSentScreenProps = {
  request: SAMPLE_REQUEST,
  outcome: 'waiting',
  suggestion: SAMPLE_SUGGESTION,
  similarWorkers: SAMPLE_SIMILAR_WORKERS,
  onBack: jest.fn(),
};

const expectTexts = (texts: readonly string[]) => {
  for (const text of texts) expect(screen.getByText(text)).toBeOnTheScreen();
};

describe('RequestSentScreen', () => {
  it('waiting: shows the exact design wording', async () => {
    await renderScreen(<RequestSentScreen {...designData} />);
    expect(screen.getByRole('header', { name: 'Your booking' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Request sent to Murugan' })).toBeOnTheScreen();
    expectTexts([
      'உங்கள் முன்பதிவு',
      'முருகனுக்கு கோரிக்கை அனுப்பப்பட்டது',
      "He'll reply by 6:30 PM today. If he can't take it, we'll help you find someone else straight away.",
      'Job',
      'Fan not working',
      'Electrician',
      'When',
      'Sat 15 Nov · 10 AM – 12 PM',
      'Where',
      'Home · 12, 4th Street, Anna Nagar',
      'Estimate',
      '₹400 – 700',
      'Final price agreed on site',
      'Chat and calls open once he accepts. Nothing is charged for a request.',
      'Cancel request',
    ]);
    expect(screen.getByLabelText('Request sent, done')).toBeOnTheScreen();
    expect(screen.getByLabelText('Murugan replies, now')).toBeOnTheScreen();
    expect(screen.getByLabelText('Booking confirmed, next')).toBeOnTheScreen();
  });

  it('waiting: draws the waiting ripple', async () => {
    await renderScreen(<RequestSentScreen {...designData} />);
    expect(screen.getAllByTestId('ripple-wave', { includeHiddenElements: true })).toHaveLength(3);
  });

  it('waiting: cancels the request', async () => {
    const onCancelRequest = jest.fn();
    await renderScreen(<RequestSentScreen {...designData} onCancelRequest={onCancelRequest} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Cancel request' }));
    expect(onCancelRequest).toHaveBeenCalledTimes(1);
  });

  it('accepted: shows the exact design wording and actions', async () => {
    const onMessage = jest.fn();
    const onGoToBookings = jest.fn();
    await renderScreen(
      <RequestSentScreen
        {...designData}
        outcome="accepted"
        onMessage={onMessage}
        onGoToBookings={onGoToBookings}
      />,
    );
    expect(
      screen.getByRole('header', { name: 'Murugan confirmed your booking' }),
    ).toBeOnTheScreen();
    expectTexts([
      'முன்பதிவு உறுதி செய்யப்பட்டது',
      "We'll remind you on the day. You'll give him an arrival code at the door, then a work-start code.",
      'Sat 15 Nov · 10 AM – 12 PM',
    ]);
    expect(screen.queryAllByTestId('ripple-wave', { includeHiddenElements: true })).toHaveLength(0);
    await fireEvent.press(screen.getByRole('button', { name: 'Message Murugan' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Go to my bookings' }));
    expect(onMessage).toHaveBeenCalledTimes(1);
    expect(onGoToBookings).toHaveBeenCalledTimes(1);
  });

  it('new time: accepting moves the booking to the suggested slot', async () => {
    const onAcceptNewTime = jest.fn();
    await renderScreen(
      <RequestSentScreen {...designData} outcome="newTime" onAcceptNewTime={onAcceptNewTime} />,
    );
    expect(
      screen.getByRole('header', { name: 'Murugan suggested another time' }),
    ).toBeOnTheScreen();
    expectTexts([
      'வேறு நேரம் பரிந்துரைக்கப்பட்டது',
      "He can't make your slot, but can come later the same day.",
      'You asked for',
      'Sat 15 Nov · 10 AM – 12 PM',
      'New time',
      'Sat 15 Nov · 2 – 4 PM',
      'Murugan',
      'Morning is already booked. I can come after lunch, around 2 PM.',
      'Pick another time',
      'Choose another worker',
    ]);
    await fireEvent.press(screen.getByRole('button', { name: 'Accept 2 – 4 PM' }));
    expect(onAcceptNewTime).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('header', { name: 'Murugan confirmed your booking' }),
    ).toBeOnTheScreen();
    expect(screen.getByText('Sat 15 Nov · 2 – 4 PM')).toBeOnTheScreen();
    expect(screen.queryByText('Sat 15 Nov · 10 AM – 12 PM')).toBeNull();
  });

  it('declined: offers other workers', async () => {
    const onOpenWorker = jest.fn();
    const onFindWorker = jest.fn();
    const onSeeAll = jest.fn();
    await renderScreen(
      <RequestSentScreen
        {...designData}
        outcome="declined"
        onOpenWorker={onOpenWorker}
        onFindWorker={onFindWorker}
        onSeeAll={onSeeAll}
      />,
    );
    expect(screen.getByRole('header', { name: "Murugan isn't available" })).toBeOnTheScreen();
    expectTexts([
      'முருகன் கிடைக்கவில்லை',
      "He's fully booked on Saturday. Your request has been closed, and nothing was charged.",
      'Let Kaithozhil find a worker',
      'Similar electricians near you',
      'Senthil R.',
      'Level 3 · 3.4 km · ★ 4.9',
      'Arun P.',
      'New on Kaithozhil · 1.6 km · ★ 5.0',
      'See all electricians',
    ]);
    await fireEvent.press(screen.getByTestId('similar-arun-p'));
    await fireEvent.press(screen.getByRole('button', { name: 'Let Kaithozhil find a worker' }));
    await fireEvent.press(screen.getByRole('link', { name: 'See all electricians' }));
    expect(onOpenWorker).toHaveBeenCalledWith('arun-p');
    expect(onFindWorker).toHaveBeenCalledTimes(1);
    expect(onSeeAll).toHaveBeenCalledTimes(1);
  });
});

describe('isBookingOutcome', () => {
  it('accepts only the four outcomes', () => {
    expect(isBookingOutcome('newTime')).toBe(true);
    expect(isBookingOutcome('cancelled')).toBe(false);
    expect(isBookingOutcome(undefined)).toBe(false);
  });
});
