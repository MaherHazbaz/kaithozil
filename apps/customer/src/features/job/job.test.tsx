import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { isJobServiceKey, jobServices } from './copy';
import { missingJobDetail } from './jobDraft';
import { DescribeJobScreen, type DescribeJobScreenProps } from './screens/DescribeJobScreen';

const designData: DescribeJobScreenProps = {
  service: 'electrician',
  address: { label: 'Home', line: '12, 4th Street, Anna Nagar' },
  estimateRange: '₹400 – 700',
  onBack: jest.fn(),
};

// The state drawn in design/source/Post.dc.html.
const designDraft = {
  problem: 'fan',
  description: 'Bedroom ceiling fan not spinning, makes a humming sound.',
};

describe('isJobServiceKey', () => {
  it('accepts only services this screen is ready for', () => {
    for (const key of ['electrician', 'plumber', 'ac', 'carpenter']) {
      expect(isJobServiceKey(key)).toBe(true);
    }
    // Their own forms (or no approved wording yet), not this screen.
    for (const key of ['painter', 'tailor', 'mechanic', 'housekeeping']) {
      expect(isJobServiceKey(key)).toBe(false);
    }
    expect(isJobServiceKey('toString')).toBe(false);
    expect(isJobServiceKey(undefined)).toBe(false);
    expect(isJobServiceKey(['electrician'])).toBe(false);
  });
});

