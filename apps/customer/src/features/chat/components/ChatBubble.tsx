import { AppText, color, radius } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

/**
 * A text message. Mine are purple on the right with a sharp bottom-right
 * corner; theirs are white on the left, sharp bottom-left (the tail).
 */
export function ChatBubble({ mine, text, time }: { mine: boolean; text: string; time: string }) {
  return (
    <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
      <AppText size={14} lineHeight={14 * 1.4} color={mine ? color.white : color.ink}>
        {text}
      </AppText>
      <AppText
        size={10}
        color={mine ? color.lavenderText : color.muted}
        style={mine ? styles.timeMine : null}
      >
        {time}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '78%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 3,
    borderTopLeftRadius: radius.bubble,
    borderTopRightRadius: radius.bubble,
  },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: color.purple,
    borderBottomLeftRadius: radius.bubble,
    borderBottomRightRadius: radius.bubbleTail,
  },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderBottomLeftRadius: radius.bubbleTail,
    borderBottomRightRadius: radius.bubble,
  },
  timeMine: { alignSelf: 'flex-end' },
});
