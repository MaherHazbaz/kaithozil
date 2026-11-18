import { useRouter } from 'expo-router';

import { useSavedAddresses } from '@/features/addresses/hooks/useSavedAddresses';
import { SAMPLE_ADDRESSES } from '@/features/addresses/sampleData';
import { AddressesScreen } from '@/features/addresses/screens/AddressesScreen';

// Route "/addresses": Saved addresses. Shows the design's sample addresses.
//
// NOT WIRED YET: addresses are stored in Supabase in Sprint 2. Until then,
// "Set as default" and "Remove" change only this screen's local copy, and
// nothing saved on Add or edit address appears here.
export default function AddressesRoute() {
  const router = useRouter();
  const { addresses, defaultId, setDefault, remove } = useSavedAddresses(SAMPLE_ADDRESSES);
  return (
    <AddressesScreen
      addresses={addresses}
      defaultId={defaultId}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/profile'))}
      onAdd={() => router.push('/addresses/edit')}
      onEdit={(id) => router.push({ pathname: '/addresses/edit', params: { id } })}
      onRemove={remove}
      onSetDefault={setDefault}
    />
  );
}
