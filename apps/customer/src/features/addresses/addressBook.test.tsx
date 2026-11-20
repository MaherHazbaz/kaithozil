import { act, fireEvent, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { router, Slot } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';

import AddressesRoute from '@/app/addresses';
import AddressEditRoute from '@/app/addresses/edit';
import DescribeJobRoute from '@/app/job/new';
import { AppProviders } from '@/components/AppProviders';

import {
  bookingAddress,
  defaultAddress,
  draftFromAddress,
  removeAddress,
  saveAddress,
  setDefaultAddress,
  type AddressBook,
} from './addressBook';
import { SAMPLE_ADDRESSES, SAMPLE_PINNED_PLACE } from './sampleData';

const book: AddressBook = { addresses: SAMPLE_ADDRESSES, defaultId: 'home' };
const draft = { house: '', landmark: '', label: 'home', isDefault: false } as const;

describe('address book', () => {
  it('adds an address under the pinned place', () => {
    const result = saveAddress(
      book,
      { ...draft, house: ' 12, 2nd floor ', landmark: 'Lift on the left', label: 'office' },
      SAMPLE_PINNED_PLACE,
      { newId: 'address-1' },
    );
    expect(result.id).toBe('address-1');
    expect(result.book.addresses.at(-1)).toEqual({
      id: 'address-1',
      label: 'Office',
      house: '12, 2nd floor',
      line: '12, 2nd floor, 4th Street, Anna Nagar, Chennai 600040',
      near: 'Lift on the left',
    });
    expect(result.book.defaultId).toBe('home');
  });

  it('edits a house number that contains a comma without losing the street', () => {
    const added = saveAddress(book, { ...draft, house: '12, 2nd floor' }, SAMPLE_PINNED_PLACE, {
      newId: 'a',
    });
    const edited = saveAddress(
      added.book,
      { ...draft, house: '14, 3rd floor' },
      SAMPLE_PINNED_PLACE,
      {
        id: 'a',
        newId: 'unused',
      },
    );
    expect(edited.book.addresses.find((a) => a.id === 'a')?.line).toBe(
      '14, 3rd floor, 4th Street, Anna Nagar, Chennai 600040',
    );
    expect(draftFromAddress(edited.book, 'a')?.house).toBe('14, 3rd floor');
  });

  it('keeps a custom name when "Other" stays selected', () => {
    const edited = saveAddress(
      book,
      { ...draft, house: '7', label: 'other' },
      SAMPLE_PINNED_PLACE,
      {
        id: 'amma',
        newId: 'unused',
      },
    );
    expect(edited.book.addresses.find((a) => a.id === 'amma')?.label).toBe("Amma's house");
  });

  it('follows the default switch', () => {
    const madeDefault = saveAddress(
      book,
      { ...draft, house: '7', label: 'other', isDefault: true },
      SAMPLE_PINNED_PLACE,
      { id: 'amma', newId: 'unused' },
    );
    expect(madeDefault.book.defaultId).toBe('amma');

    // Turning it off on the default hands the default to another address.
    const turnedOff = saveAddress(book, { ...draft, house: '12' }, SAMPLE_PINNED_PLACE, {
      id: 'home',
      newId: 'unused',
    });
    expect(turnedOff.book.defaultId).toBe('office');

    // The first address ever saved is the default.
    const first = saveAddress(
      { addresses: [], defaultId: undefined },
      { ...draft, house: '1' },
      SAMPLE_PINNED_PLACE,
      { newId: 'only' },
    );
    expect(first.book.defaultId).toBe('only');
  });

  it('moves the default when the default is removed, and ignores unknown ids', () => {
    expect(removeAddress(book, 'home')).toEqual({
      addresses: SAMPLE_ADDRESSES.slice(1),
      defaultId: 'office',
    });
    expect(removeAddress(book, 'amma').defaultId).toBe('home');
    expect(
      removeAddress({ addresses: SAMPLE_ADDRESSES.slice(0, 1), defaultId: 'home' }, 'home')
        .defaultId,
    ).toBeUndefined();
    expect(setDefaultAddress(book, 'nope')).toBe(book);
    expect(setDefaultAddress(book, 'amma').defaultId).toBe('amma');
  });

  it('shows the booking forms the line without city and PIN, as in the design', () => {
    const home = defaultAddress(book);
    expect(home && bookingAddress(home)).toEqual({
      label: 'Home',
      line: '12, 4th Street, Anna Nagar',
    });
  });
});

describe('address changes reach the booking form', () => {
  // The real routes inside the app's providers, as the root layout has them.
  function Layout() {
    return (
      <AppProviders>
        <Slot />
      </AppProviders>
    );
  }
  const routes = {
    _layout: Layout,
    addresses: AddressesRoute,
    'addresses/edit': AddressEditRoute,
    'job/new': DescribeJobRoute,
    home: () => <Text>Home screen</Text>,
  };

  it('a new default address shows on Describe the job', async () => {
    await renderRouter(routes, { initialUrl: '/addresses' });
    await fireEvent.press(await screen.findByRole('button', { name: 'Set Office as default' }));

    await act(() => router.push('/job/new?service=electrician'));
    expect(await screen.findByText('Office')).toBeOnTheScreen();
    expect(screen.getByText('Plot 18, 2nd Avenue, Ambattur Industrial Estate')).toBeOnTheScreen();
  });

  it('a saved edit shows on Saved addresses', async () => {
    await renderRouter(routes, { initialUrl: '/addresses' });
    await fireEvent.press(await screen.findByRole('button', { name: 'Edit Home' }));
    await fireEvent.changeText(await screen.findByTestId('address-edit-house'), '14');
    await fireEvent.press(screen.getByTestId('address-edit-save'));

    expect(await screen.findByText('14, 4th Street, Anna Nagar, Chennai 600040')).toBeOnTheScreen();
  });

  it('with every address removed, the form shows no address and "Change" leads to Saved addresses', async () => {
    await renderRouter(routes, { initialUrl: '/addresses' });
    for (const label of ['Home', 'Office', "Amma's house"]) {
      await fireEvent.press(await screen.findByRole('button', { name: `Remove ${label}` }));
    }
    await act(() => router.push('/job/new?service=electrician'));
    const change = await screen.findByTestId('job-change-address');
    expect(screen.queryByText('Home')).toBeNull();
    await fireEvent.press(change);
    expect(await screen.findByRole('header', { name: 'Saved addresses' })).toBeOnTheScreen();
  });
});
