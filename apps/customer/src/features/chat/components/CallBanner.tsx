import { AppText, Gradient, Icon, Tappable, color, radius } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { chatCopy as copy } from '../copy';

export type CallBannerProps = {
  firstName: string;
  onEndCall?: () => void;
};

/** "Calling Murugan…" panel shown under the header while a masked call is ringing. */
export function CallBanner({ firstName, onEndCall }: CallBannerProps) {
  return (
    <View style={styles.outer}>
      <Gradient
        name="hero"
        style={styles.banner}
        // The design marks this role="status". React Native has no such role;
        // a polite live region makes TalkBack read it when it appears.
        accessibilityLiveRegion="polite"
        testID="chat-calling"
      >
        <Icon name="phone" size={20} color={color.gold} />
        <View style={styles.text}>
          <AppText size={14} weight={800} color={color.white}>
            {copy.calling(firstName)}
          </AppText>
          <AppText size={12} color={color.lavenderText}>
            {copy.callingDetail}
          </AppText>
        </View>
        <Tappable
          onPress={onEndCall}
          accessibilityRole="button"
          accessibilityLabel={copy.endCall}
          style={styles.end}
          testID="chat-end-call"
        >
          <Icon name="phoneOff" size={18} color={color.white} />
        </Tappable>
      </Gradient>
    </View>
  );
}

const END = 44;

const styles = StyleSheet.create({
  outer: { marginTop: 10, marginHorizontal: 16 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.noteLarge,
    overflow: 'hidden',
  },
  text: { flex: 1 },
  end: {
    width: END,
    height: END,
    borderRadius: END / 2,
    backgroundColor: color.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
