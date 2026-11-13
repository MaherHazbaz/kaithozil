import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { ProfileScreen, type ProfileScreenProps } from './screens/ProfileScreen';

// The data drawn in design/source/Profile.dc.html.
const designData: ProfileScreenProps = {
  name: 'Priya R.',
  initials: 'PR',
  phone: '+91 98400 12345',
  addressesSummary: 'Home · Anna Nagar, and 1 more',
};

describe('ProfileScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<ProfileScreen {...designData} />);
    expect(screen.getByRole('header', { name: 'Profile' })).toBeOnTheScreen();
    for (const text of [
      'சுயவிவரம்',
      'PR',
      'Priya R.',
      '+91 98400 12345',
      'Edit',
      'Saved addresses',
      'Home · Anna Nagar, and 1 more',
      'Business account',
      'Regular maintenance for a society, office or shop',
      'Payments',
      'Pay workers with any UPI app',
      'Language',
      'English · தமிழ்',
      'Safety',
      'Emergency contact and safety tips',
      'Help and support',
      'Report a problem with a job',
      'Terms and privacy',
      'Log out',
      'Home',
      'Bookings',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('marks Profile as the active tab', async () => {
    await renderScreen(<ProfileScreen {...designData} />);
    expect(screen.getByRole('tab', { name: 'Profile' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Home' })).not.toBeSelected();
  });

  it('reports Edit, every row and tab taps', async () => {
    const handlers = { onEdit: jest.fn(), onRow: jest.fn(), onTab: jest.fn() };
    await renderScreen(<ProfileScreen {...designData} {...handlers} />);

    await fireEvent.press(screen.getByRole('link', { name: 'Edit your name and number' }));
    expect(handlers.onEdit).toHaveBeenCalledTimes(1);

    const rows = [
      'addresses',
      'business',
      'payments',
      'language',
      'safety',
      'help',
      'terms',
      'logOut',
    ];
    for (const row of rows) {
      await fireEvent.press(screen.getByTestId(`profile-${row}`));
    }
    expect(handlers.onRow.mock.calls.map(([row]) => row)).toEqual(rows);

    await fireEvent.press(screen.getByRole('tab', { name: 'Bookings' }));
    expect(handlers.onTab).toHaveBeenCalledWith('bookings');
  });
});
