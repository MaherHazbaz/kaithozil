import {
  AppText,
  Icon,
  ScreenBackground,
  StatusPill,
  Tappable,
  color,
  spacing,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type CrewLayoutProps = {
  title: string;
  titleTamil: string;
  onBack: () => void;
  backLabel: string;
  /** The mango pill on the right of the header (JobPlan.dc.html "Needs your OK"). */
  badge?: string;
  /** Spoken instead of the bare pill text. */
  badgeLabel?: string;
  /** Top padding of the scrolling content: 14 on Crew.dc.html, 16 elsewhere. */
  contentPaddingTop?: 14 | 16;
  /** Fixed white bar at the bottom (Crew's summary and "Find 7 workers"). */
  footer?: ReactNode;
  children: ReactNode;
  testID?: string;
};

/**
 * The frame of Crew, JobPlan, CrewTeam and CrewPayments .dc.html: a header
 * with a 44pt back button (padding 22 20 0, gap 12), scrolling content
 * (padding 14|16 20 0, gap 12) and an optional fixed footer (padding
 * 14 20 26, white, top border).
 *
 * Not PageLayout: that one has no slot for the header's status pill and a
 * fixed 16pt content padding.
 */
export function CrewLayout({
  title,
  titleTamil,
  onBack,
  backLabel,
  badge,
  badgeLabel,
  contentPaddingTop = 16,
  footer,
  children,
  testID,
}: CrewLayoutProps) {
  const insets = useSafeAreaInsets();
  return (
    <ScreenBackground>
      <StatusBar style="dark" />
      {/* Keeps the message field on Job plan above the keyboard. */}
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
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
          {badge ? (
            // `accessible` makes the pill one element, read with its label.
            <View accessible accessibilityLabel={badgeLabel ?? badge} testID={`${testID}-status`}>
              <StatusPill label={badge} tone="mango" />
            </View>
          ) : null}
        </View>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            { paddingTop: contentPaddingTop },
            // The design's bottom padding is 0. Without a footer the last link
            // would end under the gesture bar, so the inset is added then.
            { paddingBottom: footer ? 0 : insets.bottom },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {footer ? (
          <View style={[styles.footer, { paddingBottom: 26 + insets.bottom }]}>{footer}</View>
        ) : null}
      </KeyboardAvoidingView>
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
  title: { flexGrow: 1, flexShrink: 1 },
  content: {
    paddingHorizontal: spacing.screenPadding,
    gap: 12,
  },
  footer: {
    paddingTop: 14,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.border,
    gap: 10,
  },
});
