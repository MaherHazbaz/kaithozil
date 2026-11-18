import { useState } from 'react';

import type { SavedAddress } from '../types';

/**
 * Removes an address. If it was the default, the first one left becomes the
 * default, so a customer with addresses always has one to book with.
 */
export function removeAddress(
  addresses: readonly SavedAddress[],
  defaultId: string | undefined,
  id: string,
): { addresses: SavedAddress[]; defaultId: string | undefined } {
  const remaining = addresses.filter((address) => address.id !== id);
  return {
    addresses: remaining,
    defaultId: defaultId === id ? remaining[0]?.id : defaultId,
  };
}

/**
 * The saved-address list with its default. Local state only for now: the
 * changes are lost when the screen closes until addresses are stored in
 * Supabase (Sprint 2).
 */
export function useSavedAddresses(initial: readonly SavedAddress[], initialDefaultId?: string) {
  const [state, setState] = useState(() => ({
    addresses: [...initial],
    defaultId: initialDefaultId ?? initial[0]?.id,
  }));

  return {
    addresses: state.addresses,
    defaultId: state.defaultId,
    setDefault: (id: string) => setState((current) => ({ ...current, defaultId: id })),
    remove: (id: string) =>
      setState((current) => removeAddress(current.addresses, current.defaultId, id)),
  };
}
