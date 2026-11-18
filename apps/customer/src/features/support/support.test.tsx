import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { SAMPLE_LAST_JOB, SAMPLE_TICKET } from './sampleData';
import { SupportScreen } from './screens/SupportScreen';
import { TicketScreen } from './screens/TicketScreen';
import { stepState } from './ticketSteps';

describe('SupportScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<SupportScreen lastJob={SAMPLE_LAST_JOB} onBack={jest.fn()} />);
    expect(screen.getByRole('header', { name: 'Help and support' })).toBeOnTheScreen();
    for (const text of [
      'உதவி',
      'About your last job',
      'Fan repair · KT-20481',
      '10 Nov · Murugan K. · ₹650',
      'What went wrong?',
      "Worker didn't arrive",
      "Work wasn't done properly",
      'I paid, but it shows unpaid',
      'Charged more than agreed',
      'I feel unsafe',
      'Something else',
      'Call us',
      'WhatsApp us',
      'Support in English and Tamil · [SUPPORT HOURS]',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('opens a ticket for the chosen issue', async () => {
    const onIssue = jest.fn();
    await renderScreen(<SupportScreen onBack={jest.fn()} onIssue={onIssue} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Charged more than agreed' }));
    await fireEvent.press(screen.getByRole('button', { name: 'I feel unsafe' }));
    expect(onIssue.mock.calls).toEqual([['overcharged'], ['unsafe']]);
    // Without a last job the card is left out.
    expect(screen.queryByText('About your last job')).toBeNull();
  });
});

describe('TicketScreen', () => {
  it('shows the exact design wording and timeline', async () => {
    await renderScreen(<TicketScreen ticket={SAMPLE_TICKET} onBack={jest.fn()} />);
    expect(screen.getByRole('header', { name: 'Ticket T-1042' })).toBeOnTheScreen();
    for (const text of [
      'உதவி கோரிக்கை',
      'Your issue',
      'I paid, but it shows unpaid',
      'Fan repair · KT-20481',
      'Received',
      'Resolved',
      'Messages',
      'I paid ₹650 by UPI but the app still shows unpaid. UPI ref ending 4821.',
      'You · 5:02 PM',
      "Thanks, Priya. We've asked Murugan to confirm he received it, and we're checking the UPI reference. We'll update you within [RESPONSE TIME]. — Kavya, Kaithozhil support",
      'Support · 5:10 PM',
      'Feel unsafe? Call our safety line now',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    // In the header pill and on the timeline.
    expect(screen.getAllByText('Looking into it')).toHaveLength(2);
    expect(screen.getByLabelText('Received, 5:02 PM')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Write a reply')).toBeOnTheScreen();
  });

  it('sends a typed reply and clears the field, but not an empty one', async () => {
    const onSendReply = jest.fn();
    await renderScreen(
      <TicketScreen ticket={SAMPLE_TICKET} onBack={jest.fn()} onSendReply={onSendReply} />,
    );
    const send = screen.getByRole('button', { name: 'Send reply' });
    await fireEvent.changeText(screen.getByTestId('ticket-reply'), '   ');
    await fireEvent.press(send);
    expect(onSendReply).not.toHaveBeenCalled();

    await fireEvent.changeText(screen.getByTestId('ticket-reply'), '  Ref is 4821  ');
    await fireEvent.press(send);
    expect(onSendReply).toHaveBeenCalledWith('Ref is 4821');
    expect(screen.getByText('Ref is 4821')).toBeOnTheScreen();
    expect(screen.getByTestId('ticket-reply')).toHaveDisplayValue('');
  });

  it('labels the icon-only buttons', async () => {
    const onAttach = jest.fn();
    await renderScreen(
      <TicketScreen ticket={SAMPLE_TICKET} onBack={jest.fn()} onAttach={onAttach} />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Attach a screenshot' }));
    expect(onAttach).toHaveBeenCalled();
  });
});

describe('stepState', () => {
  it('marks earlier steps done and the status current', () => {
    expect(stepState('received', 'lookingIntoIt')).toBe('done');
    expect(stepState('lookingIntoIt', 'lookingIntoIt')).toBe('current');
    expect(stepState('resolved', 'lookingIntoIt')).toBe('upcoming');
  });

  it('marks every step done once resolved', () => {
    expect(stepState('resolved', 'resolved')).toBe('done');
    expect(stepState('received', 'resolved')).toBe('done');
  });
});
