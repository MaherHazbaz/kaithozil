import { AppText, Card, Icon, color } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

export type DoneStep = { title: string; detail: string };

/** A card of completed steps, each with a purple tick (Tracking.dc.html "Murugan arrived"). */
export function DoneSteps({ steps, testID }: { steps: readonly DoneStep[]; testID?: string }) {
  return (
    <Card style={styles.card} testID={testID}>
      {steps.map((step) => (
        <View key={step.title} style={styles.row}>
          <View style={styles.tick}>
            <Icon name="check" size={14} color={color.white} strokeWidth={3} />
          </View>
          <View style={styles.text}>
            <AppText size={13} weight={700}>
              {step.title}
            </AppText>
            <AppText size={11} color={color.muted}>
              {step.detail}
            </AppText>
          </View>
        </View>
      ))}
    </Card>
  );
}

const TICK = 24;

const styles = StyleSheet.create({
  // The source sets `gap: 10px` and then `gap: 8px` on this card; the last one wins.
  card: { padding: 14, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tick: {
    width: TICK,
    height: TICK,
    borderRadius: TICK / 2,
    backgroundColor: color.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flexShrink: 1 },
});
