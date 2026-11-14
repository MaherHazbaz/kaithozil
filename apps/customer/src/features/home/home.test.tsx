import { act, fireEvent, renderHook, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { useAutoCarousel } from './hooks/useAutoCarousel';
import { HomeScreen, type HomeScreenProps } from './screens/HomeScreen';

const designData: HomeScreenProps = {
  customerName: 'Priya',
  customerInitials: 'PR',
  areaName: 'Anna Nagar',
  verifiedWorkerCount: 12,
  bookAgain: { initials: 'MK', name: 'Murugan K.', trade: 'Electrician', rating: '4.8' },
};

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.useRealTimers();
});

describe('useAutoCarousel', () => {
  it('advances every interval and wraps around', async () => {
    const { result } = await renderHook(() => useAutoCarousel(4, 3500));
    expect(result.current.index).toBe(0);
    await act(async () => {
      jest.advanceTimersByTime(3500);
    });
    expect(result.current.index).toBe(1);
    await act(async () => {
      jest.advanceTimersByTime(3500 * 3);
    });
    expect(result.current.index).toBe(0);
  });

  it('stops advancing while paused and starts a fresh countdown afterwards', async () => {
    const { result } = await renderHook(() => useAutoCarousel(4, 3500));
    await act(async () => {
      result.current.setPaused(true);
    });
    // A finger is holding the slides: nothing moves, however long it stays.
    await act(async () => {
      jest.advanceTimersByTime(3500 * 3);
    });
    expect(result.current.index).toBe(0);

    await act(async () => {
      result.current.setPaused(false);
    });
    await act(async () => {
      jest.advanceTimersByTime(3400);
    });
    expect(result.current.index).toBe(0);
    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current.index).toBe(1);
  });

  it('restarts the countdown when a slide is chosen by hand', async () => {
    const { result } = await renderHook(() => useAutoCarousel(4, 3500));
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    await act(async () => {
      result.current.select(2);
    });
    expect(result.current.index).toBe(2);
    // 3 s later the old timer would have fired at 3.5 s; the restarted one has not.
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.index).toBe(2);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current.index).toBe(3);
  });
});

describe('HomeScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<HomeScreen {...designData} />);
    for (const text of [
      'Kaithozhil',
      'Vanakkam, Priya',
      "You're in",
      'Anna Nagar',
      '12 verified workers',
      'Electrician',
      'Plumber',
      'AC repair',
      'Carpenter',
      'Tailor',
      'Painter',
      'Mechanic',
      'வாகன பழுது',
      'Verified workers only',
      'Pay the worker directly',
      'Know the price first',
      'Safe at your door',
      'Construction crew',
      'Book again',
      'Murugan K.',
      'Electrician · ★ 4.8',
      'Book',
      'Home',
      'Bookings',
      'Profile',
    ]) {
      expect(screen.getAllByText(text, { includeHiddenElements: true }).length).toBeGreaterThan(0);
    }
    expect(screen.getByPlaceholderText('What needs fixing today?')).toBeOnTheScreen();
  });

  it('marks Home as the active tab', async () => {
    await renderScreen(<HomeScreen {...designData} />);
    expect(screen.getByRole('tab', { name: 'Home' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Bookings' })).not.toBeSelected();
  });

  it('moves the carousel dot when tapped and when 3.5 s pass', async () => {
    await renderScreen(<HomeScreen {...designData} />);
    const dot = (n: number, name: string) =>
      screen.getByRole('button', { name: `Show slide ${n}: ${name}` });

    expect(dot(1, 'Verified workers')).toBeSelected();
    await fireEvent.press(dot(3, 'Price first'));
    expect(dot(3, 'Price first')).toBeSelected();
    expect(dot(1, 'Verified workers')).not.toBeSelected();

    await act(async () => {
      jest.advanceTimersByTime(3500);
    });
    expect(dot(4, 'Safe at your door')).toBeSelected();
  });

  it('reports taps on services, crew, book again, profile and tabs', async () => {
    const handlers = {
      onService: jest.fn(),
      onCrew: jest.fn(),
      onBookAgain: jest.fn(),
      onProfile: jest.fn(),
      onTab: jest.fn(),
    };
    await renderScreen(<HomeScreen {...designData} {...handlers} />);
    await fireEvent.press(screen.getByTestId('service-plumber'));
    await fireEvent.press(screen.getByTestId('home-crew'));
    await fireEvent.press(screen.getByTestId('home-book-again'));
    await fireEvent.press(screen.getByTestId('home-profile'));
    await fireEvent.press(screen.getByRole('tab', { name: 'Bookings' }));
    expect(handlers.onService).toHaveBeenCalledWith('plumber');
    expect(handlers.onCrew).toHaveBeenCalledTimes(1);
    expect(handlers.onBookAgain).toHaveBeenCalledTimes(1);
    expect(handlers.onProfile).toHaveBeenCalledTimes(1);
    expect(handlers.onTab).toHaveBeenCalledWith('bookings');
  });
});
