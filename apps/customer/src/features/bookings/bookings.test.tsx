import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { BookingsScreen, type BookingsScreenProps } from './screens/BookingsScreen';

// The data drawn in design/source/Bookings.dc.html.
const designData: BookingsScreenProps = {
  upcoming: [
    {
      id: 'help-trial-1',
      icon: 'calendar',
      iconTone: 'mango',
      title: 'Trial day done · Lakshmi R.',
      detail: 'Housekeeping · decide if you want to continue',
      status: { label: 'Decide', tone: 'mango' },
    },
    {
      id: 'help-1',
      icon: 'sparkles',
      title: 'Regular help · Lakshmi R.',
      detail: 'Housekeeping · Mon – Sat, 6 – 8 AM',
      status: { label: 'Active', tone: 'purple' },
    },
    {
      id: 'crew-1',
      icon: 'brickWall',
      title: 'Construction crew · 7 workers',
      detail: 'From tomorrow, 8 AM · 5 days · New house',
      status: { label: 'Team confirmed', tone: 'purple' },
    },
    {
      id: 'job-2',
      icon: 'paintRoller',
      title: 'Painter · 2 bedroom walls',
      detail: 'Sat 15 Nov, 9 AM',
      status: { label: 'Finding a worker', tone: 'mango' },
    },
  ],
  past: [
    {
      id: 'KT-20481',
      icon: 'zap',
      title: 'Fan repair · Murugan K.',
      detail: '10 Nov · KT-20481',
      amountRupees: 650,
    },
    {
      id: 'KT-19977',
      icon: 'droplet',
      title: 'Tap leak · Ravi S.',
      detail: '2 Nov · KT-19977',
      amountRupees: 350,
    },
  ],
};

const tabButton = (name: string) => screen.getByRole('button', { name });

describe('BookingsScreen', () => {
  it('shows the exact design wording on the Upcoming list', async () => {
    await renderScreen(<BookingsScreen {...designData} />);
    expect(screen.getByRole('header', { name: 'Your bookings' })).toBeOnTheScreen();
    for (const text of [
      'உங்கள் முன்பதிவுகள்',
      'Upcoming (4)',
      'Past (2)',
      'Trial day done · Lakshmi R.',
      'Housekeeping · decide if you want to continue',
      'Decide',
      'Regular help · Lakshmi R.',
      'Housekeeping · Mon – Sat, 6 – 8 AM',
      'Active',
      'Construction crew · 7 workers',
      'From tomorrow, 8 AM · 5 days · New house',
      'Team confirmed',
      'Painter · 2 bedroom walls',
      'Sat 15 Nov, 9 AM',
      'Finding a worker',
      'Home',
      'Bookings',
      'Profile',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('starts on Upcoming and switches to Past', async () => {
    await renderScreen(<BookingsScreen {...designData} />);
    expect(tabButton('Upcoming (4)')).toBeSelected();
    expect(screen.queryByText('Fan repair · Murugan K.')).not.toBeOnTheScreen();

    await fireEvent.press(tabButton('Past (2)'));
    expect(tabButton('Past (2)')).toBeSelected();
    expect(tabButton('Upcoming (4)')).not.toBeSelected();
    expect(screen.queryByText('Painter · 2 bedroom walls')).not.toBeOnTheScreen();
    for (const text of [
      'Past',
      'Fan repair · Murugan K.',
      '10 Nov · KT-20481',
      '₹650',
      'Tap leak · Ravi S.',
      '2 Nov · KT-19977',
      '₹350',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getAllByText('Paid ✓')).toHaveLength(2);
    expect(screen.getAllByText('View receipt')).toHaveLength(2);
    expect(screen.getAllByText('Get help')).toHaveLength(2);
  });

  it('counts the bookings in the tab labels', async () => {
    await renderScreen(<BookingsScreen upcoming={designData.upcoming.slice(0, 1)} past={[]} />);
    expect(tabButton('Upcoming (1)')).toBeOnTheScreen();
    expect(tabButton('Past (0)')).toBeOnTheScreen();
  });

  it('marks Bookings as the active tab', async () => {
    await renderScreen(<BookingsScreen {...designData} />);
    expect(screen.getByRole('tab', { name: 'Bookings' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Home' })).not.toBeSelected();
  });

  it('reports which booking was opened, its receipt viewed or help asked, and tab taps', async () => {
    const handlers = {
      onOpenBooking: jest.fn(),
      onViewReceipt: jest.fn(),
      onGetHelp: jest.fn(),
      onTab: jest.fn(),
    };
    await renderScreen(<BookingsScreen {...designData} {...handlers} />);
    await fireEvent.press(screen.getByTestId('booking-job-2'));
    expect(handlers.onOpenBooking).toHaveBeenCalledWith('job-2');

    await fireEvent.press(tabButton('Past (2)'));
    await fireEvent.press(
      screen.getByRole('button', { name: 'View receipt: Fan repair · Murugan K.' }),
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Get help: Tap leak · Ravi S.' }));
    expect(handlers.onViewReceipt).toHaveBeenCalledWith('KT-20481');
    expect(handlers.onGetHelp).toHaveBeenCalledWith('KT-19977');

    await fireEvent.press(screen.getByRole('tab', { name: 'Home' }));
    expect(handlers.onTab).toHaveBeenCalledWith('home');
  });
});
