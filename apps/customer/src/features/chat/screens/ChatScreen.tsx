import { AppText, Icon, ScreenBackground, color, radius } from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { useRef } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewInstance,
} from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CallBanner } from '../components/CallBanner';
import { ChatBubble } from '../components/ChatBubble';
import { ChatComposer } from '../components/ChatComposer';
import { ChatHeader } from '../components/ChatHeader';
import { VoiceBubble } from '../components/VoiceBubble';
import { chatCopy as copy } from '../copy';
import { useChatMessages } from '../hooks/useChatMessages';
import type { ChatContact, ChatMessage } from '../types';

export type ChatScreenProps = {
  contact: ChatContact;
  /** e.g. "On the way · about 9 min". */
  status: string;
  messages: readonly ChatMessage[];
  /** True while a masked call is ringing; shows the "Calling…" banner. */
  calling: boolean;
  onBack: () => void;
  /** Starts a masked call through the calling provider (not chosen yet). */
  onCall?: () => void;
  onEndCall?: () => void;
  /** Sends a message. It is shown straight away. */
  onSend?: (text: string) => void;
  /** Plays a voice message. Needs an audio player, not wired yet. */
  onPlayVoice?: (messageId: string) => void;
  /** Records a voice message. Needs audio recording, not wired yet. */
  onRecordVoice?: () => void;
  /** Fixed clock for tests; defaults to the current time. */
  now?: () => Date;
};

/** Shared · Chat and masked call (design/source/Chat.dc.html). */
export function ChatScreen({
  contact,
  status,
  messages: initial,
  calling,
  onBack,
  onCall,
  onEndCall,
  onSend,
  onPlayVoice,
  onRecordVoice,
  now,
}: ChatScreenProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  // In React Native 0.88 ScrollView's ref is the native instance, which has scrollToEnd.
  const scroll = useRef<ScrollViewInstance>(null);
  const { messages, draft, setDraft, send } = useChatMessages(initial, onSend, now);

  const sendAndReveal = (text?: string) => {
    // The new bubble may land below the fold: scroll to it once laid out (next frame).
    if (send(text)) {
      requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: !reducedMotion }));
    }
  };

  return (
    <ScreenBackground>
      <StatusBar style="dark" />
      {/* Lifts the message field above the keyboard. */}
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ChatHeader
          contact={contact}
          status={status}
          topInset={insets.top}
          onBack={onBack}
          onCall={onCall}
        />
        {calling ? <CallBanner firstName={contact.firstName} onEndCall={onEndCall} /> : null}
        <ScrollView
          ref={scroll}
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.privacy}>
            <Icon name="lock" size={13} color={color.purple} />
            <AppText size={11} weight={700} color={color.purple}>
              {copy.privacy}
            </AppText>
          </View>
          {messages.map((message) =>
            message.kind === 'text' ? (
              <ChatBubble
                key={message.id}
                mine={message.from === 'me'}
                text={message.text}
                time={message.time}
              />
            ) : (
              <VoiceBubble
                key={message.id}
                mine={message.from === 'me'}
                duration={message.duration}
                onPlay={onPlayVoice ? () => onPlayVoice(message.id) : undefined}
              />
            ),
          )}
        </ScrollView>
        <ChatComposer
          quickReplies={copy.quickReplies}
          onQuickReply={sendAndReveal}
          draft={draft}
          onChangeDraft={setDraft}
          onSend={() => sendAndReveal()}
          onRecordVoice={onRecordVoice}
        />
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingVertical: 14, paddingHorizontal: 16, gap: 10 },
  privacy: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: color.lavender,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});
