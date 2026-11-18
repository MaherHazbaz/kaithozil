import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { SAMPLE_PROFILE } from './sampleProfile';
import { BookWorkerScreen, type BookWorkerScreenProps } from './screens/BookWorkerScreen';
import { PublicProfileScreen, type PublicProfileScreenProps } from './screens/PublicProfileScreen';

// The data drawn in design/source/Book.dc.html.
const designData: BookWorkerScreenProps = {
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

describe('BookWorkerScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<BookWorkerScreen {...designData} />);
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
    await renderScreen(<BookWorkerScreen {...designData} />);
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
    await renderScreen(<BookWorkerScreen {...designData} onBook={onBook} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Tomorrow 9 – 11 AM' }));
    await fireEvent.press(
      screen.getByRole('button', { name: 'Book Murugan · Tomorrow 9 – 11 AM' }),
    );
    expect(onBook).toHaveBeenCalledWith({ id: 'tomorrow', day: 'Tomorrow', time: '9 – 11 AM' });
  });

  it('offers no Book button when the worker has no free slot', async () => {
    await renderScreen(<BookWorkerScreen {...designData} slots={[]} />);
    expect(screen.queryByRole('button', { name: /^Book / })).toBeNull();
  });

  it('goes back', async () => {
    const onBack = jest.fn();
    await renderScreen(<BookWorkerScreen {...designData} onBack={onBack} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

describe('PublicProfileScreen', () => {
  const renderProfile = (props: Partial<PublicProfileScreenProps> = {}) =>
    renderScreen(
      <PublicProfileScreen
        worker={SAMPLE_PROFILE}
        onBack={jest.fn()}
        onBook={jest.fn()}
        {...props}
      />,
    );

  it('shows the exact design wording on the Work tab', async () => {
    await renderProfile();
    expect(screen.getByRole('header', { name: 'Murugan K.' })).toBeOnTheScreen();
    for (const text of [
      'MK',
      'Verified · Level 2 Electrician',
      'Serves Anna Nagar, Kilpauk, Aminjikarai',
      '★ 4.8',
      '212 reviews',
      '280',
      'Jobs done',
      '58%',
      'Repeat',
      '12 yrs',
      'Experience',
      'Work (6)',
      'Reviews (212)',
      'About',
      'Bedroom fan and regulator',
      'Kitchen modular switchboard',
      'LED strip lighting in hall',
      'Inverter wiring, 2BHK',
      'Geyser point in bathroom',
      'MCB box upgrade',
      "Every photo is from a job done through Kaithozhil, shared with the customer's permission.",
      'To keep everyone safe, you book and pay only through Kaithozhil. Phone numbers stay private; you can chat or call through the app once a job is booked.',
      'Save',
      'Book Murugan',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getAllByText('Kaithozhil job')).toHaveLength(6);
    expect(
      screen.getByRole('image', { name: 'Bedroom fan and regulator, 10 Nov' }),
    ).toBeOnTheScreen();
  });

  it('switches to Reviews and About', async () => {
    await renderProfile();
    await fireEvent.press(screen.getByRole('button', { name: 'Reviews (212)' }));
    expect(screen.getByRole('button', { name: 'Reviews (212)' })).toBeSelected();
    for (const text of [
      'Priya R.',
      'Fan repair · 10 Nov',
      'Came on time, fixed the fan quickly and explained what was wrong. Very neat work.',
      'Karthik S.',
      'Switchboard · 6 Nov',
      'New switchboard in the kitchen looks clean. Fair price, agreed before starting.',
      'Lakshmi N.',
      'Lighting · 1 Nov',
      'Good LED work in the hall. Took a little longer than expected.',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getAllByText('★★★★★')).toHaveLength(2);
    expect(screen.getByText('★★★★')).toBeOnTheScreen();
    expect(screen.queryByText('MCB box upgrade')).toBeNull();

    await fireEvent.press(screen.getByRole('button', { name: 'About' }));
    for (const text of [
      'Skills',
      'Wiring · fans · switchboards · inverter · LED',
      'Languages',
      'Tamil · English',
      'Usually works',
      'Mon–Sat, 8 AM – 7 PM',
      'Verified',
      'Aadhaar · PAN · face match · UPI name',
      'Training',
      'Electrical safety ✓ · Solar (in progress)',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('never shows a phone number', async () => {
    await renderProfile();
    expect(screen.queryByText(/\+91|\d{10}/)).toBeNull();
  });

  it('toggles Save', async () => {
    const onToggleSave = jest.fn();
    await renderProfile({ onToggleSave });
    const save = screen.getByRole('button', { name: 'Save Murugan' });
    expect(save).not.toBeSelected();
    await fireEvent.press(save);
    expect(screen.getByRole('button', { name: 'Save Murugan' })).toBeSelected();
    expect(screen.getByText('Saved')).toBeOnTheScreen();
    expect(onToggleSave).toHaveBeenCalledWith(true);
  });

  it('books and goes back', async () => {
    const onBook = jest.fn();
    const onBack = jest.fn();
    await renderProfile({ onBook, onBack });
    await fireEvent.press(screen.getByRole('button', { name: 'Book Murugan' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    expect(onBook).toHaveBeenCalledTimes(1);
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
