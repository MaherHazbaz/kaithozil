import { useLocalSearchParams, useRouter } from 'expo-router';

import { draftFromAddress } from '@/features/addresses/addressBook';
import { useAddressBook } from '@/features/addresses/hooks/useAddressBook';
import { SAMPLE_PINNED_PLACE } from '@/features/addresses/sampleData';
import { AddressEditScreen } from '@/features/addresses/screens/AddressEditScreen';

// Route "/addresses/edit" adds an address; "/addresses/edit?id=home" edits a
// saved one, pre-filled from the address book. Save updates the address book
// and returns to Saved addresses, as the design's link does.
//
// NOT WIRED YET:
// - The map is the design's drawing and the place under the pin is its sample
//   (4th Street, Anna Nagar). Moving the pin needs react-native-maps, and the
//   street under it needs reverse geocoding.
// - "Use my current location" needs expo-location (not installed), so
//   onUseMyLocation is not passed and the button does nothing.
// - Saved addresses live in memory until they are stored in Supabase (Sprint 2).
export default function AddressEditRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const book = useAddressBook();
  const toAddresses = () => (router.canGoBack() ? router.back() : router.replace('/addresses'));
  return (
    <AddressEditScreen
      place={SAMPLE_PINNED_PLACE}
      initial={draftFromAddress(book, id)}
      onBack={toAddresses}
      onSave={(draft) => {
        book.save(draft, SAMPLE_PINNED_PLACE, id);
        toAddresses();
      }}
    />
  );
}
