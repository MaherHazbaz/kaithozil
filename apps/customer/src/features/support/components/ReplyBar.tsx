import { Gradient, Icon, Tappable, color, fontFamily } from '@kaithozhil/ui';
import { StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ticketCopy as copy } from '../copy';

export type ReplyBarProps = {
  draft: string;
  onChangeDraft: (text: string) => void;
  onSend: () => void;
  /** Opens a picker for a screenshot. Needs a native image/document picker. */
  onAttach?: () => void;
};

/** The fixed white bar under the ticket: attach, reply field, send. */
export function ReplyBar({ draft, onChangeDraft, onSend, onAttach }: ReplyBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: 24 + insets.bottom }]}>
      <Tappable
        onPress={onAttach}
        accessibilityRole="button"
        accessibilityLabel={copy.attach}
        style={styles.attach}
        testID="ticket-attach"
      >
        <Icon name="paperclip" size={20} color={color.purple} />
      </Tappable>
      <TextInput
        value={draft}
        onChangeText={onChangeDraft}
        placeholder={copy.replyPlaceholder}
        placeholderTextColor={color.placeholder}
        accessibilityLabel={copy.replyLabel}
        // The keyboard's return key sends, like a chat app.
        returnKeyType="send"
        onSubmitEditing={onSend}
        submitBehavior="submit"
        maxFontSizeMultiplier={1.3}
        style={styles.input}
        testID="ticket-reply"
      />
      <Tappable
        onPress={onSend}
        accessibilityRole="button"
        accessibilityLabel={copy.send}
        style={styles.round}
        testID="ticket-send"
      >
        <Gradient name="button" style={styles.sendFill}>
          <Icon name="send" size={18} color={color.white} />
        </Gradient>
      </Tappable>
    </View>
  );
}

const ROUND = 48;

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.border,
  },
  round: { width: ROUND, height: ROUND, flexShrink: 0, borderRadius: ROUND / 2 },
  attach: {
    width: ROUND,
    height: ROUND,
    flexShrink: 0,
    borderRadius: ROUND / 2,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: ROUND,
    borderRadius: ROUND / 2,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    paddingHorizontal: 16,
    fontFamily: fontFamily.body,
    fontSize: 15,
    color: color.ink,
    // Android adds space above and below text by default; this keeps it centred.
    includeFontPadding: false,
  },
  sendFill: {
    flex: 1,
    borderRadius: ROUND / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
