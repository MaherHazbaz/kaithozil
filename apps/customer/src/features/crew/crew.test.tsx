import { fireEvent, screen, within } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import {
  firstDueDay,
  formatHalfDays,
  paidPercent,
  totalWorkers,
  withRoleCount,
  workerDays,
} from './crewPlan';
import {
  defaultCrewRequest,
  sampleConfirmedCrew,
  sampleCrewPayments,
  sampleCrewProfile,
  sampleJobPlan,
} from './sampleData';
import { CrewBookScreen, type CrewBookScreenProps } from './screens/CrewBookScreen';
import { CrewPaymentsScreen } from './screens/CrewPaymentsScreen';
import { CrewProfileScreen } from './screens/CrewProfileScreen';
import { CrewTeamScreen } from './screens/CrewTeamScreen';
import { JobPlanScreen, type JobPlanScreenProps } from './screens/JobPlanScreen';

describe('crew counting', () => {
  it('counts workers and worker-days', () => {
    expect(totalWorkers(defaultCrewRequest.counts)).toBe(7);
    expect(workerDays(defaultCrewRequest.counts, 5)).toBe(35);
  });

  it('keeps a role count inside the stepper limits', () => {
    const counts = defaultCrewRequest.counts;
    expect(withRoleCount(counts, 'mason', -1).mason).toBe(0);
    expect(withRoleCount(counts, 'mason', 21).mason).toBe(20);
    expect(withRoleCount(counts, 'mason', 4)).toEqual({ ...counts, mason: 4 });
  });

  it('rounds the paid bar down and writes half days as the design does', () => {
    expect(paidPercent(2, 6)).toBe(33);
    expect(paidPercent(6, 6)).toBe(100);
    expect(paidPercent(1, 0)).toBe(0);
    expect(formatHalfDays(4)).toBe('2');
    expect(formatHalfDays(3)).toBe('1.5');
  });

  it('opens the day that is due', () => {
    expect(firstDueDay(sampleCrewPayments.days)?.date).toBe('Wed 19 Nov');
    expect(firstDueDay([])).toBeUndefined();
  });
});

const bookProps: CrewBookScreenProps = {
  initialRequest: defaultCrewRequest,
  onBack: jest.fn(),
  onFind: async () => {},
};

describe('CrewBookScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<CrewBookScreen {...bookProps} />);
    expect(screen.getByRole('header', { name: 'Construction workers' })).toBeOnTheScreen();
    for (const text of [
      'கட்டுமான தொழிலாளர்கள்',
      'New house',
      'Compound wall',
      'Plastering',
      'Repair work',
      'Prefer to choose your crew?',
      'See verified mestri teams, their sites and reviews',
      'Not sure how many workers or days?',
      'தெரியவில்லையா? மேஸ்திரி பரிந்துரைப்பார்',
      'How many workers do you need?',
      'Mason',
      'கொத்தனார் · Kothanaar',
      'Brickwork, plastering, tiling',
      'Heavy helper',
      'பெரியாள் · Periyaal',
      'Mixing concrete, heavy lifting',
      'Site helper',
      'சித்தாள் · Sithaal',
      'Carrying bricks and mortar, site cleaning',
      'Number of days',
      'எத்தனை நாட்கள் · from tomorrow, 8 AM',
      'Send as one team with a mestri',
      'A verified team leader brings the whole crew',
      '7 workers × 5 days',
      '35 worker-days',
      'Find 7 workers',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('updates the totals as workers and days change', async () => {
    await renderScreen(<CrewBookScreen {...bookProps} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Add one Mason' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Fewer days' }));
    expect(screen.getByTestId('crew-book-summary')).toHaveTextContent('8 workers × 4 days');
    expect(screen.getByTestId('crew-book-worker-days')).toHaveTextContent('32 worker-days');
    expect(screen.getByRole('button', { name: 'Find 8 workers' })).toBeOnTheScreen();
  });

  it('shows the job-plan note and wording when the customer is not sure', async () => {
    await renderScreen(<CrewBookScreen {...bookProps} />);
    const unsure = screen.getByTestId('crew-book-unsure');
    expect(unsure).not.toBeChecked();
    await fireEvent.press(unsure);
    expect(unsure).toBeChecked();
    expect(screen.getByText(/The mestri talks to you or visits the site/)).toBeOnTheScreen();
    expect(screen.getByText('Plan to be agreed')).toBeOnTheScreen();
    expect(screen.getByText('You confirm first')).toBeOnTheScreen();
  });

  it('cannot send a request for no workers', async () => {
    await renderScreen(
      <CrewBookScreen
        {...bookProps}
        initialRequest={{
          ...defaultCrewRequest,
          counts: { mason: 1, heavyHelper: 0, siteHelper: 0 },
        }}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Remove one Mason' }));
    expect(screen.getByRole('button', { name: 'Find 0 workers' })).toBeDisabled();
  });

  it('sends the chosen work, team and days', async () => {
    const onFind = jest.fn(async () => {});
    await renderScreen(<CrewBookScreen {...bookProps} onFind={onFind} />);
    await fireEvent.press(screen.getByTestId('crew-work-wall'));
    await fireEvent.press(screen.getByTestId('crew-book-mestri'));
    await fireEvent.press(screen.getByRole('button', { name: 'Find 7 workers' }));
    expect(onFind).toHaveBeenCalledWith({
      ...defaultCrewRequest,
      work: 'wall',
      withMestri: false,
    });
  });
});

