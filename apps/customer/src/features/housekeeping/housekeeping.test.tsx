import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { calendarWeeks } from './attendance';
import {
  DEFAULT_DRAFT,
  estimateText,
  missingHousekeepingDetail,
  toHousekeepingRequest,
  toggleItem,
} from './housekeepingDraft';
import { sampleHousekeeper, sampleLeave, sampleRegularHelp, sampleTrial } from './sampleData';
import { HousekeepingBookScreen } from './screens/HousekeepingBookScreen';
import { LeaveApproveScreen } from './screens/LeaveApproveScreen';
import { RegularHelpScreen } from './screens/RegularHelpScreen';
import { TrialDecisionScreen } from './screens/TrialDecisionScreen';

describe('housekeeping draft', () => {
  it('toggles items in and out of a list', () => {
    expect(toggleItem(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleItem(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('asks for a task first, then days for regular help only', () => {
    expect(missingHousekeepingDetail({ type: 'regular', tasks: [], days: [] })).toBe('tasks');
    expect(missingHousekeepingDetail({ type: 'regular', tasks: ['dishes'], days: [] })).toBe(
      'days',
    );
    expect(missingHousekeepingDetail({ type: 'oneTime', tasks: ['dishes'], days: [] })).toBeNull();
  });

  it('drops regular-only choices from a one-time request and rejects bad hours', () => {
    expect(toHousekeepingRequest({ ...DEFAULT_DRAFT, type: 'oneTime' })).toMatchObject({
      days: [],
      trialDay: false,
    });
    expect(toHousekeepingRequest({ ...DEFAULT_DRAFT, hours: 9 })).toBeNull();
    expect(toHousekeepingRequest({ ...DEFAULT_DRAFT, hours: 1.5 })).toBeNull();
    expect(toHousekeepingRequest(DEFAULT_DRAFT)).toEqual(DEFAULT_DRAFT);
  });

  it('words the estimate as the design does', () => {
    expect(estimateText(DEFAULT_DRAFT)).toEqual({
      amount: '[MONTHLY RATE] a month',
      detail: 'For 6 days a week, 2 h a day. You pay only for days worked.',
    });
    expect(estimateText({ ...DEFAULT_DRAFT, type: 'oneTime' })).toEqual({
      amount: '[VISIT RATE]',
      detail: 'For a 2 BHK, about 2 hours. Pay after the cleaning.',
    });
  });
});

describe('attendance calendar', () => {
  it('lays November 2026 out from Sunday in full weeks', () => {
    const weeks = calendarWeeks(sampleRegularHelp.attendance);
    expect(weeks).toHaveLength(5);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks[0]?.[0]).toEqual({ day: 1, status: 'dayOff' });
    expect(weeks[4]?.[1]).toEqual({ day: 30, status: 'upcoming' });
    expect(weeks[4]?.[2]).toBeNull();
  });

  it('pads before day 1 when the month does not start on a Sunday', () => {
    const weeks = calendarWeeks({
      year: 2025,
      monthIndex: 10, // November 2025 starts on a Saturday.
      name: 'November',
      days: Array.from({ length: 30 }, () => 'worked' as const),
    });
    expect(weeks[0]?.slice(0, 6).every((cell) => cell === null)).toBe(true);
    expect(weeks[0]?.[6]).toEqual({ day: 1, status: 'worked' });
  });

  it('rejects a month with the wrong number of days', () => {
    expect(() =>
      calendarWeeks({ year: 2026, monthIndex: 1, name: 'February', days: ['worked'] }),
    ).toThrow(RangeError);
  });
});

describe('HousekeepingBookScreen', () => {
  it('shows the design state and sends the request', async () => {
    const onSubmit = jest.fn();
    await renderScreen(<HousekeepingBookScreen onBack={jest.fn()} onSubmit={onSubmit} />);
    expect(screen.getByText('6 days a week')).toBeTruthy();
    expect(screen.getByText('Find housekeepers')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('housekeeping-submit'));
    expect(onSubmit).toHaveBeenCalledWith(DEFAULT_DRAFT);
  });

  it('disables the button and says why when no task is chosen', async () => {
    const onSubmit = jest.fn();
    await renderScreen(
      <HousekeepingBookScreen
        onBack={jest.fn()}
        onSubmit={onSubmit}
        initialDraft={{ tasks: [] }}
      />,
    );
    expect(screen.getByTestId('housekeeping-missing')).toHaveTextContent(
      'Choose at least one task',
    );
    await fireEvent.press(screen.getByTestId('housekeeping-submit'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('hides days and the trial day for a one-time cleaning', async () => {
    await renderScreen(<HousekeepingBookScreen onBack={jest.fn()} />);
    await fireEvent.press(screen.getByTestId('housekeeping-type-oneTime'));
    expect(screen.queryByTestId('housekeeping-day-count')).toBeNull();
    expect(screen.queryByTestId('housekeeping-trial')).toBeNull();
    expect(screen.getByText('Book a cleaning')).toBeTruthy();
    expect(screen.getByTestId('housekeeping-estimate')).toHaveTextContent('[VISIT RATE]');
  });

  it('counts the chosen days and asks for one when none is left', async () => {
    await renderScreen(
      <HousekeepingBookScreen onBack={jest.fn()} initialDraft={{ days: ['mon'] }} />,
    );
    expect(screen.getByText('1 day a week')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('housekeeping-day-mon'));
    expect(screen.getByTestId('housekeeping-missing')).toHaveTextContent('Choose at least one day');
  });
});

describe('TrialDecisionScreen', () => {
  it('continues with the rating and shows the confirmation', async () => {
    const onContinue = jest.fn(async () => {});
    await renderScreen(
      <TrialDecisionScreen
        trial={sampleTrial}
        onBack={jest.fn()}
        onContinue={onContinue}
        onTrySomeoneElse={jest.fn(async () => {})}
      />,
    );
    await fireEvent.press(screen.getByTestId('trial-star-4'));
    expect(screen.getByTestId('trial-rating-word')).toHaveTextContent('Very good');
    await fireEvent.press(screen.getByTestId('trial-continue'));
    expect(onContinue).toHaveBeenCalledWith(4);
    expect(screen.getByText('Lakshmi starts Thu 2 Oct, 6 AM')).toBeTruthy();
  });

  it('stays on the choice when the server refuses', async () => {
    await renderScreen(
      <TrialDecisionScreen
        trial={sampleTrial}
        onBack={jest.fn()}
        onContinue={jest.fn(async () => {})}
        onTrySomeoneElse={jest.fn(async () => {
          throw new Error('offline');
        })}
      />,
    );
    await fireEvent.press(screen.getByTestId('trial-other'));
    expect(screen.queryByTestId('trial-other-card')).toBeNull();
    expect(screen.getByTestId('trial-continue')).toBeTruthy();
  });
});

describe('RegularHelpScreen', () => {
  const props = {
    help: sampleRegularHelp,
    onBack: jest.fn(),
    onPay: jest.fn(async () => {}),
    onPause: jest.fn(async () => {}),
    onResume: jest.fn(async () => {}),
  };

  it('shows the leave request, calendar and pay placeholders', async () => {
    const onOpenLeave = jest.fn();
    await renderScreen(<RegularHelpScreen {...props} onOpenLeave={onOpenLeave} />);
    expect(screen.getByLabelText('11 November: Paid leave')).toBeTruthy();
    expect(screen.getByLabelText('19 November: Absent')).toBeTruthy();
    expect(screen.getByText('[AMOUNT]')).toBeTruthy();
    expect(screen.getByText('[LEAVE DAYS] paid leave days a month')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('help-leave'));
    expect(onOpenLeave).toHaveBeenCalledWith('leave-1');
  });

  it('pauses and resumes', async () => {
    await renderScreen(<RegularHelpScreen {...props} />);
    await fireEvent.press(screen.getByTestId('help-pause'));
    expect(props.onPause).toHaveBeenCalled();
    expect(screen.queryByTestId('help-change-days')).toBeNull();
    await fireEvent.press(screen.getByTestId('help-resume'));
    expect(props.onResume).toHaveBeenCalled();
    expect(screen.getByTestId('help-change-days')).toBeTruthy();
  });
});

describe('LeaveApproveScreen', () => {
  it('approves with cover', async () => {
    const onApprove = jest.fn(async () => {});
    await renderScreen(
      <LeaveApproveScreen
        housekeeper={sampleHousekeeper}
        leave={sampleLeave}
        onBack={jest.fn()}
        onApprove={onApprove}
        onDecline={jest.fn(async () => {})}
      />,
    );
    expect(screen.getByTestId('leave-cover-text')).toHaveTextContent(
      'No cover: nobody comes on Fri and Sat.',
    );
    await fireEvent.press(screen.getByTestId('leave-cover'));
    expect(screen.getByTestId('leave-cover-text')).toHaveTextContent(
      'A verified housekeeper will cover Fri and Sat. You pay them for those days only.',
    );
    await fireEvent.press(screen.getByTestId('leave-approve'));
    expect(onApprove).toHaveBeenCalledWith({ cover: true });
    expect(screen.getByTestId('leave-approved')).toBeTruthy();
  });

  it('declines', async () => {
    await renderScreen(
      <LeaveApproveScreen
        housekeeper={sampleHousekeeper}
        leave={sampleLeave}
        onBack={jest.fn()}
        onApprove={jest.fn(async () => {})}
        onDecline={jest.fn(async () => {})}
      />,
    );
    await fireEvent.press(screen.getByTestId('leave-decline'));
    expect(screen.getByText('Leave declined')).toBeTruthy();
  });
});
