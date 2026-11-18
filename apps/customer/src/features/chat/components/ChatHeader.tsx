import { AppText, Avatar, Gradient, Icon, Tappable, color } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { chatCopy as copy } from '../copy';
import type { ChatContact } from '../types';

export type ChatHeaderProps = {
  contact: ChatContact;
  /** e.g. "On the way · about 9 min". */
  status: string;
  topInset: number;
  onBack: () => void;
  onCall?: () => void;
};

/** White bar: back, the worker's initials, name and status, and the masked call button. */
export function ChatHeader({ contact, status, topInset, onBack, onCall }: ChatHeaderProps) {
  return (
    <View style={[styles.header, { paddingTop: 22 + topInset }]}>
      <Tappable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={copy.back}
        style={styles.back}
        testID="chat-back"
      >
        <Icon name="chevronLeft" size={20} color={color.ink} />
      </Tappable>
      <Avatar initials={contact.initials} size={42} fontSize={13} />
      <View style={styles.text}>
        <AppText size={16} weight={800} numberOfLines={1}>
          {contact.name}
        </AppText>
        <AppText size={12} color={color.muted} numberOfLines={1}>
          {status}
        </AppText>
      </View>
      <Tappable
        onPress={onCall}
        accessibilityRole="button"
        accessibilityLabel={copy.callLabel(contact.firstName)}
        style={styles.round}
        testID="chat-call"
      >
        <Gradient name="button" style={styles.callFill}>
          <Icon name="phone" size={18} color={color.white} />
        </Gradient>
      </Tappable>
    </View>
  );
}

const ROUND = 44;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: color.white,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  back: {
    width: ROUND,
    height: ROUND,
    flexShrink: 0,
    borderRadius: ROUND / 2,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // min-width 0 in the design: the name truncates instead of pushing the call button off.
  text: { flex: 1, minWidth: 0, gap: 1 },
  round: { width: ROUND, height: ROUND, flexShrink: 0, borderRadius: ROUND / 2 },
  callFill: {
    flex: 1,
    borderRadius: ROUND / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
