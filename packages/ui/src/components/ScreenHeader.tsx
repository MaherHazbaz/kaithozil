import { StyleSheet, View } from 'react-native';

import { color, spacing, type as typeStyle } from '../tokens';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { Tappable } from './Tappable';

export type ScreenHeaderProps = {
  title: string;
  /** Second line, usually the Tamil title. */
  subtitle?: string;
  onBack?: () => void;
  /** Screen-reader name of the back button, e.g. "Back". */
  backLabel: string;
  /**
   * Height of the status bar area (safe-area top inset). It is ADDED to the
   * design's 22pt top padding, so the title keeps the design's spacing below
   * the status bar.
   */
  topInset?: number;
  /** The design's top padding. Default 22; Book.dc.html uses 24. */
  paddingTop?: number;
  /** Default 800; Book.dc.html uses 700. */
  titleWeight?: 700 | 800;
  testID?: string;
};

/**
 * Header of every screen that has a back button: a 44pt round back button,
 * then the title with an optional second line (design/source/Post.dc.html,
 * Login.dc.html and the other inner screens share these values).
 */
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  backLabel,
  topInset = 0,
  paddingTop = 22,
  titleWeight = typeStyle.screenTitleWithBack.weight,
  testID,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.header, { paddingTop: paddingTop + topInset }]}>
      <Tappable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={backLabel}
        style={styles.back}
        testID={testID}
      >
        <Icon name="chevronLeft" size={20} color={color.ink} />
      </Tappable>
      <View style={styles.text}>
        <AppText
          size={typeStyle.screenTitleWithBack.size}
          weight={titleWeight}
          accessibilityRole="header"
        >
          {title}
        </AppText>
        {subtitle ? (
          <AppText size={12} color={color.muted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.screenPadding,
  },
  back: {
    width: 44,
    height: 44,
    flexShrink: 0,
    // Half the width: a circle.
    borderRadius: 22,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flexGrow: 1,
    flexShrink: 1,
  },
});
