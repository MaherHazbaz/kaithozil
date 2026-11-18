import { AppText, Card, Icon, color } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { requestSentCopy as copy } from '../copy';

type StepState = 'done' | 'now' | 'next';

/** Request sent → worker replies → booking confirmed, while waiting for the reply. */
export function ReplySteps({ firstName }: { firstName: string }) {
  return (
    <Card style={styles.card}>
      <Step state="done" label={copy.waiting.stepSent} />
      <Step state="now" label={copy.waiting.stepReplies(firstName)} />
      <Step state="next" label={copy.waiting.stepConfirmed} />
    </Card>
  );
}

const STATE_LABEL = {
  done: copy.waiting.stepDone,
  now: copy.waiting.stepNow,
  next: copy.waiting.stepNext,
} as const;

function Step({ state, label }: { state: StepState; label: string }) {
  return (
    <View style={styles.step} accessible accessibilityLabel={`${label}, ${STATE_LABEL[state]}`}>
      {state === 'done' ? (
        <View style={[styles.dot, styles.done]}>
          <Icon name="check" size={16} color={color.white} strokeWidth={3} />
        </View>
      ) : null}
      {state === 'now' ? (
        <View style={[styles.dot, styles.now]}>
          <View style={styles.nowCentre} />
        </View>
      ) : null}
      {state === 'next' ? <View style={[styles.dot, styles.next]} /> : null}
      <AppText
        size={14}
        weight={state === 'now' ? 800 : 700}
        color={state === 'next' ? color.muted : color.ink}
      >
        {label}
      </AppText>
    </View>
  );
}

const DOT = 28;
const CENTRE = 10;

const styles = StyleSheet.create({
  card: { padding: 14, gap: 10 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: { backgroundColor: color.purple },
  now: { backgroundColor: color.mango },
  nowCentre: {
    width: CENTRE,
    height: CENTRE,
    borderRadius: CENTRE / 2,
    backgroundColor: color.white,
  },
  next: { borderWidth: 2, borderColor: color.borderStrong, backgroundColor: color.white },
});
