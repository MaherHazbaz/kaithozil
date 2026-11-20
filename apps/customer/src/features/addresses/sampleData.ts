import type { PinnedPlace, SavedAddress } from './types';

// The design's sample data (design/source/Addresses.dc.html and
// AddressEdit.dc.html). The starting point of the address book until addresses come from
// Supabase in Sprint 2; delete this file then.

export const SAMPLE_ADDRESSES: readonly SavedAddress[] = [
  {
    id: 'home',
    label: 'Home',
    house: '12',
    line: '12, 4th Street, Anna Nagar, Chennai 600040',
    near: 'Near Tower Park',
  },
  {
    id: 'office',
    label: 'Office',
    house: 'Plot 18',
    line: 'Plot 18, 2nd Avenue, Ambattur Industrial Estate, Chennai 600058',
    near: 'Gate 2, ground floor',
  },
  {
    id: 'amma',
    label: "Amma's house",
    house: '7',
    line: '7, Kamarajar Street, Villivakkam, Chennai 600049',
    near: 'Opposite the temple',
  },
];

export const SAMPLE_PINNED_PLACE: PinnedPlace = {
  street: '4th Street, Anna Nagar',
  area: 'Chennai, Tamil Nadu 600040',
};
