import { AppText, color, radius } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { ticketCopy as copy } from '../copy';
import type { TicketMessage } from '../types';

/**
 * A chat bubble. The customer's are purple on the right with a sharp
 * bottom-right corner; support's are white on the left, sharp bottom-left.
 */
export function MessageBubble({ message }: { message: TicketMessage }) {
  const mine = message.from === 'customer';
  return (
    <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
      <AppText size={14} lineHeight={14 * 1.4} color={mine ? color.white : color.ink}>
        {message.text}
      </AppText>
      {message.time ? (
        <AppText
          size={10}
          color={mine ? color.lavenderText : color.muted}
          style={mine ? styles.metaMine : null}
        >
          {copy.messageMeta(mine ? copy.you : copy.support, message.time)}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '78%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 3,
    borderTopLeftRadius: radius.choiceCard,
    borderTopRightRadius: radius.choiceCard,
  },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: color.purple,
    borderBottomLeftRadius: radius.choiceCard,
    borderBottomRightRadius: radius.dot,
  },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderBottomLeftRadius: radius.dot,
    borderBottomRightRadius: radius.choiceCard,
  },
  metaMine: { alignSelf: 'flex-end' },
});
