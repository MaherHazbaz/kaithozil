import { StyleSheet, View } from 'react-native';

import { color, radius } from '../tokens';

/**
 * The 52 x 30 on/off track (DESIGN.md "toggles"). Visual only: the row around
 * it is the touch target and carries the switch role, so the whole row can be
 * tapped and screen readers read the row's label with its state.
 */
export function Toggle({
  on,
  tone = 'purple',
}: {
  on: boolean;
  /** Track colour when on. Default purple; Crew.dc.html's mestri switch is mango. */
  tone?: 'purple' | 'mango';
}) {
  return (
    <View
      style={[
        styles.track,
        on ? styles.on : styles.off,
        on && tone === 'mango' ? styles.mango : null,
      ]}
    >
      <View style={styles.knob} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 52,
    height: 30,
    flexShrink: 0,
    borderRadius: radius.pill,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  on: { backgroundColor: color.purple, justifyContent: 'flex-end' },
  off: { backgroundColor: color.toggleOff, justifyContent: 'flex-start' },
  mango: { backgroundColor: color.mango },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: color.white },
});
