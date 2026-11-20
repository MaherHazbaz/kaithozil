import { createContext, use, useMemo, useRef, useState, type ReactNode } from 'react';

import {
  bookingAddress,
  defaultAddress,
  removeAddress,
  saveAddress,
  setDefaultAddress,
  type AddressBook,
} from '../addressBook';
import { SAMPLE_ADDRESSES } from '../sampleData';
import type { AddressDraft, PinnedPlace } from '../types';

type AddressBookValue = AddressBook & {
  save: (draft: AddressDraft, place: PinnedPlace, id?: string) => string;
  remove: (id: string) => void;
  setDefault: (id: string) => void;
};

const AddressBookContext = createContext<AddressBookValue | null>(null);

/**
 * Holds the saved addresses for the whole app, so a change on Saved addresses
 * or Add or edit address shows on every screen that uses them (the booking
 * forms show the default). React context is how one value is shared with many
 * screens without passing it through each one.
 *
 * SAMPLE DATA: starts from the design's sample addresses and lives in memory,
 * so changes are lost when the app restarts. In Sprint 2 the list is loaded
 * from and saved to Supabase behind these same functions.
 */
export function AddressBookProvider({ children }: { children: ReactNode }) {
  const [book, setBook] = useState<AddressBook>(() => ({
    addresses: SAMPLE_ADDRESSES,
    defaultId: SAMPLE_ADDRESSES[0]?.id,
  }));
  const nextId = useRef(1);

  const value = useMemo<AddressBookValue>(
    () => ({
      ...book,
      save: (draft, place, id) => {
        const newId = `address-${nextId.current}`;
        const result = saveAddress(book, draft, place, { id, newId });
        if (result.id === newId) nextId.current += 1;
        setBook(result.book);
        return result.id;
      },
      remove: (id) => setBook((current) => removeAddress(current, id)),
      setDefault: (id) => setBook((current) => setDefaultAddress(current, id)),
    }),
    [book],
  );

  return <AddressBookContext value={value}>{children}</AddressBookContext>;
}

export function useAddressBook(): AddressBookValue {
  const value = use(AddressBookContext);
  if (!value) throw new Error('useAddressBook must be used inside AddressBookProvider');
  return value;
}

/** The default address as the booking forms show it, or undefined when there is none. */
export function useBookingAddress(): { label: string; line: string } | undefined {
  const book = useAddressBook();
  const address = defaultAddress(book);
  return address ? bookingAddress(address) : undefined;
}
