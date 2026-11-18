import { act, fireEvent, renderHook, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { mechanicCopy } from './copy';
import { formatClipLength, useElapsedSeconds } from './hooks/useElapsedSeconds';
import { useJobMedia } from './hooks/useJobMedia';
import { missingMechanicDetail } from './mechanicDraft';
import { bookingDay, dateKey, dayLabels, slotAvailability, type FullSlot } from './scheduleSlots';
import { MechanicScreen } from './screens/MechanicScreen';
import { MediaScreen, type MediaScreenProps } from './screens/MediaScreen';
import { ScheduleScreen } from './screens/ScheduleScreen';

// Wednesday 18 Nov 2026, 9:30 in the morning (local time), as in the design's screenshot.
const NOW = new Date(2026, 10, 18, 9, 30);
const today = bookingDay(NOW, 0);
const tomorrow = bookingDay(NOW, 1);

describe('slotAvailability', () => {
  it('needs 2 hours of notice, measured to the minute', () => {
    // 10:00 is only 30 minutes away; 12:00 is 2.5 hours away.
    expect(slotAvailability(today, 8, NOW, [])).toBe('passed');
    expect(slotAvailability(today, 10, NOW, [])).toBe('passed');
    expect(slotAvailability(today, 12, NOW, [])).toBe('available');
    // Exactly 2 hours ahead is allowed.
    expect(slotAvailability(today, 12, new Date(2026, 10, 18, 10, 0), [])).toBe('available');
    expect(slotAvailability(today, 12, new Date(2026, 10, 18, 10, 1), [])).toBe('passed');
  });

  it('marks full windows on their own date only', () => {
    const full: FullSlot[] = [{ date: dateKey(tomorrow), start: 12 }];
    expect(slotAvailability(tomorrow, 12, NOW, full)).toBe('full');
    expect(slotAvailability(tomorrow, 14, NOW, full)).toBe('available');
    expect(slotAvailability(bookingDay(NOW, 2), 12, NOW, full)).toBe('available');
  });

  it('says passed rather than full when both apply', () => {
    expect(slotAvailability(today, 8, NOW, [{ date: dateKey(today), start: 8 }])).toBe('passed');
  });

  it('handles late evening: tomorrow 8 AM is still bookable at 11 PM', () => {
    const lateNight = new Date(2026, 10, 18, 23, 0);
    expect(slotAvailability(today, 18, lateNight, [])).toBe('passed');
    expect(slotAvailability(bookingDay(lateNight, 1), 8, lateNight, [])).toBe('available');
  });
});

describe('dayLabels', () => {
  it('names today, tomorrow and later days as the design does', () => {
    expect(dayLabels(today, 0)).toEqual({
      top: 'Today',
      num: '18',
      tamil: 'புத',
      long: 'Today 18 Nov',
    });
    expect(dayLabels(tomorrow, 1)).toEqual({
      top: 'Tmrw',
      num: '19',
      tamil: 'வியா',
      long: 'Tomorrow 19 Nov',
    });
    expect(dayLabels(bookingDay(NOW, 2), 2).long).toBe('Fri 20 Nov');
    // Across a month end.
    expect(dayLabels(bookingDay(new Date(2026, 10, 30), 1), 1).long).toBe('Tomorrow 1 Dec');
  });
});

describe('missingMechanicDetail', () => {
  const problems = mechanicCopy.problems;

  it('asks for the vehicle, then the problem, then a description for "Other"', () => {
    expect(
      missingMechanicDetail({ vehicle: null, problem: 'battery', description: '' }, problems),
    ).toBe('vehicle');
    expect(
      missingMechanicDetail({ vehicle: 'car', problem: null, description: '' }, problems),
    ).toBe('problem');
    expect(
      missingMechanicDetail({ vehicle: 'car', problem: 'other', description: '  ' }, problems),
    ).toBe('description');
    expect(
      missingMechanicDetail({ vehicle: 'car', problem: 'other', description: 'Horn' }, problems),
    ).toBeNull();
    expect(
      missingMechanicDetail({ vehicle: 'bike', problem: 'brakes', description: '' }, problems),
    ).toBeNull();
  });
});

describe('useElapsedSeconds', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('counts whole seconds and stops at the limit, calling onLimit once', async () => {
    const onLimit = jest.fn();
    const { result } = await renderHook(() => useElapsedSeconds(3, onLimit));
    expect(result.current).toBe(0);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(1);
    expect(onLimit).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    expect(result.current).toBe(3);
    expect(onLimit).toHaveBeenCalledTimes(1);
  });

  it('formats lengths as m:ss', () => {
    expect(formatClipLength(0)).toBe('0:00');
    expect(formatClipLength(18)).toBe('0:18');
    expect(formatClipLength(60)).toBe('1:00');
  });
});

