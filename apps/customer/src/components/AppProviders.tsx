import type { ReactNode } from 'react';

import { AddressBookProvider } from '@/features/addresses/hooks/useAddressBook';

/**
 * The app-wide data every screen can read, gathered in one place so the root
 * layout stays short. Each provider belongs to its feature; add new ones here.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <AddressBookProvider>{children}</AddressBookProvider>;
}
