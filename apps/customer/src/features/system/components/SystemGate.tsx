import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import { useRecheck } from '../hooks/useRecheck';
import { useSystemStatus, type SystemStatusSources } from '../hooks/useSystemStatus';
import { openNetworkSettings } from '../openNetworkSettings';
import { MaintenanceScreen } from '../screens/MaintenanceScreen';
import { NoInternetScreen } from '../screens/NoInternetScreen';
import { UpdateAppScreen } from '../screens/UpdateAppScreen';

export type SystemGateProps = SystemStatusSources & {
  /** Keep the app uncovered for now (the opening animation), while still checking. */
  paused?: boolean;
  children: ReactNode;
};

/**
 * Covers the whole app with No internet, Under maintenance or Update
 * required when needed. The screens underneath stay mounted, so nothing the
 * customer typed is lost and they return to the same place once it clears.
 */
export function SystemGate({ paused = false, children, ...sources }: SystemGateProps) {
  const { block, recheckFor } = useSystemStatus(sources);
  const shown = paused ? null : block;

  // While covered, Android's Back button would change the hidden screen
  // underneath. Returning true tells Android "handled".
  useEffect(() => {
    if (!shown) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, [shown]);

  return (
    <View style={styles.fill}>
      <View
        style={styles.fill}
        // Hide the covered app from TalkBack / VoiceOver, so they read only the cover.
        importantForAccessibility={shown ? 'no-hide-descendants' : 'auto'}
        accessibilityElementsHidden={shown !== null}
      >
        {children}
      </View>
      {shown ? (
        <View style={StyleSheet.absoluteFill} testID={`system-${shown}`}>
          {shown === 'offline' ? <OfflineCover check={recheckFor('offline')} /> : null}
          {shown === 'maintenance' ? <MaintenanceCover check={recheckFor('maintenance')} /> : null}
          {/* "Update now" opens the store listing once the app is published. */}
          {shown === 'updateRequired' ? <UpdateAppScreen kind="required" /> : null}
        </View>
      ) : null}
    </View>
  );
}

// The gate removes the cover itself when the check passes, so there is
// nothing more to do on recovery.
const nothing = () => {};

function OfflineCover({ check }: { check: () => Promise<boolean> }) {
  const { status, recheck } = useRecheck(check, nothing);
  return (
    <NoInternetScreen status={status} onRetry={recheck} onOpenSettings={openNetworkSettings} />
  );
}

function MaintenanceCover({ check }: { check: () => Promise<boolean> }) {
  const { status, recheck } = useRecheck(check, nothing);
  return <MaintenanceScreen status={status} onCheck={recheck} />;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
