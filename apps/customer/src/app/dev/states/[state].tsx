import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Linking, Platform } from 'react-native';

import { useRecheck } from '@/features/system/hooks/useRecheck';
import { EmptyStateScreen } from '@/features/system/screens/EmptyStateScreen';
import { ErrorStateScreen } from '@/features/system/screens/ErrorStateScreen';
import { MaintenanceScreen } from '@/features/system/screens/MaintenanceScreen';
import { NoInternetScreen } from '@/features/system/screens/NoInternetScreen';

// DEVELOPMENT ONLY: "/dev/states/<state>" shows a system state on its own, for
// review on the emulator and for `pnpm visual`. In the app these states are
// not routes; they appear when something happens (the connection drops, a
// screen crashes, a list is empty, the server is down for maintenance).
//
//   no-internet  error  empty-bookings  empty-search  maintenance
//
// SAMPLE BEHAVIOUR: "Try again" and "Check again" always fail after 1.5 s,
// as in the design's prototype. The real checks (a network check and a
// server status flag) are added when the app can detect those conditions.
export default function StatePreviewRoute() {
  const { state } = useLocalSearchParams<{ state: string }>();
  const router = useRouter();
  const goHome = useCallback(() => router.replace('/home'), [router]);
  const { status, recheck } = useRecheck(stillDown, goHome);

  // `__DEV__` is false in release builds, so these previews never ship.
  if (!__DEV__) return <Redirect href="/home" />;

  switch (state) {
    case 'no-internet':
      return (
        <NoInternetScreen status={status} onRetry={recheck} onOpenSettings={openNetworkSettings} />
      );
    case 'error':
      return (
        <ErrorStateScreen
          reference="KT-ERR-4821"
          onHome={goHome}
          onHelp={() => router.push('/support')}
        />
      );
    case 'empty-bookings':
      return <EmptyStateScreen kind="bookings" onAction={goHome} />;
    case 'empty-search':
      return <EmptyStateScreen kind="search" onAction={() => router.push('/job/new')} />;
    case 'maintenance':
      return <MaintenanceScreen status={status} onCheck={recheck} />;
    default:
      return <Redirect href="/home" />;
  }
}

const stillDown = () => new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 1500));

/** Opens Android's network settings; elsewhere, this app's settings page. */
async function openNetworkSettings() {
  if (Platform.OS === 'android') {
    try {
      await Linking.sendIntent('android.settings.WIRELESS_SETTINGS');
      return;
    } catch {
      // Some phones hide that screen; fall through to the app's own settings.
    }
  }
  await Linking.openSettings();
}
