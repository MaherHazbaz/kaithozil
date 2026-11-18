import {
  AppText,
  Card,
  Icon,
  ScreenBackground,
  Tappable,
  color,
  radius,
  spacing,
} from '@kaithozhil/ui';
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

import { JobLine } from '../components/JobLine';
import { MessageBubble } from '../components/MessageBubble';
import { ReplyBar } from '../components/ReplyBar';
import { TicketHeader } from '../components/TicketHeader';
import { TicketTimeline } from '../components/TicketTimeline';
import { ticketCopy as copy, supportIssues, ticketStatuses } from '../copy';
import { useTicketReplies } from '../hooks/useTicketReplies';
import type { SupportTicket } from '../types';

export type TicketScreenProps = {
  ticket: SupportTicket;
  onBack: () => void;
  /** Sends a reply to support. The reply is shown straight away. */
  onSendReply?: (text: string) => void;
  /** Attach a screenshot. Needs a native picker, not installed yet. */
  onAttach?: () => void;
  onCallSafetyLine?: () => void;
};

/** Shared · Support ticket (design/source/Ticket.dc.html). */
export function TicketScreen({
  ticket,
  onBack,
  onSendReply,
  onAttach,
  onCallSafetyLine,
}: TicketScreenProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  // In React Native 0.88 ScrollView is a function component; its ref is the
  // native instance type, which has scrollToEnd.
  const scroll = useRef<ScrollViewInstance>(null);
  const { messages, draft, setDraft, send } = useTicketReplies(ticket.messages, onSendReply);
  const status = ticketStatuses[ticket.status];

  const sendAndReveal = () => {
    // The new bubble is added below the fold, so scroll to it once it has
    // been laid out (the next frame).
    if (send()) {
      requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: !reducedMotion }));
    }
  };

  return (
    <ScreenBackground>
      <StatusBar style="dark" />
      {/* Lifts the reply bar above the keyboard. */}
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <TicketHeader
          title={copy.title(ticket.reference)}
          titleTamil={copy.titleTamil}
          status={status}
          resolved={ticket.status === 'resolved'}
          onBack={onBack}
          topInset={insets.top}
        />
        <ScrollView
          ref={scroll}
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.card}>
            <AppText size={12} weight={700} color={color.muted}>
              {copy.yourIssue}
            </AppText>
            <AppText size={17} weight={800}>
              {supportIssues[ticket.issue]}
            </AppText>
            <View style={styles.job}>
              <JobLine job={ticket.job} compact />
            </View>
          </Card>

          <TicketTimeline status={ticket.status} times={ticket.times} />

          <AppText size={14} weight={800} accessibilityRole="header">
            {copy.messages}
          </AppText>
          <View style={styles.messages}>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </View>

          <Tappable
            onPress={onCallSafetyLine}
            accessibilityRole="button"
            // The design draws this link about 40pt tall; hitSlop makes the
            // touch area 44pt without changing the layout.
            hitSlop={{ top: 2, bottom: 2 }}
            style={styles.safety}
            testID="ticket-safety"
          >
            <Icon name="shield" size={18} color={color.purple} />
            <AppText size={13} style={styles.flex}>
              {copy.unsafe}
              <AppText weight={700} color={color.purple}>
                {copy.callSafetyLine}
              </AppText>
            </AppText>
            <Icon name="chevronRight" size={16} color={color.purple} />
          </Tappable>
        </ScrollView>
        <ReplyBar
          draft={draft}
          onChangeDraft={setDraft}
          onSend={sendAndReveal}
          onAttach={onAttach}
        />
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingTop: 16, paddingHorizontal: spacing.screenPadding, gap: 12 },
  card: { padding: 14, gap: 10 },
  job: {
    backgroundColor: color.pageBackground,
    borderRadius: radius.statTile,
    padding: 10,
  },
  messages: { gap: 10 },
  safety: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: color.lavender,
    borderRadius: radius.note,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});
