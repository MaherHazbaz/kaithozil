import { addressEditCopy } from './copy';
import type { AddressDraft, AddressLabel, PinnedPlace, SavedAddress } from './types';

/** The customer's saved addresses and which one is used first when booking. */
export type AddressBook = {
  addresses: readonly SavedAddress[];
  defaultId: string | undefined;
};

/**
 * Removes an address. If it was the default, the first one left becomes the
 * default, so a customer with addresses always has one to book with.
 */
export function removeAddress(book: AddressBook, id: string): AddressBook {
  const addresses = book.addresses.filter((address) => address.id !== id);
  return {
    addresses,
    defaultId: book.defaultId === id ? addresses[0]?.id : book.defaultId,
  };
}

export function setDefaultAddress(book: AddressBook, id: string): AddressBook {
  return book.addresses.some((address) => address.id === id) ? { ...book, defaultId: id } : book;
}

export function findAddress(book: AddressBook, id: string | undefined): SavedAddress | undefined {
  return book.addresses.find((address) => address.id === id);
}

export function defaultAddress(book: AddressBook): SavedAddress | undefined {
  return findAddress(book, book.defaultId);
}

/**
 * Adds a new address (no `id`) or updates a saved one. Returns the new book
 * and the saved address's id.
 *
 * The default follows the "Make this my default address" switch. Turning it
 * off on the current default hands the default to the first other address,
 * and the only address is always the default.
 */
export function saveAddress(
  book: AddressBook,
  draft: AddressDraft,
  place: PinnedPlace,
  options: { id?: string; newId: string },
): { book: AddressBook; id: string } {
  const existing = findAddress(book, options.id);
  const id = existing?.id ?? options.newId;
  const house = draft.house.trim();
  const saved: SavedAddress = {
    id,
    label: labelText(draft.label, existing),
    house,
    line: existing ? replaceHouse(existing, house) : newLine(house, place),
    near: draft.landmark.trim(),
  };
  const addresses = existing
    ? book.addresses.map((address) => (address.id === id ? saved : address))
    : [...book.addresses, saved];

  let defaultId = book.defaultId;
  if (draft.isDefault) defaultId = id;
  else if (defaultId === id) defaultId = addresses.find((address) => address.id !== id)?.id ?? id;
  if (defaultId === undefined) defaultId = id;

  return { book: { addresses, defaultId }, id };
}

/** Pre-fills Add or edit address from a saved address. */
export function draftFromAddress(
  book: AddressBook,
  id: string | undefined,
): AddressDraft | undefined {
  const address = findAddress(book, id);
  if (!address) return undefined;
  return {
    house: address.house,
    landmark: address.near,
    label: labelKey(address.label),
    isDefault: address.id === book.defaultId,
  };
}

/**
 * The address as the booking forms show it: the saved line without its last
 * part (city and PIN code), e.g. "12, 4th Street, Anna Nagar" as in
 * design/source/Post.dc.html.
 */
export function bookingAddress(address: SavedAddress): { label: string; line: string } {
  const parts = address.line.split(',').map((part) => part.trim());
  const line = parts.length > 2 ? parts.slice(0, -1).join(', ') : address.line;
  return { label: address.label, line };
}

/** Swaps the house number at the start of a saved line, keeping the street, area and PIN. */
function replaceHouse(address: SavedAddress, house: string): string {
  const rest = address.line.startsWith(address.house)
    ? address.line.slice(address.house.length).replace(/^,\s*/, '')
    : address.line;
  return rest ? `${house}, ${rest}` : house;
}

/** "12" + "4th Street, Anna Nagar" + "Chennai, Tamil Nadu 600040" → "12, 4th Street, Anna Nagar, Chennai 600040". */
function newLine(house: string, place: PinnedPlace): string {
  const city = place.area.split(',')[0]?.trim() ?? '';
  const pin = /\d{6}/.exec(place.area)?.[0] ?? '';
  return [house, place.street, [city, pin].filter(Boolean).join(' ')].filter(Boolean).join(', ');
}

function labelKey(label: string): AddressLabel {
  if (label === addressEditCopy.labels.home) return 'home';
  if (label === addressEditCopy.labels.office) return 'office';
  return 'other';
}

/** "Other" keeps a name the customer gave before (e.g. "Amma's house"). */
function labelText(key: AddressLabel, existing: SavedAddress | undefined): string {
  if (key === 'other' && existing && labelKey(existing.label) === 'other') return existing.label;
  return addressEditCopy.labels[key];
}
