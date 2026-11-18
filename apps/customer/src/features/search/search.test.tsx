import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { matchWorkers, resultCount } from './matchWorkers';
import { SAMPLE_WORKERS } from './sampleWorkers';
import { SearchScreen, type SearchScreenProps } from './screens/SearchScreen';
import type { WorkerResult } from './types';

const ids = (workers: readonly WorkerResult[]) => workers.map((worker) => worker.id);
const ALL = ['murugan-k', 'senthil-r', 'arun-p'];

describe('matchWorkers', () => {
  it('keeps every sample worker for the design state ("switchboard repair", Near me)', () => {
    expect(
      ids(matchWorkers(SAMPLE_WORKERS, { query: 'switchboard repair', filters: ['nearMe'] })),
    ).toEqual(ALL);
  });

  it('keeps everyone for an empty or very short query', () => {
    expect(ids(matchWorkers(SAMPLE_WORKERS, { query: '', filters: [] }))).toEqual(ALL);
    expect(ids(matchWorkers(SAMPLE_WORKERS, { query: '  a ', filters: [] }))).toEqual(ALL);
  });

  it('matches names, trades and work samples by word prefix, ignoring case', () => {
    expect(ids(matchWorkers(SAMPLE_WORKERS, { query: 'senth', filters: [] }))).toEqual([
      'senthil-r',
    ]);
    expect(ids(matchWorkers(SAMPLE_WORKERS, { query: 'ELECTRICIANS', filters: [] }))).toEqual(ALL);
    expect(ids(matchWorkers(SAMPLE_WORKERS, { query: 'regulator', filters: [] }))).toEqual([
      'murugan-k',
    ]);
  });

  it('finds no one for another trade', () => {
    expect(matchWorkers(SAMPLE_WORKERS, { query: 'plumber', filters: [] })).toEqual([]);
  });

  it('applies every chosen filter', () => {
    expect(ids(matchWorkers(SAMPLE_WORKERS, { query: '', filters: ['rating45'] }))).toEqual(ALL);
    expect(ids(matchWorkers(SAMPLE_WORKERS, { query: '', filters: ['level2Up'] }))).toEqual([
      'murugan-k',
      'senthil-r',
    ]);
    const far = { ...SAMPLE_WORKERS[1]!, id: 'far', distanceKm: 8, freeThisWeek: false };
    expect(ids(matchWorkers([...SAMPLE_WORKERS, far], { query: '', filters: ['nearMe'] }))).toEqual(
      ALL,
    );
    expect(ids(matchWorkers([far], { query: '', filters: ['freeThisWeek', 'level2Up'] }))).toEqual(
      [],
    );
  });

  it('keeps the order it was given (the server ranking)', () => {
    const reversed = [...SAMPLE_WORKERS].reverse();
    expect(ids(matchWorkers(reversed, { query: 'murugan senthil', filters: [] }))).toEqual([
      'senthil-r',
      'murugan-k',
    ]);
  });
});

describe('resultCount', () => {
  it("uses the server's total until the page is narrowed", () => {
    expect(resultCount({ total: 12, listed: 3, matched: 3 })).toBe(12);
    expect(resultCount({ total: 12, listed: 3, matched: 2 })).toBe(2);
  });
});

const designData: SearchScreenProps = {
  workers: SAMPLE_WORKERS,
  totalCount: 12,
  areaName: 'Anna Nagar',
  initialQuery: 'switchboard repair',
  initialFilters: ['nearMe'],
  onBack: jest.fn(),
};

describe('SearchScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<SearchScreen {...designData} />);
    expect(screen.getByLabelText('Search')).toHaveDisplayValue('switchboard repair');
    for (const text of [
      'Near me',
      'Rating 4.5+',
      'Level 2 and up',
      'Free this week',
      '12 electricians near Anna Nagar',
      'Best match',
      'MK',
      'Murugan K.',
      'Electrician · Level 2',
      'Senthil R.',
      'Electrician · Level 3',
      'Arun P.',
      'New',
      'Electrician · New on Kaithozhil',
      'Fan and regulator',
      'Switchboard',
      'LED lighting',
      'Panel upgrade',
      'Inverter',
      'Full wiring',
      'Fan install',
      'Light fitting',
      'New workers take smaller jobs while they build their record.',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByText('★ 4.8')).toBeOnTheScreen();
    expect(screen.getByText(/· 280 jobs · 2\.1 km/)).toBeOnTheScreen();
    expect(screen.getByText('★ 5.0')).toBeOnTheScreen();
    expect(screen.getByText(/Need someone right now\?/)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Near me' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Rating 4.5+' })).not.toBeSelected();
  });

  it('opens a worker, the job form and goes back', async () => {
    const handlers = { onBack: jest.fn(), onOpenWorker: jest.fn(), onPostJob: jest.fn() };
    await renderScreen(<SearchScreen {...designData} {...handlers} />);
    await fireEvent.press(screen.getByTestId('search-worker-senthil-r'));
    expect(handlers.onOpenWorker).toHaveBeenCalledWith('senthil-r');
    await fireEvent.press(screen.getByRole('link', { name: 'Post an urgent job' }));
    expect(handlers.onPostJob).toHaveBeenCalledTimes(1);
    await fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    expect(handlers.onBack).toHaveBeenCalledTimes(1);
  });

  it('narrows the list with a filter and shows the narrowed count', async () => {
    await renderScreen(<SearchScreen {...designData} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Level 2 and up' }));
    expect(screen.getByRole('button', { name: 'Level 2 and up' })).toBeSelected();
    expect(screen.queryByText('Arun P.')).not.toBeOnTheScreen();
    expect(screen.getByText('2 electricians near Anna Nagar')).toBeOnTheScreen();
  });

  it('shows the empty-search wording when nothing matches', async () => {
    const onPostJob = jest.fn();
    await renderScreen(<SearchScreen {...designData} onPostJob={onPostJob} />);
    await fireEvent.changeText(screen.getByLabelText('Search'), 'plumber');
    expect(screen.getByRole('header', { name: 'No electricians found nearby' })).toBeOnTheScreen();
    expect(screen.getByText('அருகில் யாரும் கிடைக்கவில்லை')).toBeOnTheScreen();
    expect(
      screen.getByText(
        "Try fewer filters or a wider area. Or post the job and we'll find someone for you.",
      ),
    ).toBeOnTheScreen();
    expect(screen.queryByText('Best match')).not.toBeOnTheScreen();
    // The search field and filters stay, so the user can follow that advice.
    expect(screen.getByRole('button', { name: 'Near me' })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Post a job' }));
    expect(onPostJob).toHaveBeenCalledTimes(1);
  });
});
