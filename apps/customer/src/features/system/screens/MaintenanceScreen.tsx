import {
  StateIllustration,
  AppText,
  Card,
  Icon,
  PrimaryButton,
  color,
  type IconName,
} from '@kaithozhil/ui';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { StateLayout } from '../components/StateLayout';
import { StateMessage } from '../components/StateMessage';
import { maintenanceCopy as copy } from '../copy';
import type { RecheckStatus } from '../hooks/useRecheck';

export type MaintenanceScreenProps = {
  status: RecheckStatus;
  onCheck?: () => void;
};

/** Shared · Under maintenance (design/source/Maintenance.dc.html). */
export function MaintenanceScreen({ status, onCheck }: MaintenanceScreenProps) {
  return (
    <StateLayout
      footer={
        status === 'checking' ? (
          <PrimaryButton label={copy.checking} icon="loader" iconSize={18} disabled />
        ) : (
          <PrimaryButton label={copy.checkAgain} icon="rotateCcw" iconSize={18} onPress={onCheck} />
        )
      }
    >
      {/* The waves run the whole time: the upgrade itself is the thing in progress. */}
      <StateIllustration icon="wrench" tone="brand" ripple />
      <StateMessage title={copy.title} titleTamil={copy.titleTamil}>
        {copy.bodyBefore}
        <AppText weight={700}>{copy.bodyTime}</AppText>
        {copy.bodyAfter}
      </StateMessage>
      <Card style={styles.card}>
        <Row icon="shield">{copy.safe}</Row>
        <Row icon="calendar">{copy.scheduled}</Row>
        <Row icon="phone">
          {copy.urgentBefore}
          <AppText weight={700}>{copy.urgentNumber}</AppText>
        </Row>
      </Card>
      {status === 'still' ? (
        <AppText
          size={13}
          color={color.muted}
          align="center"
          // Announced when it appears, since it answers the button press.
          accessibilityLiveRegion="polite"
          style={styles.noShrink}
        >
          {copy.stillUpgrading}
        </AppText>
      ) : null}
    </StateLayout>
  );
}

function Row({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <View style={styles.row}>
      <Icon name={icon} size={16} color={color.purple} />
      <AppText size={13} lineHeight={13 * 1.45} style={styles.rowText}>
        {children}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, gap: 10, flexShrink: 0 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  rowText: { flex: 1 },
  noShrink: { flexShrink: 0 },
});