describe('jobServices', () => {
  it('ends every trade with an "Other" that needs a description, and keeps keys unique', () => {
    for (const service of Object.values(jobServices)) {
      const last = service.problems[service.problems.length - 1];
      expect(last).toEqual({ key: 'other', label: 'Other', needsDescription: true });
      const keys = service.problems.map((problem) => problem.key);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });
});

describe('DescribeJobScreen for the added trades', () => {
  it.each([
    ['plumber', 'Plumber', 'குழாய்', 'Tap / Leak', 'Find a plumber'],
    ['ac', 'AC repair', 'ஏசி பழுது', 'Not cooling', 'Find an AC technician'],
    ['carpenter', 'Carpenter', 'தச்சர்', 'Door / Lock', 'Find a carpenter'],
  ] as const)('shows the %s wording', async (service, title, tamil, firstChip, cta) => {
    await renderScreen(<DescribeJobScreen {...designData} service={service} />);
    expect(screen.getByText(title)).toBeOnTheScreen();
    expect(screen.getByText(tamil)).toBeOnTheScreen();
    expect(screen.getByText(firstChip)).toBeOnTheScreen();
    expect(screen.getByText(cta)).toBeOnTheScreen();
  });
});

describe('missingJobDetail', () => {
  const problems = jobServices.electrician.problems;

  it('needs a problem first', () => {
    expect(missingJobDetail({ problem: null, description: 'Fan is noisy' }, problems)).toBe(
      'problem',
    );
    expect(missingJobDetail({ problem: 'not-a-chip', description: '' }, problems)).toBe('problem');
  });

  it('is ready with a named problem, description optional', () => {
    expect(missingJobDetail({ problem: 'fan', description: '' }, problems)).toBeNull();
  });

  it('needs a description for "Other", and spaces do not count', () => {
    expect(missingJobDetail({ problem: 'other', description: '' }, problems)).toBe('description');
    expect(missingJobDetail({ problem: 'other', description: '   ' }, problems)).toBe(
      'description',
    );
    expect(missingJobDetail({ problem: 'other', description: 'Doorbell' }, problems)).toBeNull();
  });
});

describe('DescribeJobScreen', () => {
  it('says why the main button is disabled, and asks for a description with "Other"', async () => {
    await renderScreen(<DescribeJobScreen {...designData} />);
    const submit = screen.getByTestId('job-submit');
    const description = screen.getByTestId('job-description');

    expect(screen.getByText('Choose a problem to continue')).toBeOnTheScreen();
    expect(screen.getByText('Describe it (optional)')).toBeOnTheScreen();
    expect(description).toHaveProp(
      'placeholder',
      'e.g. Bedroom ceiling fan not spinning, makes a humming sound.',
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Other' }));
    expect(screen.getByText('Describe the problem to continue')).toBeOnTheScreen();
    expect(screen.getByText('Describe it')).toBeOnTheScreen();
    expect(submit).toBeDisabled();

    await fireEvent.changeText(description, 'Doorbell not ringing');
    expect(screen.queryByTestId('job-missing')).toBeNull();
    expect(submit).toBeEnabled();

    // A named problem is enough again, so the description is optional again.
    await fireEvent.changeText(description, '');
    await fireEvent.press(screen.getByRole('button', { name: 'Fan' }));
    expect(screen.getByText('Describe it (optional)')).toBeOnTheScreen();
    expect(submit).toBeEnabled();
  });

  it('shows the exact design wording', async () => {
    await renderScreen(<DescribeJobScreen {...designData} initialDraft={designDraft} />);
    for (const text of [
      'Electrician',
      'மின் பணியாளர்',
      "What's the problem?",
      'என்ன பிரச்சனை?',
      'Fan',
      'Lights',
      'Switchboard',
      'Wiring',
      'Fuse / MCB',
      'Other',
      'Describe it (optional)',
      'Add photo',
      'Voice note',
      'When do you need it?',
      'Now',
      'Nearby workers get a call right away',
      'Schedule',
      'Pick a date and time',
      'Home',
      '12, 4th Street, Anna Nagar',
      'Change',
      'Estimated cost',
      '₹400 – 700 · agreed on site',
      'Find an electrician',
    ]) {
      expect(screen.getAllByText(text, { exact: false }).length).toBeGreaterThan(0);
    }
    expect(screen.getByTestId('job-description')).toHaveProp('value', designDraft.description);
    expect(screen.getByRole('button', { name: 'Fan' })).toBeSelected();
  });

  it('starts empty, with the main button disabled until a problem is chosen', async () => {
    const onSubmit = jest.fn();
    await renderScreen(<DescribeJobScreen {...designData} onSubmit={onSubmit} />);
    const submit = screen.getByRole('button', { name: 'Find an electrician' });

    expect(screen.getByRole('button', { name: 'Fan' })).not.toBeSelected();
    expect(screen.getByTestId('job-description')).toHaveProp('value', '');
    expect(submit).toBeDisabled();
    await fireEvent.press(submit);
    expect(onSubmit).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByRole('button', { name: 'Wiring' }));
    expect(screen.getByRole('button', { name: 'Wiring' })).toBeSelected();
    expect(submit).toBeEnabled();
  });

  it('keeps one problem selected at a time', async () => {
    await renderScreen(<DescribeJobScreen {...designData} initialDraft={designDraft} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Lights' }));
    expect(screen.getByRole('button', { name: 'Lights' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Fan' })).not.toBeSelected();
  });

  it('changes the main button text between Now and Schedule', async () => {
    await renderScreen(<DescribeJobScreen {...designData} initialDraft={designDraft} />);
    const now = screen.getByTestId('job-timing-now');
    const schedule = screen.getByTestId('job-timing-schedule');
    expect(now).toBeSelected();

    await fireEvent.press(schedule);
    expect(schedule).toBeSelected();
    expect(now).not.toBeSelected();
    expect(screen.getByRole('button', { name: 'Schedule an electrician' })).toBeOnTheScreen();

    await fireEvent.press(now);
    expect(screen.getByRole('button', { name: 'Find an electrician' })).toBeOnTheScreen();
  });

  it('sends what the customer entered', async () => {
    const onSubmit = jest.fn();
    await renderScreen(<DescribeJobScreen {...designData} onSubmit={onSubmit} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Switchboard' }));
    await fireEvent.changeText(screen.getByTestId('job-description'), 'Sparks when switched on');
    await fireEvent.press(screen.getByTestId('job-timing-schedule'));
    await fireEvent.press(screen.getByRole('button', { name: 'Half a day' }));
    await fireEvent.press(screen.getByTestId('job-submit'));
    expect(onSubmit).toHaveBeenCalledWith({
      problem: 'switchboard',
      description: 'Sparks when switched on',
      timing: 'schedule',
      duration: 'halfDay',
    });
  });

  it('asks how long it might take, "Not sure" first', async () => {
    await renderScreen(<DescribeJobScreen {...designData} />);
    expect(
      screen.getByRole('header', { name: 'How long might it take? · எவ்வளவு நேரம்?' }),
    ).toBeOnTheScreen();
    for (const label of ['Quick fix (under 1 hour)', 'Half a day', 'A full day or more']) {
      expect(screen.getByRole('button', { name: label })).not.toBeSelected();
    }
    expect(screen.getByRole('button', { name: "Not sure, let's decide together" })).toBeSelected();
    const note =
      "That's fine. The worker checks the job, then you both agree the time and price in the app before work starts.";
    expect(screen.getByText(note)).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Quick fix (under 1 hour)' }));
    expect(screen.getByRole('button', { name: 'Quick fix (under 1 hour)' })).toBeSelected();
    expect(screen.queryByText(note)).toBeNull();
  });

  it('offers "Choose a date and time" only when scheduling', async () => {
    const onChooseTime = jest.fn();
    await renderScreen(<DescribeJobScreen {...designData} onChooseTime={onChooseTime} />);
    expect(screen.queryByRole('link', { name: 'Choose a date and time' })).toBeNull();
    await fireEvent.press(screen.getByTestId('job-timing-schedule'));
    await fireEvent.press(screen.getByRole('link', { name: 'Choose a date and time' }));
    expect(onChooseTime).toHaveBeenCalledTimes(1);
  });

  it('reports back, add photo, voice note and change address', async () => {
    const handlers = {
      onBack: jest.fn(),
      onAddPhoto: jest.fn(),
      onVoiceNote: jest.fn(),
      onChangeAddress: jest.fn(),
    };
    await renderScreen(<DescribeJobScreen {...designData} {...handlers} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Add photo' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Voice note' }));
    await fireEvent.press(screen.getByRole('link', { name: 'Change' }));
    for (const handler of Object.values(handlers)) {
      expect(handler).toHaveBeenCalledTimes(1);
    }
  });
});
