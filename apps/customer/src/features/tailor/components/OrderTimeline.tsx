import { AppText, Card, Icon, color } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import type { OrderStep, OrderStepState } from '../orderTimeline';

/**
 * Booked → Measured → Stitching → Ready → Delivered (OrderStatus.dc.html).
 * Same markers as Support's TicketTimeline; the rows are top-aligned here, as drawn.
 */
export function OrderTimeline({ steps }: { steps: readonly OrderStep[] }) {
  return (
    <Card style={styles.card} testID="order-timeline">
      {steps.map((step) => (
        <View
          key={step.key}
          style={styles.row}
          // One stop for screen readers: "Booked, Thu 13 Nov".
          accessible
          accessibilityLabel={step.time ? `${step.label}, ${step.time}` : step.label}
        >
          <StepMarker state={step.state} />
          <View style={styles.text}>
            <AppText
              size={14}
              weight={step.state === 'current' ? 800 : 700}
              color={step.state === 'upcoming' ? color.muted : color.ink}
              style={styles.label}
            >
              {step.label}
            </AppText>
            <AppText size={12} color={color.muted} style={styles.time}>
              {step.time}
            </AppText>
          </View>
        </View>
      ))}
    </Card>
  );
}

function StepMarker({ state }: { state: OrderStepState }) {
  if (state === 'done') {
    return (
      <View style={[styles.marker, styles.done]}>
        <Icon name="check" size={16} color={color.white} strokeWidth={3} />
      </View>
    );
  }
  if (state === 'current') {
    return (
      <View style={[styles.marker, styles.current]}>
        <View style={styles.dot} />
      </View>
    );
  }
  return <View style={[styles.marker, styles.upcoming]} />;
}

const MARKER = 28;
const DOT = 10;

const styles = StyleSheet.create({
  card: { padding: 14, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  text: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  label: { flexShrink: 1 },
  time: { flexShrink: 0 },
  marker: {
    width: MARKER,
    height: MARKER,
    flexShrink: 0,
    borderRadius: MARKER / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: { backgroundColor: color.purple },
  current: { backgroundColor: color.mango },
  upcoming: { borderWidth: 2, borderColor: color.borderStrong, backgroundColor: color.white },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2, backgroundColor: color.white },
});
