import { formatRupees } from '@kaithozhil/core';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { sampleChangeJob, sampleChangeProposal, sampleProgress, sampleQuote } from './sampleData';
import {
  changedTotal,
  parseRupeesInput,
  paymentStages,
  progressPercent,
  quoteTotal,
} from './quoteMoney';
import { ChangeRequestScreen } from './screens/ChangeRequestScreen';
import { JobProgressScreen } from './screens/JobProgressScreen';
import { QuoteScreen, type QuoteScreenProps } from './screens/QuoteScreen';
import { VisitRequestScreen, type VisitRequestScreenProps } from './screens/VisitRequestScreen';
import { missingVisitDetail, toggleWork } from './visitRequest';

// Amounts go through formatRupees, so these tests hold before and after its
// Indian digit grouping is written (LEARNING.md, the owner's task).
const rupees = formatRupees;

describe('quote money', () => {
  it('adds the quote lines in whole rupees', () => {
    expect(quoteTotal(sampleQuote.lines)).toBe(18400);
    expect(quoteTotal([])).toBe(0);
  });

  it('rejects amounts that are not whole, non-negative rupees', () => {
    expect(() => quoteTotal([{ amountRupees: 10.5 }])).toThrow(RangeError);
    expect(() => quoteTotal([{ amountRupees: -1 }])).toThrow(RangeError);
  });

  it('splits the total into a start and a completion stage that add up exactly', () => {
    expect(paymentStages(18400, 7200)).toEqual([
      { key: 'start', amountRupees: 7200 },
      { key: 'completion', amountRupees: 11200 },
    ]);
    expect(paymentStages(500, 0)[1].amountRupees).toBe(500);
    expect(() => paymentStages(500, 501)).toThrow(RangeError);
  });

  it('adds an extra to the agreed price', () => {
    expect(changedTotal(650, 250)).toBe(900);
    expect(() => changedTotal(650, 0.5)).toThrow(RangeError);
  });

  it('reads the extra amount field as digits only', () => {
    expect(parseRupeesInput('250')).toBe(250);
    expect(parseRupeesInput('₹1,200')).toBe(1200);
    expect(parseRupeesInput('')).toBe(0);
    expect(parseRupeesInput('12.50')).toBe(1250);
    expect(parseRupeesInput('1234567')).toBe(12345);
  });

  it('rounds progress down to a whole percent', () => {
    expect(progressPercent(3, 5)).toBe(60);
    expect(progressPercent(2, 3)).toBe(66);
    expect(progressPercent(7, 5)).toBe(100);
    expect(progressPercent(1, 0)).toBe(0);
  });
});

describe('visit request rules', () => {
  it('asks for the work, then the size', () => {
    expect(missingVisitDetail({ work: [], size: null })).toBe('work');
    expect(missingVisitDetail({ work: ['interior'], size: null })).toBe('size');
    expect(missingVisitDetail({ work: ['interior'], size: 'twoBhk' })).toBeNull();
  });

  it('toggles work types on and off', () => {
    expect(toggleWork(['interior'], 'exterior')).toEqual(['interior', 'exterior']);
    expect(toggleWork(['interior', 'exterior'], 'interior')).toEqual(['exterior']);
  });
});

const visitProps: VisitRequestScreenProps = {
  address: { label: 'Home', line: '12, 4th Street, Anna Nagar' },
  visitSlot: { day: 'Sat 15 Nov', time: '10 AM – 12 PM' },
  onBack: jest.fn(),
  onRequest: async () => ({ workerName: 'Ravi S.', workerLevel: 'Level 2' }),
};

