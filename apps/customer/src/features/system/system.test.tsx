import { act, fireEvent, renderHook, screen } from '@testing-library/react-native';
import { BackHandler } from 'react-native';

import { renderScreen } from '@/test/renderScreen';

import { useRecheck } from './hooks/useRecheck';
import { EmptyStateScreen } from './screens/EmptyStateScreen';
import { ErrorStateScreen } from './screens/ErrorStateScreen';
import { MaintenanceScreen } from './screens/MaintenanceScreen';
import { NoInternetScreen } from './screens/NoInternetScreen';
import { UpdateAppScreen } from './screens/UpdateAppScreen';

const waves = () => screen.queryAllByTestId('ripple-wave', { includeHiddenElements: true });

describe('NoInternetScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<NoInternetScreen status="idle" />);
    expect(screen.getByRole('header', { name: 'No internet connection' })).toBeOnTheScreen();
    for (const text of [
      'இணைய இணைப்பு இல்லை',
      "Check your mobile data or Wi-Fi. Anything you were typing is saved and will send when you're back online.",
      'Urgent? Our helpline works without internet: [SUPPORT NUMBER].',
      'Try again',
      'Open phone settings',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.queryByText(/Still offline/)).toBeNull();
    expect(waves()).toHaveLength(0);
  });

  it('ripples and disables the button while checking', async () => {
    await renderScreen(<NoInternetScreen status="checking" />);
    expect(screen.getByRole('button', { name: 'Checking…' })).toBeDisabled();
    expect(waves()).toHaveLength(3);
  });

  it('explains what to try when still offline', async () => {
    await renderScreen(<NoInternetScreen status="still" />);
    expect(
      screen.getByText(
        'Still offline. Try moving near a window, or switch between mobile data and Wi-Fi.',
      ),
    ).toBeOnTheScreen();
  });

  it('reports both buttons', async () => {
    const onRetry = jest.fn();
    const onOpenSettings = jest.fn();
    await renderScreen(
      <NoInternetScreen status="idle" onRetry={onRetry} onOpenSettings={onOpenSettings} />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Open phone settings' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });
});

describe('ErrorStateScreen', () => {
  it('shows the exact design wording and the reference', async () => {
    await renderScreen(<ErrorStateScreen reference="KT-ERR-4821" />);
    expect(screen.getByRole('header', { name: 'Something went wrong' })).toBeOnTheScreen();
    for (const text of [
      'ஏதோ தவறு நடந்துவிட்டது',
      "It's not you, it's us. Your bookings and payments are safe. Please try again in a moment.",
      'Error reference, for support',
      'KT-ERR-4821',
      'Try again',
      'Go home',
      'Get help',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('hides Copy until copying is possible', async () => {
    await renderScreen(<ErrorStateScreen reference="KT-ERR-4821" />);
    expect(screen.queryByText('Copy')).toBeNull();
  });

  it('confirms only after the reference is copied', async () => {
    const onCopyReference = jest.fn(() => Promise.resolve());
    await renderScreen(
      <ErrorStateScreen reference="KT-ERR-4821" onCopyReference={onCopyReference} />,
    );
    await act(async () => {
      await fireEvent.press(screen.getByRole('button', { name: 'Copy the error reference' }));
    });
    expect(onCopyReference).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Copied ✓')).toBeOnTheScreen();
  });

  it('keeps "Copy" when copying fails', async () => {
    const onCopyReference = jest.fn(() => Promise.reject(new Error('no clipboard')));
    await renderScreen(
      <ErrorStateScreen reference="KT-ERR-4821" onCopyReference={onCopyReference} />,
    );
    await act(async () => {
      await fireEvent.press(screen.getByRole('button', { name: 'Copy the error reference' }));
    });
    expect(screen.getByText('Copy')).toBeOnTheScreen();
  });
});

describe('EmptyStateScreen', () => {
  it('shows the bookings wording', async () => {
    const onAction = jest.fn();
    await renderScreen(<EmptyStateScreen kind="bookings" onAction={onAction} />);
    expect(screen.getByRole('header', { name: 'Your bookings' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'No bookings yet' })).toBeOnTheScreen();
    for (const text of [
      'உங்கள் முன்பதிவுகள்',
      'இன்னும் முன்பதிவுகள் இல்லை',
      'When you book a worker, your booking shows up here with live updates.',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    await fireEvent.press(screen.getByRole('button', { name: 'Book a worker' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('shows the search wording', async () => {
    await renderScreen(<EmptyStateScreen kind="search" />);
    expect(screen.getByRole('header', { name: 'No electricians found nearby' })).toBeOnTheScreen();
    for (const text of [
      'தேடல்',
      'அருகில் யாரும் கிடைக்கவில்லை',
      "Try fewer filters or a wider area. Or post the job and we'll find someone for you.",
      'Post a job',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });
});

describe('UpdateAppScreen', () => {
  it('shows the required wording, without "Later"', async () => {
    await renderScreen(<UpdateAppScreen kind="required" />);
    expect(screen.getByRole('header', { name: 'Please update Kaithozhil' })).toBeOnTheScreen();
    for (const text of [
      'புதிய பதிப்பைப் புதுப்பிக்கவும்',
      'This version is too old to keep payments and verification safe. Updating takes about a minute.',
      "What's new · புதியவை",
      'Faster booking on slow networks',
      'Clearer payment confirmations',
      'Tamil voice help on more screens',
      'Version [VERSION] · about [APP SIZE]',
      'Update now',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.queryByText('Later')).toBeNull();
  });

  it('blocks the Android Back button only when required', async () => {
    const spy = jest.spyOn(BackHandler, 'addEventListener');
    await renderScreen(<UpdateAppScreen kind="required" />);
    expect(spy).toHaveBeenCalledWith('hardwareBackPress', expect.any(Function));
    spy.mockClear();
    await renderScreen(<UpdateAppScreen kind="optional" />);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('offers "Later" for an optional update', async () => {
    const onLater = jest.fn();
    await renderScreen(<UpdateAppScreen kind="optional" onLater={onLater} />);
    expect(screen.getByRole('header', { name: 'A new version is ready' })).toBeOnTheScreen();
    expect(
      screen.getByText("Update when you're ready. You can keep using the app."),
    ).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Later' }));
    expect(onLater).toHaveBeenCalledTimes(1);
  });
});

describe('MaintenanceScreen', () => {
  it('shows the exact design wording with the ripple', async () => {
    await renderScreen(<MaintenanceScreen status="idle" />);
    expect(screen.getByRole('header', { name: "We'll be back soon" })).toBeOnTheScreen();
    for (const text of [
      'விரைவில் திரும்புவோம்',
      'Kaithozhil is being upgraded to serve you better. We expect to be back by [TIME].',
      'Your bookings, earnings and payments are safe.',
      'Scheduled jobs stay as booked. Workers can still go to them.',
      'Urgent help: [SUPPORT NUMBER]',
      'Check again',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(waves()).toHaveLength(3);
  });

  it('says it is still upgrading after a failed check', async () => {
    await renderScreen(<MaintenanceScreen status="still" />);
    expect(
      screen.getByText("Still upgrading. We'll send a notification when we're back."),
    ).toBeOnTheScreen();
  });
});

describe('useRecheck', () => {
  it('goes checking → still when the problem continues', async () => {
    let finish: (ok: boolean) => void = () => {};
    const check = () => new Promise<boolean>((resolve) => (finish = resolve));
    const onRecovered = jest.fn();
    const { result } = await renderHook(() => useRecheck(check, onRecovered));
    expect(result.current.status).toBe('idle');

    let pending: Promise<void> = Promise.resolve();
    await act(async () => {
      pending = result.current.recheck();
    });
    expect(result.current.status).toBe('checking');

    await act(async () => {
      finish(false);
      await pending;
    });
    expect(result.current.status).toBe('still');
    expect(onRecovered).not.toHaveBeenCalled();
  });

  it('calls onRecovered when the problem is over', async () => {
    const onRecovered = jest.fn();
    const { result } = await renderHook(() => useRecheck(() => Promise.resolve(true), onRecovered));
    await act(async () => {
      await result.current.recheck();
    });
    expect(onRecovered).toHaveBeenCalledTimes(1);
  });

  it('treats a failed check as still down', async () => {
    const { result } = await renderHook(() =>
      useRecheck(() => Promise.reject(new Error('offline')), jest.fn()),
    );
    await act(async () => {
      await result.current.recheck();
    });
    expect(result.current.status).toBe('still');
  });
});
