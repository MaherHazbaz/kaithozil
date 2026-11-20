import { fireEvent, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { renderRouter } from 'expo-router/testing-library';

import BookingsRoute from '@/app/bookings';

// The real Bookings route with stand-in screens behind it.
const routes = {
  bookings: BookingsRoute,
  'job/[id]/receipt': () => <Text>Receipt screen</Text>,
  support: () => <Text>Support screen</Text>,
};

async function openPastTab() {
  const result = await renderRouter(routes, { initialUrl: '/bookings' });
  await fireEvent.press(await screen.findByRole('button', { name: 'Past (2)' }));
  return result;
}

describe('Bookings route', () => {
  it('opens the receipt of the booking whose "View receipt" was tapped', async () => {
    const { getPathname } = await openPastTab();
    await fireEvent.press(
      screen.getByRole('button', { name: 'View receipt: Fan repair · Murugan K.' }),
    );
    expect(getPathname()).toBe('/job/KT-20481/receipt');
  });

  it('opens Help and support from "Get help"', async () => {
    const { getPathname } = await openPastTab();
    await fireEvent.press(screen.getByRole('button', { name: 'Get help: Tap leak · Ravi S.' }));
    expect(getPathname()).toBe('/support');
  });
});
