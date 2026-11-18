import { ScreenBackground, ScreenHeader, color, spacing } from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type PageLayoutProps = {
  title: string;
  titleTamil: string;
  onBack: () => void;
  /** Screen-reader name of the back button. Default "Back". */
  backLabel?: string;
  /** Fixed white bar at the bottom (Language's Save). */
  footer?: ReactNode;
  children: ReactNode;
};

/**
 * Frame shared by most inner screens (Language, Safety, Legal, DeleteAccount,
 * Addresses, Support… .dc.html): back-button header, scrolling content
 * (padding 16 20 0, gap 12) and an optional fixed footer.
 */
export function PageLayout({
  title,
  titleTamil,
  onBack,
  backLabel = 'Back',
  footer,
  children,
}: PageLayoutProps) {
  const insets = useSafeAreaInsets();
  return (
    <ScreenBackground>
      <StatusBar style="dark" />
      {/* Keeps text fields (Safety's new contact, the delete code) above the keyboard. */}
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScreenHeader
          title={title}
          subtitle={titleTamil}
          backLabel={backLabel}
          onBack={onBack}
          topInset={insets.top}
          testID="settings-back"
        />
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            // The design's bottom padding is 0. Without a footer the content
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

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingTop: 16,
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
