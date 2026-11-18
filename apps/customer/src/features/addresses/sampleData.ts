import type { AddressDraft, PinnedPlace, SavedAddress } from './types';

// The design's sample data (design/source/Addresses.dc.html and
// AddressEdit.dc.html). Shared by both routes until addresses come from
// Supabase in Sprint 2; delete this file then.

export const SAMPLE_ADDRESSES: readonly SavedAddress[] = [
  {
    id: 'home',
    label: 'Home',
    line: '12, 4th Street, Anna Nagar, Chennai 600040',
    near: 'Near Tower Park',
  },
  {
    id: 'office',
    label: 'Office',
    line: 'Plot 18, 2nd Avenue, Ambattur Industrial Estate, Chennai 600058',
    near: 'Gate 2, ground floor',
  },
  {
    id: 'amma',
    label: "Amma's house",
    line: '7, Kamarajar Street, Villivakkam, Chennai 600049',
    near: 'Opposite the temple',
  },
];

export const SAMPLE_PINNED_PLACE: PinnedPlace = {
  street: '4th Street, Anna Nagar',
  area: 'Chennai, Tamil Nadu 600040',
};

/**
 * Pre-fills Add or edit address from a saved address. The sample addresses
 * are single lines, so the house number is the part before the first comma.
 */
export function sampleDraft(id: string | undefined): Partial<AddressDraft> | undefined {
  const address = SAMPLE_ADDRESSES.find((candidate) => candidate.id === id);
  if (!address) return undefined;
  return {
    house: address.line.split(',')[0] ?? '',
    landmark: address.near,
    label: address.label === 'Home' ? 'home' : address.label === 'Office' ? 'office' : 'other',
    isDefault: address.id === SAMPLE_ADDRESSES[0]?.id,
  };
}
