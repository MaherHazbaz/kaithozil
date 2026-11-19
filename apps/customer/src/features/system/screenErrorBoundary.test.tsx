import { fireEvent, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { renderRouter } from 'expo-router/testing-library';

import RootLayout from '@/app/_layout';

import { makeErrorReference } from './errorReference';

// The real layout checks the connection; answer "online" without a network call.
jest.mock('@kaithozhil/core', () => ({
  ...jest.requireActual('@kaithozhil/core'),
  isOnline: () => Promise.resolve(true),
}));

describe('makeErrorReference', () => {
  it('has the design form "KT-ERR-" and four digits', () => {
    expect(makeErrorReference(() => 0.4821)).toBe('KT-ERR-4821');
    expect(makeErrorReference(() => 0)).toBe('KT-ERR-0000');
    expect(makeErrorReference(() => 0.99999)).toBe('KT-ERR-9999');
    expect(makeErrorReference()).toMatch(/^KT-ERR-\d{4}$/);
  });
});

describe('a screen that crashes', () => {
  // React prints caught render errors; keep the test output readable.
  beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  let shouldCrash = true;
  function Crashing() {
    if (shouldCrash) throw new Error('render failed');
    return <Text>Recovered</Text>;
  }

  async function renderCrash() {
    shouldCrash = true;
    // The real root layout, with stand-in screens: "/broken" throws while rendering.
    return renderRouter(
      {
        _layout: RootLayout,
        // Stand-ins for the screens the layout configures by name.
        index: () => <Text>Opening</Text>,
        welcome: () => <Text>Welcome</Text>,
        login: () => <Text>Log in</Text>,
        bookings: () => <Text>Bookings</Text>,
        profile: () => <Text>Profile</Text>,
        home: () => <Text>Home screen</Text>,
        support: () => <Text>Support screen</Text>,
        broken: Crashing,
      },
      { initialUrl: '/broken' },
    );
  }

  it('shows Something went wrong with a reference instead of closing the app', async () => {
    await renderCrash();
    expect(await screen.findByRole('header', { name: 'Something went wrong' })).toBeOnTheScreen();
    expect(screen.getByText(/^KT-ERR-\d{4}$/)).toBeOnTheScreen();
  });

  it('renders the screen again on "Try again"', async () => {
    await renderCrash();
    await screen.findByRole('header', { name: 'Something went wrong' });
    shouldCrash = false;
    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('Recovered')).toBeOnTheScreen();
  });

  it('goes home or to support', async () => {
    const { getPathname } = await renderCrash();
    await screen.findByRole('header', { name: 'Something went wrong' });
    await fireEvent.press(screen.getByRole('button', { name: 'Get help' }));
    expect(getPathname()).toBe('/support');

    await renderCrash();
    await screen.findByRole('header', { name: 'Something went wrong' });
    await fireEvent.press(screen.getByRole('button', { name: 'Go home' }));
    expect(getPathname()).toBe('/home');
  });
});
