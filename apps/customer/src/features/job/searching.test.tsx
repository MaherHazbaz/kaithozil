import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { SearchingScreen, type SearchingScreenProps } from './screens/SearchingScreen';

// The data drawn in design/source/Searching.dc.html.
const designData: SearchingScreenProps = {
  service: 'electrician',
  jobSummary: 'Fan not working · Now',
  area: 'Anna Nagar',
  worker: { name: 'Murugan K.', firstName: 'Murugan', detail: '2.1 km away · ★ 4.8 · Level 2' },
  onCancel: jest.fn(),
};

describe('SearchingScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<SearchingScreen {...designData} />);
    expect(screen.getByRole('header', { name: 'Finding an electrician' })).toBeOnTheScreen();
    for (const text of [
      'அருகில் உள்ள பணியாளரைத் தேடுகிறோம்',
      "We're calling verified workers near Anna Nagar, one at a time.",
      'Job posted',
      'Fan not working · Now',
      'Calling Murugan K.',
      '2.1 km away · ★ 4.8 · Level 2',
      'Next nearest worker',
      "Only if Murugan can't take it",
      'Cancel request',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('draws three ripple waves around the search icon', async () => {
    await renderScreen(<SearchingScreen {...designData} />);
    // The rings are decoration, hidden from screen readers, so the query must opt in.
    expect(screen.getAllByTestId('ripple-wave', { includeHiddenElements: true })).toHaveLength(3);
  });

  it('cancels the request', async () => {
    const onCancel = jest.fn();
    await renderScreen(<SearchingScreen {...designData} onCancel={onCancel} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Cancel request' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not offer the calling row as a button when it leads nowhere', async () => {
    await renderScreen(<SearchingScreen {...designData} />);
    expect(screen.queryByRole('button', { name: /Calling Murugan K\./ })).toBeNull();
  });

  it('opens the worker from the calling row', async () => {
    const onOpenWorker = jest.fn();
    await renderScreen(<SearchingScreen {...designData} onOpenWorker={onOpenWorker} />);
    await fireEvent.press(screen.getByRole('button', { name: /Calling Murugan K\./ }));
    expect(onOpenWorker).toHaveBeenCalledTimes(1);
  });
});
