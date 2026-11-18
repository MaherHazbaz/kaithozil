import {
  AppText,
  Icon,
  ScreenBackground,
  StatusPill,
  Tappable,
  color,
  spacing,
  type StatusPillProps,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type BadgePageLayoutProps = {
  title: string;
  titleTamil: string;
  onBack: () => void;
  backLabel: string;
  /** The pill on the right of the header ("Valid 7 days", "On track"). */
  badge: string;
  badgeTone: StatusPillProps['tone'];
  /** Spoken instead of the bare pill text, which means little on its own. */
  badgeLabel: string;
  children: ReactNode;
  testID?: string;
};

/**
 * PageLayout (src/components/PageLayout.tsx) with a status pill on the right
 * of the header, which ScreenHeader has no slot for (QuoteView.dc.html and
 * JobProgress.dc.html: header padding 22 20 0, gap 12; content padding
 * 16 20 0, gap 12). Support's TicketHeader solves the same thing the same way.
 */
export function BadgePageLayout({
  title,
  titleTamil,
  onBack,
  backLabel,
  badge,
  badgeTone,
  badgeLabel,
  children,
  testID,
}: BadgePageLayoutProps) {
  const insets = useSafeAreaInsets();
  return (
    <ScreenBackground>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: 22 + insets.top }]}>
        <Tappable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={backLabel}
          style={styles.back}
          testID={testID ? `${testID}-back` : undefined}
        >
          <Icon name="chevronLeft" size={20} color={color.ink} />
        </Tappable>
        <View style={styles.title}>
          <AppText size={18} weight={800} accessibilityRole="header">
            {title}
          </AppText>
          <AppText size={12} color={color.muted}>
            {titleTamil}
          </AppText>
        </View>
        {/* `accessible` makes the view one element, read with the label below. */}
        <View accessible accessibilityLabel={badgeLabel}>
          <StatusPill label={badge} tone={badgeTone} />
        </View>
      </View>
      <ScrollView
        style={styles.flex}
        // The design's bottom padding is 0; the inset keeps the last link
        // clear of the gesture bar.
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </ScreenBackground>
  );
}

const BACK = 44;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.screenPadding,
  },
  back: {
    width: BACK,
    height: BACK,
    flexShrink: 0,
    borderRadius: BACK / 2,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flexGrow: 1,
    flexShrink: 1,
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: spacing.screenPadding,
    gap: 12,
  },
});
