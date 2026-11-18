import { AppText, Gradient, Icon, Tappable, color, fontFamily, radius } from '@kaithozhil/ui';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { chatCopy as copy } from '../copy';

export type ChatComposerProps = {
  quickReplies: readonly string[];
  onQuickReply: (text: string) => void;
  draft: string;
  onChangeDraft: (text: string) => void;
  onSend: () => void;
  /** Records a voice message. Needs audio recording, not wired yet. */
  onRecordVoice?: () => void;
};

/** Quick-reply chips, then the message field, voice and send buttons. */
export function ChatComposer({
  quickReplies,
  onQuickReply,
  draft,
  onChangeDraft,
  onSend,
  onRecordVoice,
}: ChatComposerProps) {
  const insets = useSafeAreaInsets();
  return (
    <>
      <ScrollView
        horizontal
        // A horizontal ScrollView stretches to fill the column unless told not to grow.
        style={styles.quickScroll}
        contentContainerStyle={styles.quick}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        accessibilityLabel={copy.quickRepliesLabel}
      >
        {quickReplies.map((label) => (
          <Tappable
            key={label}
            onPress={() => onQuickReply(label)}
            accessibilityRole="button"
            style={styles.chip}
          >
            <AppText size={13} weight={700} color={color.purple} numberOfLines={1}>
              {label}
            </AppText>
          </Tappable>
        ))}
      </ScrollView>
      <View style={[styles.bar, { paddingBottom: 24 + insets.bottom }]}>
        <TextInput
          value={draft}
          onChangeText={onChangeDraft}
          placeholder={copy.messagePlaceholder}
          placeholderTextColor={color.placeholder}
          accessibilityLabel={copy.messageLabel}
          // The keyboard's return key sends, like a chat app.
          returnKeyType="send"
          onSubmitEditing={onSend}
          submitBehavior="submit"
          maxFontSizeMultiplier={1.3}
          style={styles.input}
          testID="chat-message"
        />
        <Tappable
          onPress={onRecordVoice}
          accessibilityRole="button"
          accessibilityLabel={copy.recordVoice}
          style={styles.voice}
          testID="chat-record"
        >
          <Icon name="mic" size={20} color={color.purple} />
        </Tappable>
        <Tappable
          onPress={onSend}
          accessibilityRole="button"
          accessibilityLabel={copy.send}
          style={styles.round}
          testID="chat-send"
        >
          <Gradient name="button" style={styles.sendFill}>
            <Icon name="send" size={18} color={color.white} />
          </Gradient>
        </Tappable>
      </View>
    </>
  );
}

const ROUND = 48;

const styles = StyleSheet.create({
  quickScroll: { flexGrow: 0, flexShrink: 0 },
  quick: { paddingTop: 10, paddingHorizontal: 16, gap: 8 },
  chip: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    justifyContent: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    paddingHorizontal: 16,
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
  voice: {
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
  round: { width: ROUND, height: ROUND, flexShrink: 0, borderRadius: ROUND / 2 },
  sendFill: {
    flex: 1,
    borderRadius: ROUND / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
