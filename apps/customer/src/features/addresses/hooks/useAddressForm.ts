import { useState } from 'react';

import type { AddressDraft } from '../types';

export const EMPTY_ADDRESS: AddressDraft = {
  house: '',
  landmark: '',
  label: 'home',
  isDefault: false,
};

/** The house or flat number is the only required field (AddressEdit.dc.html). */
export const isMissingHouse = (draft: AddressDraft) => draft.house.trim() === '';

/** Form state for Add or edit address. The server validates again when saving is wired. */
export function useAddressForm(initial: Partial<AddressDraft> = {}) {
  const [draft, setDraft] = useState<AddressDraft>({ ...EMPTY_ADDRESS, ...initial });

  const update = <K extends keyof AddressDraft>(key: K, value: AddressDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  return {
    draft,
    missingHouse: isMissingHouse(draft),
    update,
    toggleDefault: () => setDraft((current) => ({ ...current, isDefault: !current.isDefault })),
  };
}
