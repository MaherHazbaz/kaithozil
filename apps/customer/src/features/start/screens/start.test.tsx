import { act, fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { SPLASH_NAVIGATE_MS } from '../splashTimeline';
import { SplashScreen } from './SplashScreen';
import { WelcomeScreen } from './WelcomeScreen';

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  async function renderSplash(props: Partial<Parameters<typeof SplashScreen>[0]> = {}) {
    const onDone = jest.fn();
    await renderScreen(<SplashScreen onDone={onDone} {...props} />);
    // The screen measures itself before it starts the animation.
    await fireEvent(screen.getByTestId('splash-root'), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 844 } },
    });
    return onDone;
  }

  it('goes to Welcome by itself after 6.4 s, and only once', async () => {
    const onDone = await renderSplash();
    await act(async () => {
      jest.advanceTimersByTime(SPLASH_NAVIGATE_MS - 1);
    });
    expect(onDone).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('skips immediately when tapped, and does not navigate again later', async () => {
    const onDone = await renderSplash();
    await fireEvent.press(screen.getByRole('button', { name: 'Continue to Kaithozhil' }));
    expect(onDone).toHaveBeenCalledTimes(1);
    await act(async () => {
      jest.advanceTimersByTime(SPLASH_NAVIGATE_MS * 2);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('stays put when frozen on a frame (development comparison mode)', async () => {
    const onDone = await renderSplash({ frozenAtSeconds: 3.5 });
    await act(async () => {
      jest.advanceTimersByTime(SPLASH_NAVIGATE_MS * 2);
    });
    expect(onDone).not.toHaveBeenCalled();
  });

  it('shows the Tamil name', async () => {
    await renderSplash();
    expect(screen.getByText('கைத்தொழில்')).toBeOnTheScreen();
  });
});

describe('WelcomeScreen', () => {
  it('shows the exact design wording in English and Tamil', async () => {
    await renderScreen(<WelcomeScreen onNeedWorker={jest.fn()} onAmWorker={jest.fn()} />);
    for (const text of [
      'Kaithozhil',
      'Trusted hands for every job',
      'Language',
      'I need a worker',
      'Repairs, home services and construction crews',
      "I'm a worker",
      'Get jobs nearby and build your income record',
      'Terms',
      'Privacy Policy',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByText('கைத்தொழில்')).toBeOnTheScreen();
  });

  it('starts on English and switches the selected language chip', async () => {
    await renderScreen(<WelcomeScreen onNeedWorker={jest.fn()} onAmWorker={jest.fn()} />);
    const english = screen.getByTestId('language-0');
    const tamil = screen.getByTestId('language-1');
    expect(english).toBeSelected();
    expect(tamil).not.toBeSelected();
    await fireEvent.press(tamil);
    expect(screen.getByTestId('language-1')).toBeSelected();
    expect(screen.getByTestId('language-0')).not.toBeSelected();
  });

  it('reports which role was chosen', async () => {
    const onNeedWorker = jest.fn();
    const onAmWorker = jest.fn();
    await renderScreen(<WelcomeScreen onNeedWorker={onNeedWorker} onAmWorker={onAmWorker} />);
    await fireEvent.press(screen.getByTestId('role-need-worker'));
    await fireEvent.press(screen.getByTestId('role-am-worker'));
    expect(onNeedWorker).toHaveBeenCalledTimes(1);
    expect(onAmWorker).toHaveBeenCalledTimes(1);
  });
});
