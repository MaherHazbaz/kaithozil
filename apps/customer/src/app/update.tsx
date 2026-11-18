import { useLocalSearchParams, useRouter } from 'expo-router';

import { UpdateAppScreen } from '@/features/system/screens/UpdateAppScreen';

// Route "/update" (add "?kind=optional" for the optional version).
//
// NOT WIRED YET: deciding when to show this (comparing the installed version
// with a minimum version from the server) comes with Supabase. "Update now"
// will open the Play Store listing, which does not exist until the app is
// published, so it does nothing for now.
export default function UpdateRoute() {
  const router = useRouter();
  const { kind } = useLocalSearchParams<{ kind?: string }>();
  return (
    <UpdateAppScreen
      kind={kind === 'optional' ? 'optional' : 'required'}
      onLater={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
    />
  );
}
