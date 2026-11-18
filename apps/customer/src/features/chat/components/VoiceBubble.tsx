import { AppText, Icon, Tappable, color, radius } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { chatCopy as copy } from '../copy';

// Bar heights of the design's static waveform, left to right.
const BARS = [8, 14, 20, 10, 22, 16, 9, 18, 12, 20, 8, 14] as const;

export type VoiceBubbleProps = {
  mine: boolean;
  duration: string;
  onPlay?: () => void;
};

/** A voice message: play button, waveform and length. */
export function VoiceBubble({ mine, duration, onPlay }: VoiceBubbleProps) {
  return (
    <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
      <Tappable
        onPress={onPlay}
        accessibilityRole="button"
        accessibilityLabel={copy.playVoice}
        // The design draws a 36pt button; hitSlop brings the touch area to 44pt.
        hitSlop={4}
        style={styles.play}
      >
        <Icon name="play" size={16} color={color.white} />
      </Tappable>
      <View style={styles.wave} importantForAccessibility="no-hide-descendants">
        {BARS.map((height, index) => (
          // The bars never reorder, so the index is a stable key.
          <View key={index} style={[styles.bar, { height }]} />
        ))}
      </View>
      <AppText size={11} color={color.muted}>
        {duration}
      </AppText>
    </View>
  );
}

const PLAY = 36;
const BAR_WIDTH = 3;

const styles = StyleSheet.create({
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.borderSoft,
    // The source's border-radius is 20; its box-shadow value is malformed
    // (a radius list pasted into it), so browsers drop it and the screenshot
    // shows no shadow. Matched to what renders.
    borderRadius: radius.card,
  },
  mine: { alignSelf: 'flex-end' },
  theirs: { alignSelf: 'flex-start' },
  play: {
    width: PLAY,
    height: PLAY,
    borderRadius: PLAY / 2,
    backgroundColor: color.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  bar: { width: BAR_WIDTH, borderRadius: BAR_WIDTH / 2, backgroundColor: color.purple },
});
