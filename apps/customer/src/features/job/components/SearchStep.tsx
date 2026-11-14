import { AppText, Icon, Tappable, color } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

export type SearchStepState = 'done' | 'current' | 'next';

export type SearchStepProps = {
  state: SearchStepState;
  title: string;
  detail: string;
  /** Only the current step opens something (the design links it to the worker on the way). */
  onPress?: () => void;
  testID?: string;
};

/** One row of the "Finding a worker" progress card (design/source/Searching.dc.html). */
export function SearchStep({ state, title, detail, onPress, testID }: SearchStepProps) {
  const content = (
    <>
      <StepDot state={state} />
      <View style={styles.text}>
        <AppText size={14} weight={700} color={state === 'next' ? color.muted : color.ink}>
          {title}
        </AppText>
        <AppText size={12} color={color.muted}>
          {detail}
        </AppText>
      </View>
      {onPress ? <Icon name="chevronRight" size={18} color={color.muted} /> : null}
    </>
  );

  if (onPress) {
    return (
      <Tappable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${detail}`}
        style={styles.row}
        // The row is about 33pt tall (two lines of text); hitSlop extends the
        // touch area to 44pt+ without changing the card's spacing.
        hitSlop={{ top: 7, bottom: 7 }}
        testID={testID}
      >
        {content}
      </Tappable>
    );
  }
  return (
    // Read as one sentence by screen readers instead of two separate texts.
    <View style={styles.row} accessible accessibilityLabel={`${title}, ${detail}`} testID={testID}>
      {content}
    </View>
  );
}

function StepDot({ state }: { state: SearchStepState }) {
  if (state === 'done') {
    return (
      <View style={[styles.dot, styles.dotDone]}>
        <Icon name="check" size={16} color={color.white} strokeWidth={3} />
      </View>
    );
  }
  if (state === 'current') {
    return (
      <View style={[styles.dot, styles.dotCurrent]}>
        <View style={styles.innerDot} />
      </View>
    );
  }
  return <View style={[styles.dot, styles.dotNext]} />;
}

const DOT = 28;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    flexGrow: 1,
    flexShrink: 1,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dotDone: { backgroundColor: color.purple },
  dotCurrent: { backgroundColor: color.mango },
  dotNext: {
    backgroundColor: color.white,
    borderWidth: 2,
    borderColor: color.borderStrong,
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color.white,
  },
});
