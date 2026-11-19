import { screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { renderRouter } from 'expo-router/testing-library';

import SearchingRoute from '@/app/job/searching';
import { housekeepingSummary } from '@/features/housekeeping/housekeepingDraft';
import { renderScreen } from '@/test/renderScreen';

import { isSearchingServiceKey, searchingTitle } from './copy';
import { mechanicSummary } from './mechanicDraft';
import { SearchingScreen } from './screens/SearchingScreen';

// Mechanic job and Housekeeping lead to Finding a worker (owner, 2026-11-19).

describe('Finding a worker headings', () => {
  it('has a heading for every trade, including mechanic and housekeeping', () => {
    expect(searchingTitle('electrician')).toBe('Finding an electrician');
    expect(searchingTitle('mechanic')).toBe('Finding a mechanic');
    expect(searchingTitle('housekeeping')).toBe('Finding a housekeeper');
  });

  it('accepts only known services from a route parameter', () => {
    expect(isSearchingServiceKey('mechanic')).toBe(true);
    expect(isSearchingServiceKey('housekeeping')).toBe(true);
    expect(isSearchingServiceKey('plumber')).toBe(true);
    expect(isSearchingServiceKey('toString')).toBe(false);
    expect(isSearchingServiceKey('painter')).toBe(false);
    expect(isSearchingServiceKey(undefined)).toBe(false);
  });

  it('shows the mechanic heading on the screen', async () => {
    await renderScreen(
      <SearchingScreen
        service="mechanic"
        jobSummary="Car · Battery · Now"
        area="Anna Nagar"
        worker={{ name: 'Murugan K.', firstName: 'Murugan', detail: '2.1 km away' }}
        onCancel={jest.fn()}
      />,
    );
    expect(screen.getByRole('header', { name: 'Finding a mechanic' })).toBeOnTheScreen();
    expect(screen.getByText('Car · Battery · Now')).toBeOnTheScreen();
  });
});

describe('job summaries built from the form', () => {
  it('mechanic: vehicle · problem · when', () => {
    expect(
      mechanicSummary({
        vehicle: 'bike',
        problem: 'wontStart',
        description: '',
        location: 'home',
        timing: 'now',
      }),
    ).toBe("Bike or scooter · Won't start · Now");
    expect(
      mechanicSummary({
        vehicle: 'autoVan',
        problem: 'brakes',
        description: '',
        location: 'roadside',
        timing: 'schedule',
      }),
    ).toBe('Auto or van · Brakes · Schedule');
  });

  const housekeeping = {
    tasks: ['sweeping'],
    size: 'twoBhk',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    slot: 'six',
    hours: 2,
    preferWoman: true,
    trialDay: true,
  } as const;

  it('regular help: type · days a week · time', () => {
    expect(housekeepingSummary({ ...housekeeping, type: 'regular' })).toBe(
      'Regular help · 6 days a week · 6 – 8 AM',
    );
    expect(housekeepingSummary({ ...housekeeping, type: 'regular', days: ['sun'] })).toBe(
      'Regular help · 1 day a week · 6 – 8 AM',
    );
  });

  it('one-time cleaning: type · home size · time', () => {
    expect(
      housekeepingSummary({ ...housekeeping, type: 'oneTime', size: 'threeBhk', slot: 'four' }),
    ).toBe('One-time cleaning · 3 BHK · 4 – 6 PM');
  });
});

describe('the Finding a worker route', () => {
  const routes = { 'job/searching': SearchingRoute, home: () => <Text>Home screen</Text> };

  it('shows the summary passed by the booking form', async () => {
    await renderRouter(routes, {
      initialUrl:
        '/job/searching?service=housekeeping&summary=Regular%20help%20%C2%B7%206%20days%20a%20week',
    });
    expect(await screen.findByRole('header', { name: 'Finding a housekeeper' })).toBeOnTheScreen();
    expect(screen.getByText('Regular help · 6 days a week')).toBeOnTheScreen();
  });

  it('falls back to the design sample without a summary', async () => {
    await renderRouter(routes, { initialUrl: '/job/searching?service=electrician' });
    expect(await screen.findByText('Fan not working · Now')).toBeOnTheScreen();
  });

  it('falls back to the design sample when the summary is too long to be ours', async () => {
    await renderRouter(routes, {
      initialUrl: `/job/searching?service=mechanic&summary=${'x'.repeat(121)}`,
    });
    expect(await screen.findByText('Fan not working · Now')).toBeOnTheScreen();
  });

  it('goes home for an unknown service', async () => {
    await renderRouter(routes, { initialUrl: '/job/searching?service=painter' });
    expect(await screen.findByText('Home screen')).toBeOnTheScreen();
  });
});
