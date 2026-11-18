import { AppText, Card, Icon, color } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { ticketStatuses, type TicketStatus } from '../copy';
import { TICKET_STEPS, stepState, type StepState } from '../ticketSteps';

export type TicketTimelineProps = {
  status: TicketStatus;
  times: Partial<Record<TicketStatus, string>>;
};

/** Received → Looking into it → Resolved, with the time each was reached. */
export function TicketTimeline({ status, times }: TicketTimelineProps) {
  return (
    <Card style={styles.card}>
      {TICKET_STEPS.map((step) => {
        const state = stepState(step, status);
        const label = ticketStatuses[step];
        const time = times[step];
        return (
          <View
            key={step}
            style={styles.row}
            // One stop for screen readers: "Received, 5:02 PM".
            accessible
            accessibilityLabel={time ? `${label}, ${time}` : label}
          >
            <StepMarker state={state} />
            <View style={styles.text}>
              <AppText
                size={14}
                weight={state === 'current' ? 800 : 700}
                color={state === 'upcoming' ? color.muted : color.ink}
              >
                {label}
              </AppText>
              <AppText size={12} color={color.muted}>
                {time ?? ''}
              </AppText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function StepMarker({ state }: { state: StepState }) {
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  text: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
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
