import { act, fireEvent, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { renderRouter } from 'expo-router/testing-library';

import TrialRoute from '@/app/help/[id]/trial';

describe('After the trial day route', () => {
  it('"Find another housekeeper" opens Finding a housekeeper with the trial\'s schedule', async () => {
    const { getPathnameWithParams } = await renderRouter(
      {
        'help/[id]/trial': TrialRoute,
        'job/searching': () => <Text>Searching screen</Text>,
      },
      { initialUrl: '/help/help-1/trial' },
    );
    await act(async () => {
      await fireEvent.press(await screen.findByRole('button', { name: 'Try someone else' }));
    });
    await fireEvent.press(screen.getByRole('button', { name: 'Find another housekeeper' }));

    expect(await screen.findByText('Searching screen')).toBeOnTheScreen();
    const url = new URL(getPathnameWithParams(), 'https://kaithozhil.test');
    expect(url.pathname).toBe('/job/searching');
    expect(url.searchParams.get('service')).toBe('housekeeping');
    expect(url.searchParams.get('summary')).toBe('Regular help · 6 days a week · 6 – 8 AM');
  });
});
