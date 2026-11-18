import { act, fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { CancelBookingScreen, type CancelBookingScreenProps } from './screens/CancelBookingScreen';

const job: CancelBookingScreenProps['job'] = {
  service: 'Fan repair',
  worker: { name: 'Murugan K.', firstName: 'Murugan', initials: 'MK' },
  status: 'On the way · arrives in about 9 min',
};

const render = (overrides: Partial<CancelBookingScreenProps> = {}) =>
  renderScreen(
    <CancelBookingScreen
      job={job}
      onBack={jest.fn()}
      onKeep={jest.fn()}
      onConfirm={jest.fn(() => Promise.resolve())}
      onCancelled={jest.fn()}
      {...overrides}
    />,
  );

describe('CancelBookingScreen', () => {
  it('shows the exact design wording', async () => {
    await render();
    expect(screen.getByRole('header', { name: 'Cancel booking' })).toBeOnTheScreen();
    for (const text of [
      'முன்பதிவை ரத்து செய்',
      'MK',
      'Fan repair · Murugan K.',
      'On the way · arrives in about 9 min',
      'Murugan is already on the way. Cancelling now may mean [CANCELLATION RULE]. Cancelling before a worker accepts is always free.',
      'Change the time instead?',
      'Pick a new slot without cancelling',
      'Why are you cancelling? · ரத்து செய்யும் காரணம்',
      'Found someone else',
      'Worker is running late',
      'Booked the wrong time',
      'The problem is fixed',
      'Price estimate is too high',
      'Other',
      'Choose a reason to continue',
      'Keep my booking',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByTestId('cancel-confirm')).toBeDisabled();
    expect(screen.queryByText('Tell us more')).toBeNull();
  });

  it('opens Schedule and goes back to Tracking', async () => {
    const onReschedule = jest.fn();
    const onKeep = jest.fn();
    await render({ onReschedule, onKeep });
    await fireEvent.press(screen.getByTestId('cancel-reschedule'));
    await fireEvent.press(screen.getByRole('button', { name: 'Keep my booking' }));
    expect(onReschedule).toHaveBeenCalledTimes(1);
    expect(onKeep).toHaveBeenCalledTimes(1);
  });

  it('cancels with the chosen reason', async () => {
    const onConfirm = jest.fn(() => Promise.resolve());
    const onCancelled = jest.fn();
    await render({ onConfirm, onCancelled });
    await fireEvent.press(screen.getByRole('radio', { name: 'Booked the wrong time' }));
    expect(screen.getByRole('radio', { name: 'Booked the wrong time' })).toBeChecked();
    expect(screen.queryByText('Choose a reason to continue')).toBeNull();
    await act(async () => {
      await fireEvent.press(screen.getByTestId('cancel-confirm'));
    });
    expect(onConfirm).toHaveBeenCalledWith({ reason: 'wrongTime', note: null });
    expect(onCancelled).toHaveBeenCalledTimes(1);
  });

  it('needs a typed reason for Other', async () => {
    const onConfirm = jest.fn(() => Promise.resolve());
    await render({ onConfirm });
    await fireEvent.press(screen.getByRole('radio', { name: 'Other' }));
    expect(screen.getByText('Tell us the reason to continue')).toBeOnTheScreen();
    expect(screen.getByTestId('cancel-confirm')).toBeDisabled();

    await fireEvent.changeText(screen.getByTestId('cancel-note'), '  Going out of town ');
    expect(screen.getByTestId('cancel-confirm')).toBeEnabled();
    await act(async () => {
      await fireEvent.press(screen.getByTestId('cancel-confirm'));
    });
    expect(onConfirm).toHaveBeenCalledWith({ reason: 'other', note: 'Going out of town' });
  });

  it('stays on the screen when the cancel is refused', async () => {
    const onCancelled = jest.fn();
    await render({
      onConfirm: jest.fn(() => Promise.reject(new Error('already started'))),
      onCancelled,
    });
    await fireEvent.press(screen.getByRole('radio', { name: 'The problem is fixed' }));
    await act(async () => {
      await fireEvent.press(screen.getByTestId('cancel-confirm'));
    });
    expect(onCancelled).not.toHaveBeenCalled();
    expect(screen.getByRole('header', { name: 'Cancel booking' })).toBeOnTheScreen();
    // The button is usable again for another try.
    expect(screen.getByTestId('cancel-confirm')).toBeEnabled();
  });
});