describe('VisitRequestScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<VisitRequestScreen {...visitProps} />);
    expect(screen.getByRole('header', { name: 'Painter' })).toBeOnTheScreen();
    for (const text of [
      'பெயிண்டர்',
      'Request a visit',
      'The painter visits and measures',
      'Accept it, ask questions, or compare',
      'What work is needed? · என்ன வேலை?',
      'How big is the job? · எவ்வளவு பெரியது?',
      'How many days and painters? · எத்தனை நாட்கள்?',
      'Not sure, decide after the visit',
      'The painter suggests the number of workers and days in the quote. Nothing is fixed until you both confirm the job plan.',
      'Add photos',
      'Voice note',
      'Visit time',
      'Sat 15 Nov · 10 AM – 12 PM',
      '12, 4th Street, Anna Nagar',
      'Site visit: [VISIT FEE], adjusted in the final bill if you go ahead.',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('says what is missing and keeps the button disabled until it is chosen', async () => {
    await renderScreen(<VisitRequestScreen {...visitProps} />);
    const cta = screen.getByRole('button', { name: 'Request a site visit' });
    expect(cta).toBeDisabled();
    expect(screen.getByTestId('visit-missing')).toHaveTextContent('Choose the type of work');

    await fireEvent.press(screen.getByTestId('visit-work-interior'));
    expect(screen.getByTestId('visit-missing')).toHaveTextContent('Choose the size of the job');

    await fireEvent.press(screen.getByTestId('visit-size-twoBhk'));
    expect(screen.queryByTestId('visit-missing')).toBeNull();
    expect(cta).toBeEnabled();
  });

  it('hides the "not sure" note when a length is chosen', async () => {
    await renderScreen(<VisitRequestScreen {...visitProps} />);
    await fireEvent.press(screen.getByTestId('visit-duration-threeToFive'));
    expect(screen.queryByText(/The painter suggests/)).toBeNull();
  });

  it('sends the answers and shows the booked visit', async () => {
    const onRequest = jest.fn(visitProps.onRequest);
    await renderScreen(
      <VisitRequestScreen
        {...visitProps}
        initialDraft={{ work: ['interior'], size: 'twoBhk' }}
        onRequest={onRequest}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Request a site visit' }));
    expect(onRequest).toHaveBeenCalledWith({
      work: ['interior'],
      size: 'twoBhk',
      duration: 'unsure',
    });
    expect(await screen.findByRole('header', { name: 'Visit booked' })).toBeOnTheScreen();
    expect(
      screen.getByText(
        "Ravi S. (painter, Level 2) will visit on Sat 15 Nov, 10 AM – 12 PM to measure. You'll get a written quote in the app after the visit.",
      ),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'See the quote (after the visit)' }),
    ).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Go to my bookings' })).toBeOnTheScreen();
  });

  it('stays on the form when the request fails', async () => {
    await renderScreen(
      <VisitRequestScreen
        {...visitProps}
        initialDraft={{ work: ['interior'], size: 'twoBhk' }}
        onRequest={() => Promise.reject(new Error('offline'))}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Request a site visit' }));
    expect(screen.getByRole('button', { name: 'Request a site visit' })).toBeEnabled();
    expect(screen.queryByText('Visit booked')).toBeNull();
  });
});

const quoteProps: QuoteScreenProps = {
  quote: sampleQuote,
  onBack: jest.fn(),
  onAccept: async () => {},
  onDecline: async () => {},
  onReopen: async () => {},
};

describe('QuoteScreen', () => {
  it('shows the itemised quote with its staged payments', async () => {
    await renderScreen(<QuoteScreen {...quoteProps} />);
    expect(screen.getByRole('header', { name: 'Your quote' })).toBeOnTheScreen();
    expect(screen.getByTestId('quote-total')).toHaveTextContent(rupees(18400));
    for (const text of [
      'உங்கள் மதிப்பீடு',
      'Valid 7 days',
      'Ravi S.',
      'Interior walls · 2 BHK',
      '4 days\nfrom Mon 17 Nov',
      'Labour',
      rupees(9600),
      '2 painters',
      'Emulsion, 2 coats',
      'Putty and primer',
      'Materials first, rest at end',
      `${rupees(7200)} at start · ${rupees(11200)} on completion`,
      'Price includes moving furniture and covering floors.',
      'You pay Ravi directly by UPI at each stage, inside the app, so every payment is on record. Never pay outside Kaithozhil.',
      'Compare: ask 2 more painters for quotes',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByRole('button', { name: 'Ask Ravi' })).toBeOnTheScreen();
  });

  it('moves to accepted only after the server agrees', async () => {
    const onAccept = jest.fn(async () => {});
    await renderScreen(<QuoteScreen {...quoteProps} onAccept={onAccept} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Accept quote' }));
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('header', { name: 'Quote accepted' })).toBeOnTheScreen();
    expect(
      screen.getByText(
        `Ravi starts Mon 17 Nov. Pay ${rupees(7200)} for materials when he arrives. You'll see daily progress photos in your booking.`,
      ),
    ).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'See job progress' })).toBeOnTheScreen();
  });

  it('stays open when accepting fails', async () => {
    await renderScreen(
      <QuoteScreen {...quoteProps} onAccept={() => Promise.reject(new Error('offline'))} />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Accept quote' }));
    expect(screen.getByRole('button', { name: 'Accept quote' })).toBeEnabled();
    expect(screen.queryByText('Quote accepted')).toBeNull();
  });

  it('declines, then undoes', async () => {
    await renderScreen(<QuoteScreen {...quoteProps} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Decline' }));
    expect(await screen.findByText('Quote declined')).toBeOnTheScreen();
    expect(screen.getByText('Ravi has been told. Only the visit fee applies.')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Ask other painters' })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Undo' }));
    expect(await screen.findByRole('button', { name: 'Accept quote' })).toBeOnTheScreen();
  });
});

