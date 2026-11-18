import { act, fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { PermissionsScreen } from './screens/PermissionsScreen';

describe('PermissionsScreen', () => {
  it('explains location first, with the exact design wording', async () => {
    await renderScreen(<PermissionsScreen onDone={jest.fn()} />);
    expect(screen.getByText('Step 1 of 3')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Allow location' })).toBeOnTheScreen();
    for (const text of [
      'இருப்பிட அனுமதி',
      'So we can find verified workers near you and show when they will arrive.',
      'Used only while you book or track a job',
      'Workers see your full address only after they accept',
      'Allow',
      'Not now',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('draws three waves around the icon', async () => {
    await renderScreen(<PermissionsScreen onDone={jest.fn()} />);
    // Decoration, hidden from screen readers, so the query must opt in.
    expect(screen.getAllByTestId('ripple-wave', { includeHiddenElements: true })).toHaveLength(3);
  });

  it('asks one at a time, records each answer, then finishes', async () => {
    const onAnswer = jest.fn();
    const onDone = jest.fn();
    await renderScreen(<PermissionsScreen onAnswer={onAnswer} onDone={onDone} />);

    await act(async () => {
      await fireEvent.press(screen.getByRole('button', { name: 'Allow' }));
    });
    expect(screen.getByText('Step 2 of 3')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Allow notifications' })).toBeOnTheScreen();
    expect(screen.getByText('Only job and payment updates, no promotions')).toBeOnTheScreen();

    await act(async () => {
      await fireEvent.press(screen.getByRole('button', { name: 'Not now' }));
    });
    expect(screen.getByRole('header', { name: 'Allow camera' })).toBeOnTheScreen();
    expect(screen.getByText('Photos go only to the worker on your job')).toBeOnTheScreen();
    expect(onDone).not.toHaveBeenCalled();

    await act(async () => {
      await fireEvent.press(screen.getByRole('button', { name: 'Allow' }));
    });
    expect(onAnswer.mock.calls).toEqual([
      ['location', true],
      ['notifications', false],
      ['camera', true],
    ]);
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