describe('useJobMedia', () => {
  it('keeps at most 3 photos and removes by id', async () => {
    const { result } = await renderHook(() => useJobMedia([{ id: 'a' }, { id: 'b' }]));
    await act(async () => {
      result.current.addPhoto({ id: 'c' });
      result.current.addPhoto({ id: 'd' });
    });
    expect(result.current.photos.map((photo) => photo.id)).toEqual(['a', 'b', 'c']);
    await act(async () => result.current.removePhoto('b'));
    expect(result.current.photos.map((photo) => photo.id)).toEqual(['a', 'c']);
  });
});

describe('MediaScreen', () => {
  const designData: MediaScreenProps = {
    photos: [{ id: 'p1' }, { id: 'p2' }],
    voiceNote: { status: 'idle' },
    onBack: jest.fn(),
  };

  it('shows the exact design wording with two photos', async () => {
    await renderScreen(<MediaScreen {...designData} />);
    expect(screen.getByRole('header', { name: 'Photos and voice note' })).toBeOnTheScreen();
    for (const text of [
      'படங்கள் மற்றும் குரல் குறிப்பு',
      '2 of 3 photos',
      'Add',
      'Take photo',
      'From gallery',
      'Up to 3 photos. Show the problem clearly, in good light.',
      'Tap to record',
      "Say what's wrong in Tamil or English. The worker hears it before accepting.",
      'Done',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByRole('image', { name: 'Photo 2' })).toBeOnTheScreen();
  });

  it('removes and adds photos through its props', async () => {
    const onRemovePhoto = jest.fn();
    const onAddPhoto = jest.fn();
    await renderScreen(
      <MediaScreen {...designData} onRemovePhoto={onRemovePhoto} onAddPhoto={onAddPhoto} />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Remove photo 2' }));
    expect(onRemovePhoto).toHaveBeenCalledWith('p2');
    await fireEvent.press(screen.getByRole('button', { name: 'Take photo' }));
    expect(onAddPhoto).toHaveBeenCalledWith('camera');
    await fireEvent.press(screen.getByRole('button', { name: 'Add' }));
    expect(onAddPhoto).toHaveBeenLastCalledWith('gallery');
  });

  it('disables adding once there are 3 photos', async () => {
    await renderScreen(
      <MediaScreen {...designData} photos={[{ id: '1' }, { id: '2' }, { id: '3' }]} />,
    );
    expect(screen.getByText('3 of 3 photos')).toBeOnTheScreen();
    expect(screen.getByTestId('media-take-photo')).toBeDisabled();
    expect(screen.getByTestId('media-gallery')).toBeDisabled();
    expect(screen.queryByText('Add')).toBeNull();
  });

  it('shows a running timer while recording and stops itself at 60 seconds', async () => {
    jest.useFakeTimers();
    const onStopRecording = jest.fn();
    await renderScreen(
      <MediaScreen
        {...designData}
        voiceNote={{ status: 'recording' }}
        onStopRecording={onStopRecording}
      />,
    );
    expect(screen.getByText('Recording… up to 60 seconds')).toBeOnTheScreen();
    expect(screen.getByTestId('media-timer')).toHaveTextContent('0:00');
    await act(async () => {
      jest.advanceTimersByTime(12_000);
    });
    expect(screen.getByTestId('media-timer')).toHaveTextContent('0:12');
    expect(onStopRecording).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(60_000);
    });
    expect(screen.getByTestId('media-timer')).toHaveTextContent('1:00');
    expect(onStopRecording).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('offers play, record again and delete once recorded', async () => {
    const onStartRecording = jest.fn();
    const onDeleteVoiceNote = jest.fn();
    await renderScreen(
      <MediaScreen
        {...designData}
        voiceNote={{ status: 'recorded', durationSeconds: 18 }}
        onStartRecording={onStartRecording}
        onDeleteVoiceNote={onDeleteVoiceNote}
      />,
    );
    expect(screen.getByRole('button', { name: 'Play voice note' })).toBeOnTheScreen();
    expect(screen.getByText('0:18')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Record again' }));
    expect(onStartRecording).toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
    expect(onDeleteVoiceNote).toHaveBeenCalled();
  });
});

describe('ScheduleScreen', () => {
  const fullSlots: FullSlot[] = [{ date: dateKey(tomorrow), start: 12 }];

  it('shows the design state: tomorrow 10 AM chosen, 12 – 2 PM full', async () => {
    await renderScreen(
      <ScheduleScreen
        now={NOW}
        fullSlots={fullSlots}
        initial={{ dayOffset: 1, start: 10 }}
        onBack={jest.fn()}
      />,
    );
    expect(screen.getByRole('header', { name: 'Schedule a time' })).toBeOnTheScreen();
    for (const text of [
      'நேரத்தைத் தேர்வு செய்யுங்கள்',
      'Morning · காலை',
      'Afternoon · மதியம்',
      'Evening · மாலை',
      'Book at least 2 hours ahead. The worker may arrive any time within the window.',
      'Your time',
      'Confirm time',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByRole('button', { name: 'Choose Tomorrow 19 Nov' })).toBeSelected();
    expect(screen.getByRole('button', { name: '10 AM – 12 PM' })).toBeSelected();
    expect(screen.getByText('Selected')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: '12 – 2 PM, Full' })).toBeDisabled();
    expect(screen.getByTestId('schedule-summary')).toHaveTextContent(
      'Tomorrow 19 Nov · 10 AM – 12 PM',
    );
    expect(screen.queryByTestId('schedule-missing')).toBeNull();
  });

  it('starts the window over when the day changes, and greys out passed windows today', async () => {
    const onConfirm = jest.fn();
    await renderScreen(
      <ScheduleScreen
        now={NOW}
        fullSlots={fullSlots}
        initial={{ dayOffset: 1, start: 10 }}
        onBack={jest.fn()}
        onConfirm={onConfirm}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Choose Today 18 Nov' }));
    expect(screen.getByTestId('schedule-summary')).toHaveTextContent('No time chosen yet');
    expect(screen.getByTestId('schedule-missing')).toHaveTextContent('Choose an available time');
    expect(screen.getByTestId('schedule-confirm')).toBeDisabled();
    expect(screen.getByRole('button', { name: '8 – 10 AM, Passed' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '10 AM – 12 PM, Passed' })).toBeDisabled();

    await fireEvent.press(screen.getByRole('button', { name: '2 – 4 PM' }));
    await fireEvent.press(screen.getByTestId('schedule-confirm'));
    expect(onConfirm).toHaveBeenCalledWith({ date: '2026-11-18', start: 14 });
  });
});

describe('MechanicScreen', () => {
  const address = { label: 'Home', line: '12, 4th Street, Anna Nagar' };

  it('shows the exact design wording and says why it cannot continue yet', async () => {
    await renderScreen(<MechanicScreen address={address} onBack={jest.fn()} />);
    expect(screen.getByRole('header', { name: 'Mechanic' })).toBeOnTheScreen();
    for (const text of [
      'வாகன பழுது',
      'Bike or scooter',
      'இருசக்கர வாகனம்',
      'Auto or van',
      'ஆட்டோ / வேன்',
      'Other vehicle',
      "Won't start",
      'Puncture or tyre',
      'Engine noise',
      'Servicing',
      'Describe it (optional)',
      'Add photo',
      'Voice note',
      'At home or work',
      'Mechanic comes to you',
      'Nearby mechanics get a call',
      '12, 4th Street, Anna Nagar',
      'The mechanic checks the vehicle and agrees the price with you before starting.',
      'Find a mechanic',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByTestId('mechanic-submit')).toBeDisabled();
    expect(screen.getByTestId('mechanic-missing')).toHaveTextContent(
      'Choose your vehicle to continue',
    );
  });

  it('switches to Now and warns about traffic when broken down on the road', async () => {
    await renderScreen(
      <MechanicScreen address={address} initialDraft={{ timing: 'schedule' }} onBack={jest.fn()} />,
    );
    expect(screen.getByText('Schedule a mechanic')).toBeOnTheScreen();
    expect(screen.getByText('Choose a date and time')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('radio', { name: 'Broken down. On the road, urgent' }));
    expect(
      screen.getByText(
        "Stay somewhere safe, away from traffic. We'll share your live location with the mechanic.",
      ),
    ).toBeOnTheScreen();
    expect(screen.getByRole('radio', { name: 'Now. Nearby mechanics get a call' })).toBeChecked();
    expect(screen.getByText('Find a mechanic')).toBeOnTheScreen();
    expect(screen.queryByText('Choose a date and time')).toBeNull();
  });

  it('needs a vehicle, a problem, and a description for "Other", then sends the job', async () => {
    const onSubmit = jest.fn();
    await renderScreen(<MechanicScreen address={address} onBack={jest.fn()} onSubmit={onSubmit} />);
    await fireEvent.press(screen.getByRole('radio', { name: 'Car' }));
    expect(screen.getByRole('radio', { name: 'Car' })).toBeChecked();
    expect(screen.getByTestId('mechanic-missing')).toHaveTextContent(
      'Choose a problem to continue',
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Other' }));
    expect(screen.getByText('Describe it')).toBeOnTheScreen();
    expect(screen.getByTestId('mechanic-missing')).toHaveTextContent(
      'Describe the problem to continue',
    );

    await fireEvent.changeText(screen.getByTestId('mechanic-description'), 'Horn stuck on');
    expect(screen.queryByTestId('mechanic-missing')).toBeNull();
    await fireEvent.press(screen.getByTestId('mechanic-submit'));
    expect(onSubmit).toHaveBeenCalledWith({
      vehicle: 'car',
      problem: 'other',
      description: 'Horn stuck on',
      location: 'home',
      timing: 'now',
    });
  });
});