describe('JobProgressScreen', () => {
  it('shows today, the progress and the payment stages', async () => {
    await renderScreen(<JobProgressScreen progress={sampleProgress} onBack={jest.fn()} />);
    expect(screen.getByRole('header', { name: 'Job progress' })).toBeOnTheScreen();
    for (const text of [
      'வேலை முன்னேற்றம்',
      'On track',
      'Interior walls · 2 BHK · Ravi S.',
      'Ends Thu 20 Nov',
      '60% done',
      "3 of 5 parts done · from Ravi's daily updates",
      'Day 3 of 4 · today',
      '2 painters · 8:50 AM · working now',
      'First coat done in the hall and bedroom 1. Bedroom 2 tomorrow morning.',
      'Payments for this job',
      'Materials, at the start',
      'Paid Mon 17 Nov · verified',
      `${rupees(7200)} ✓`,
      'Rest, on completion',
      'After you check the finished work',
      rupees(11200),
      'Report a problem',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByLabelText('60 percent done')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Wed 19' })).toBeSelected();
    expect(screen.getAllByLabelText(/Progress photo/)).toHaveLength(3);
  });

  it('switches days; a day not started has no photos', async () => {
    await renderScreen(<JobProgressScreen progress={sampleProgress} onBack={jest.fn()} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Thu 20' }));
    expect(screen.getByText('Day 4 of 4')).toBeOnTheScreen();
    expect(screen.getByText('Planned: second coat in all rooms, then clean-up.')).toBeOnTheScreen();
    expect(screen.queryAllByLabelText(/Progress photo/)).toHaveLength(0);
  });
});

describe('ChangeRequestScreen', () => {
  it('lets the customer approve, showing the new total', async () => {
    const onApprove = jest.fn(async () => ({ approvedAt: '4:44 PM' }));
    await renderScreen(
      <ChangeRequestScreen
        side="customer"
        job={sampleChangeJob}
        proposal={sampleChangeProposal}
        onBack={jest.fn()}
        onApprove={onApprove}
        onDecline={async () => {}}
      />,
    );
    for (const text of [
      'மாற்றக் கோரிக்கை',
      'Fan repair · KT-20481 · Priya R.',
      `Agreed so far: ${rupees(650)}`,
      'Murugan asks for extra work',
      'Rewire the switchboard',
      '"Switchboard wiring is loose and burnt. Needs rewiring for safety."',
      `+${rupees(250)}`,
      '+30 min',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByTestId('change-new-total')).toHaveTextContent(rupees(900));
    await fireEvent.press(screen.getByRole('button', { name: 'Approve extra work' }));
    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('Extra work approved · 4:44 PM')).toBeOnTheScreen();
    expect(
      screen.getByText(`New total ${rupees(900)}, recorded for both of you`),
    ).toBeOnTheScreen();
  });

  it('lets the customer decline', async () => {
    await renderScreen(
      <ChangeRequestScreen
        side="customer"
        job={sampleChangeJob}
        proposal={sampleChangeProposal}
        onBack={jest.fn()}
        onApprove={async () => ({ approvedAt: '4:44 PM' })}
        onDecline={async () => {}}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Decline' }));
    expect(await screen.findByText('Extra work declined')).toBeOnTheScreen();
    expect(
      screen.getByText(`The job continues as agreed, at ${rupees(650)}. Murugan has been told.`),
    ).toBeOnTheScreen();
  });

  it('lets the worker propose extra work and then wait', async () => {
    const onPropose = jest.fn(async () => {});
    await renderScreen(
      <ChangeRequestScreen
        side="worker"
        job={sampleChangeJob}
        onBack={jest.fn()}
        onPropose={onPropose}
      />,
    );
    expect(
      screen.getByText(
        `New total if Priya approves: ${rupees(900)}. Don't start extra work until she approves in the app.`,
      ),
    ).toBeOnTheScreen();

    await fireEvent.changeText(screen.getByTestId('change-description'), 'Loose wiring ');
    await fireEvent.changeText(screen.getByTestId('change-amount'), '₹400');
    await fireEvent.press(screen.getByTestId('change-time-hour1'));
    expect(screen.getByText(new RegExp(`approves: ${rupees(1050)}`))).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Send to Priya' }));
    expect(onPropose).toHaveBeenCalledWith({
      description: 'Loose wiring',
      extraRupees: 400,
      extraTime: '+1 hour',
    });
    expect(await screen.findByRole('header', { name: 'Waiting for Priya' })).toBeOnTheScreen();
    expect(
      screen.getByText(
        `Asked for +${rupees(400)} and +1 hour. Continue the agreed work meanwhile.`,
      ),
    ).toBeOnTheScreen();
  });
});
