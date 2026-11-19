import { act, fireEvent, screen } from '@testing-library/react-native';
import { AppState, BackHandler, Text, type AppStateStatus } from 'react-native';

import { renderScreen } from '@/test/renderScreen';

import { SystemGate } from './components/SystemGate';

const fine = { minimumVersion: '0.0.0', maintenance: false };

/** Renders the gate over a stand-in app and lets the first check finish. */
async function renderGate(props: Partial<Parameters<typeof SystemGate>[0]> = {}) {
  await renderScreen(
    <SystemGate
      currentVersion="0.1.0"
      checkOnline={() => Promise.resolve(true)}
      loadStatus={() => Promise.resolve(fine)}
      {...props}
    >
      <Text>The app</Text>
    </SystemGate>,
  );
  await act(async () => {});
}

const covered = () => screen.queryByTestId(/^system-/);

describe('SystemGate', () => {
  it('shows the app when everything is fine', async () => {
    await renderGate();
    expect(screen.getByText('The app')).toBeOnTheScreen();
    expect(covered()).toBeNull();
  });

  it('covers the app with No internet when offline, and clears on "Try again"', async () => {
    let online = false;
    await renderGate({ checkOnline: () => Promise.resolve(online) });
    expect(screen.getByRole('header', { name: 'No internet connection' })).toBeOnTheScreen();
    // The app stays mounted underneath (typed text is kept), hidden from screen readers.
    expect(screen.getByText('The app', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.queryByText('The app')).toBeNull();

    online = true;
    await act(async () => {
      await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    });
    expect(covered()).toBeNull();
    expect(screen.getByText('The app')).toBeOnTheScreen();
  });

  it('says "still offline" when "Try again" fails', async () => {
    await renderGate({ checkOnline: () => Promise.resolve(false) });
    await act(async () => {
      await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    });
    expect(
      screen.getByText(
        'Still offline. Try moving near a window, or switch between mobile data and Wi-Fi.',
      ),
    ).toBeOnTheScreen();
  });

  it('shows Under maintenance until the server is back', async () => {
    let status = { ...fine, maintenance: true };
    await renderGate({ loadStatus: () => Promise.resolve(status) });
    expect(screen.getByRole('header', { name: "We'll be back soon" })).toBeOnTheScreen();

    status = fine;
    await act(async () => {
      await fireEvent.press(screen.getByRole('button', { name: 'Check again' }));
    });
    expect(covered()).toBeNull();
  });

  it('shows Update required for a version below the minimum, without "Later"', async () => {
    await renderGate({ loadStatus: () => Promise.resolve({ ...fine, minimumVersion: '0.2.0' }) });
    expect(screen.getByRole('header', { name: 'Please update Kaithozhil' })).toBeOnTheScreen();
    expect(screen.queryByText('Later')).toBeNull();
  });

  it('puts No internet first: the server cannot be asked while offline', async () => {
    await renderGate({
      checkOnline: () => Promise.resolve(false),
      loadStatus: () => Promise.resolve({ minimumVersion: '9.0.0', maintenance: true }),
    });
    expect(screen.getByTestId('system-offline')).toBeOnTheScreen();
  });

  it('lets the app run when the status cannot be read', async () => {
    await renderGate({ loadStatus: () => Promise.reject(new Error('server error')) });
    expect(covered()).toBeNull();
  });

  it('stays uncovered while paused (the opening animation)', async () => {
    await renderGate({ paused: true, checkOnline: () => Promise.resolve(false) });
    expect(covered()).toBeNull();
    expect(screen.getByText('The app')).toBeOnTheScreen();
  });

  it('checks again when the customer returns to the app', async () => {
    let listener: ((state: AppStateStatus) => void) | undefined;
    jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, handler) => {
      listener = handler;
      return { remove: jest.fn() };
    });
    let online = true;
    await renderGate({ checkOnline: () => Promise.resolve(online) });
    expect(covered()).toBeNull();

    online = false;
    await act(async () => listener?.('active'));
    expect(screen.getByTestId('system-offline')).toBeOnTheScreen();
    jest.restoreAllMocks();
  });

  it('blocks Android Back only while covered', async () => {
    const spy = jest.spyOn(BackHandler, 'addEventListener');
    await renderGate();
    expect(spy).not.toHaveBeenCalled();

    await renderGate({ checkOnline: () => Promise.resolve(false) });
    expect(spy).toHaveBeenCalledWith('hardwareBackPress', expect.any(Function));
    spy.mockRestore();
  });
});
