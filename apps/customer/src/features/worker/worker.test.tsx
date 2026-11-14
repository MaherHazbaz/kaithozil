import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { WorkerProfileScreen, type WorkerProfileScreenProps } from './screens/WorkerProfileScreen';

// The data drawn in design/source/Book.dc.html.
const designData: WorkerProfileScreenProps = {
  worker: {
    id: 'murugan-k',
    name: 'Murugan K.',
    firstName: 'Murugan',
    initials: 'MK',
    trade: 'Electrician',
    badge: 'Verified · Level 2',
    rating: '4.8',
    jobsDone: 280,
    experienceYears: 12,
    tags: ['Wiring', 'Fans & lights', 'Inverter', 'Tamil, English'],
  },
  slots: [
    { id: 'today', day: 'Today', time: '4 – 6 PM' },
    { id: 'tomorrow', day: 'Tomorrow', time: '9 – 11 AM' },
  ],
  problem: 'Fan not working',
  estimateRange: '₹400 – 700',
  onBack: jest.fn(),
};

describe('WorkerProfileScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<WorkerProfileScreen {...designData} />);
    expect(screen.getByRole('header', { name: 'Electrician' })).toBeOnTheScreen();
    for (const text of [
      'MK',
      'Murugan K.',
      'Verified · Level 2',
      '★ 4.8',
      'Rating',
      '280',
      'Jobs done',
      '12 yrs',
      'Experience',
      'Wiring',
      'Fans & lights',
      'Inverter',
      'Tamil, English',
      'Choose a time',
      'Today',
      '4 – 6 PM',
      'Tomorrow',
      '9 – 11 AM',
      'Your problem',
      'Fan not working',
      'Estimate',
      '₹400 – 700',
      'Final price is agreed with Murugan before work starts.',
      'Book Murugan · Today 4 – 6 PM',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('starts on the first slot and updates the button when another is chosen', async () => {
    await renderScreen(<WorkerProfileScreen {...designData} />);
    const today = screen.getByRole('button', { name: 'Today 4 – 6 PM' });
    const tomorrow = screen.getByRole('button', { name: 'Tomorrow 9 – 11 AM' });
    expect(today).toBeSelected();
    expect(tomorrow).not.toBeSelected();

    await fireEvent.press(tomorrow);
    expect(tomorrow).toBeSelected();
    expect(today).not.toBeSelected();
    expect(
      screen.getByRole('button', { name: 'Book Murugan · Tomorrow 9 – 11 AM' }),
    ).toBeOnTheScreen();
  });

  it('books the chosen slot', async () => {
    const onBook = jest.fn();
    await renderScreen(<WorkerProfileScreen {...designData} onBook={onBook} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Tomorrow 9 – 11 AM' }));
    await fireEvent.press(
      screen.getByRole('button', { name: 'Book Murugan · Tomorrow 9 – 11 AM' }),
    );
    expect(onBook).toHaveBeenCalledWith({ id: 'tomorrow', day: 'Tomorrow', time: '9 – 11 AM' });
  });

  it('offers no Book button when the worker has no free slot', async () => {
    await renderScreen(<WorkerProfileScreen {...designData} slots={[]} />);
    expect(screen.queryByRole('button', { name: /^Book / })).toBeNull();
  });

  it('goes back', async () => {
    const onBack = jest.fn();
    await renderScreen(<WorkerProfileScreen {...designData} onBack={onBack} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
