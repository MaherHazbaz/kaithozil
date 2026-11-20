import { useRouter } from 'expo-router';

import { useAddressBook } from '@/features/addresses/hooks/useAddressBook';
import { AddressesScreen } from '@/features/addresses/screens/AddressesScreen';

// Route "/addresses": Saved addresses. The list is shared with the rest of the
// app (AddressBookProvider), so adding, editing, removing and the default
// show everywhere, including the address on the booking forms.
//
// NOT WIRED YET: the list lives in memory, starting from the design's sample
// addresses, and resets when the app restarts. It is stored in Supabase in
// Sprint 2.
export default function AddressesRoute() {
  const router = useRouter();
  const { addresses, defaultId, setDefault, remove } = useAddressBook();
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