describe('CrewProfileScreen', () => {
  it('shows the crew, its team and no contact details', async () => {
    await renderScreen(
      <CrewProfileScreen crew={sampleCrewProfile} onBack={jest.fn()} onBook={jest.fn()} />,
    );
    expect(screen.getByRole('header', { name: "Selvam's crew" })).toBeOnTheScreen();
    for (const text of [
      'Verified team · mestri Selvam R.',
      'New houses · walls · plastering · tiling',
      '★ 4.7',
      'Team rating',
      'Members',
      '64',
      'Sites done',
      '14 yrs',
      'Experience',
      'Team (7)',
      'Sites (64)',
      'Reviews',
      'Selvam R.',
      'Mestri and mason · கொத்தனார்',
      'Level 3',
      'New',
      'Every member is ID-verified. Selvam is responsible for the team on site.',
      'Daily rate',
      '[DAILY RATE] per worker',
      'Same rate for the same task, set for this area',
      'Works in',
      'Anna Nagar, Ambattur, Avadi, Villivakkam',
      'Attendance',
      'Daily site photo by the mestri',
      'Book and pay only through Kaithozhil. Phone numbers stay private; you can chat with the mestri once the crew is booked.',
      'Book this crew',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.queryByText(/\+91|\d{10}/)).toBeNull();
  });

  it('switches to sites and reviews', async () => {
    await renderScreen(
      <CrewProfileScreen crew={sampleCrewProfile} onBack={jest.fn()} onBook={jest.fn()} />,
    );
    await fireEvent.press(screen.getByTestId('crew-profile-tab-sites'));
    expect(screen.getAllByText('Kaithozhil job')).toHaveLength(6);
    expect(screen.getByLabelText('Compound wall, Ambattur, 2 weeks')).toBeOnTheScreen();
    expect(
      screen.getByText(
        "Photos from sites done through Kaithozhil, shared with the owners' permission.",
      ),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('crew-profile-tab-reviews'));
    expect(screen.getByText('Compound wall · Oct')).toBeOnTheScreen();
    expect(screen.getByLabelText('5 stars')).toBeOnTheScreen();
    expect(screen.queryByText('Kaithozhil job')).toBeNull();
  });
});

const planProps: JobPlanScreenProps = {
  plan: sampleJobPlan,
  onBack: jest.fn(),
  onConfirm: async () => ({ confirmedAt: '4:10 PM' }),
  onSendChanges: async () => {},
};

describe('JobPlanScreen', () => {
  it("shows the mestri's plan for review", async () => {
    await renderScreen(<JobPlanScreen {...planProps} />);
    expect(screen.getByRole('header', { name: 'Job plan' })).toBeOnTheScreen();
    expect(screen.getByLabelText('Plan status: Needs your OK')).toBeOnTheScreen();
    for (const text of [
      'வேலைத் திட்டம்',
      'Selvam proposed a plan',
      'After visiting your site · New house, Anna Nagar',
      'Masons · கொத்தனார்',
      'Heavy helpers · பெரியாள்',
      'Site helpers · சித்தாள்',
      'Mon 17 Nov – Sat 22 Nov',
      'Same rate for the same task in this area',
      '[DAILY RATE] per worker',
      '7 workers × 6 days',
      '42 worker-days',
      'You pay day by day for the days actually worked, from attendance.',
      'Selvam · mestri',
      "The foundation needs 6 days with this team. If it rains, I'll send a change request.",
      'Nothing starts until you confirm. Either of you can ask for changes later; both must agree.',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByRole('button', { name: 'Confirm plan' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Suggest changes' })).toBeOnTheScreen();
  });

  it('confirms the plan with the time the server recorded', async () => {
    await renderScreen(<JobPlanScreen {...planProps} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Confirm plan' }));
    expect(
      await screen.findByRole('header', { name: 'Plan confirmed by you · 4:10 PM' }),
    ).toBeOnTheScreen();
    expect(screen.getByText('Selvam confirmed · 3:52 PM')).toBeOnTheScreen();
    expect(screen.getByTestId('plan-confirmed')).toHaveTextContent(
      /Work starts Mon 17 Nov, 8 AM. Both of you have this plan on record.$/,
    );
    expect(screen.getByLabelText('Plan status: Confirmed')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'See your crew' })).toBeOnTheScreen();
  });

  it('stays on the plan when confirming fails', async () => {
    await renderScreen(
      <JobPlanScreen {...planProps} onConfirm={() => Promise.reject(new Error('offline'))} />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Confirm plan' }));
    expect(screen.getByRole('button', { name: 'Confirm plan' })).toBeEnabled();
    expect(screen.queryByTestId('plan-confirmed')).toBeNull();
  });

  it('sends suggested changes and waits for the mestri', async () => {
    const onSendChanges = jest.fn(async () => {});
    await renderScreen(<JobPlanScreen {...planProps} onSendChanges={onSendChanges} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Suggest changes' }));
    expect(screen.getByText('· மாற்றம் பரிந்துரைக்கவும்')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'More Masons' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Less Days' }));
    await fireEvent.changeText(
      screen.getByLabelText('Message to Selvam (optional)'),
      'Can we finish in 5 days?',
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Send changes to Selvam' }));
    expect(onSendChanges).toHaveBeenCalledWith({
      counts: { mason: 3, heavyHelper: 3, siteHelper: 2 },
      days: 5,
      message: 'Can we finish in 5 days?',
    });
    expect(await screen.findByRole('header', { name: 'Changes sent to Selvam' })).toBeOnTheScreen();
    expect(screen.getByLabelText('Plan status: Waiting for Selvam')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Go to my bookings' })).toBeOnTheScreen();
  });

  it('throws the draft away on Cancel', async () => {
    const onSendChanges = jest.fn(async () => {});
    await renderScreen(<JobPlanScreen {...planProps} onSendChanges={onSendChanges} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Suggest changes' }));
    await fireEvent.press(screen.getByRole('button', { name: 'More Masons' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByText('7 workers × 6 days')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Suggest changes' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Send changes to Selvam' }));
    expect(onSendChanges).toHaveBeenCalledWith({
      counts: sampleJobPlan.counts,
      days: sampleJobPlan.days,
      message: '',
    });
  });
});

describe('CrewTeamScreen', () => {
  it('shows the confirmed team', async () => {
    const onPayments = jest.fn();
    await renderScreen(
      <CrewTeamScreen crew={sampleConfirmedCrew} onBack={jest.fn()} onPayments={onPayments} />,
    );
    expect(screen.getByRole('header', { name: 'Your crew' })).toBeOnTheScreen();
    for (const text of [
      'உங்கள் குழு',
      'Team confirmed',
      'Starts tomorrow, 8 AM · 12, 4th Street, Anna Nagar',
      'Selvam R.',
      'Mestri · team leader · Verified · ★ 4.7 · 14 yrs',
      'Mason × 2',
      'கொத்தனார் · Kumar P, Arun M',
      'Heavy helper × 3',
      'பெரியாள் · Raja S, Mani K, Velu T',
      'Site helper × 2',
      'சித்தாள் · Lakshmi R, Meena D',
      '5 days',
      'New house',
      '7',
      'workers',
      '35',
      'worker-days',
      "Each morning, Selvam marks attendance with a site photo. You'll see it here and can pay day by day.",
      'Attendance and daily payments',
      'See each day and pay for it',
      'Change team size',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getAllByRole('button', { name: 'Call Selvam' })).toHaveLength(2);
    await fireEvent.press(screen.getByTestId('crew-team-payments'));
    expect(onPayments).toHaveBeenCalledTimes(1);
  });
});

describe('CrewPaymentsScreen', () => {
  it('shows the days with placeholders and opens the day that is due', async () => {
    await renderScreen(
      <CrewPaymentsScreen
        payments={sampleCrewPayments}
        onBack={jest.fn()}
        onPayDay={async () => {}}
      />,
    );
    expect(screen.getByRole('header', { name: 'Daily payments' })).toBeOnTheScreen();
    for (const text of [
      'தினசரி கட்டணம்',
      "New house · Selvam's crew · Day 3 of 6",
      '2 of 6 days paid',
      '[PAID SO FAR]',
      'Mon 17 Nov',
      'Tue 18 Nov',
      'Wed 19 Nov',
      '5 present · 1 half day · 1 absent',
      'Due today',
      'Masons × 2',
      'Heavy helpers × 2',
      'Site helpers × 1.5',
      "From Selvam's attendance with site photo · 8:58 AM",
      'Attendance looks wrong? Report it',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getAllByText('Paid ✓')).toHaveLength(2);
    expect(screen.getAllByText('[DAY TOTAL]')).toHaveLength(3);
    expect(screen.getAllByText('[RATE] each')).toHaveLength(3);
    expect(screen.getByTestId('crew-pay-d3')).toBeExpanded();
    expect(
      within(screen.getByTestId('crew-pay-d3-detail')).getByText('Site helpers × 1.5'),
    ).toBeOnTheScreen();
  });

  it('opens one day at a time', async () => {
    await renderScreen(
      <CrewPaymentsScreen
        payments={sampleCrewPayments}
        onBack={jest.fn()}
        onPayDay={async () => {}}
      />,
    );
    await fireEvent.press(screen.getByTestId('crew-pay-d1'));
    expect(screen.getByTestId('crew-pay-d1-detail')).toBeOnTheScreen();
    expect(screen.queryByTestId('crew-pay-d3-detail')).toBeNull();
    await fireEvent.press(screen.getByTestId('crew-pay-d1'));
    expect(screen.queryByTestId('crew-pay-d1-detail')).toBeNull();
  });

  it('reports the pay tap without marking the day paid', async () => {
    const onPayDay = jest.fn(async () => {});
    await renderScreen(
      <CrewPaymentsScreen payments={sampleCrewPayments} onBack={jest.fn()} onPayDay={onPayDay} />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Pay for Wed 19 Nov' }));
    expect(onPayDay).toHaveBeenCalledWith('d3');
    expect(screen.getByText('Due today')).toBeOnTheScreen();
    expect(screen.getAllByText('Paid ✓')).toHaveLength(2);
  });

  it('has no pay button when no day is due', async () => {
    await renderScreen(
      <CrewPaymentsScreen
        payments={{ ...sampleCrewPayments, days: [], paidDays: 0 }}
        onBack={jest.fn()}
        onPayDay={async () => {}}
      />,
    );
    expect(screen.queryByText(/^Pay for/)).toBeNull();
    expect(screen.getByText('0 of 6 days paid')).toBeOnTheScreen();
  });
});
