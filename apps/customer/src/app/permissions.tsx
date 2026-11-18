import { useRouter } from 'expo-router';

import { PermissionsScreen } from '@/features/start/screens/PermissionsScreen';

// Route "/permissions", after logging in (design: Log in → Permissions → Home).
//
// NOT WIRED YET: "Allow" will ask Android for each permission. That needs
// expo-location, expo-notifications and expo-camera, which are native modules:
// adding them means a new development build, so they come with the screens
// that use them (Tracking, job alerts, Photos and voice note).
export default function PermissionsRoute() {
  const router = useRouter();
  return <PermissionsScreen onDone={() => router.replace('/home')} />;
}
