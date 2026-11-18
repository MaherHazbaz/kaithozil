import { useLocalSearchParams, useRouter } from 'expo-router';

import { SAMPLE_PINNED_PLACE, sampleDraft } from '@/features/addresses/sampleData';
import { AddressEditScreen } from '@/features/addresses/screens/AddressEditScreen';

// Route "/addresses/edit" adds an address; "/addresses/edit?id=home" edits a
// saved one (pre-filled from the design's sample addresses).
//
// NOT WIRED YET:
// - The map is the design's drawing; moving it to place the pin needs
//   react-native-maps, and the street under the pin needs reverse geocoding.
// - "Use my current location" needs expo-location (not installed), so
//   onUseMyLocation is not passed and the button does nothing.
// - Save does not store anything until addresses are in Supabase (Sprint 2);
//   it returns to Saved addresses, as the design's link does.
export default function AddressEditRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const toAddresses = () => (router.canGoBack() ? router.back() : router.replace('/addresses'));
  return (
    <AddressEditScreen
      place={SAMPLE_PINNED_PLACE}
      initial={sampleDraft(id)}
      onBack={toAddresses}
      onSave={toAddresses}
    />
  );
}
