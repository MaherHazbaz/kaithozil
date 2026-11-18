import { AppText, ScreenBackground, color, type as typeStyle } from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type StateLayoutProps = {
  /** Tab-style title above the content (EmptyState.dc.html). The other states have none. */
  header?: { title: string; titleTamil: string };
  /** Fixed white bar at the bottom for the buttons. */
  footer?: ReactNode;
  children: ReactNode;
};

/**
 * The frame shared by the five system-state screens (design/source/NoInternet,
 * ErrorState, EmptyState, UpdateApp and Maintenance .dc.html): content centred
 * in a scrolling area, an optional header and a fixed bottom bar.
 */
export function StateLayout({ header, footer, children }: StateLayoutProps) {
  // Safe-area insets are the status bar and the gesture/navigation bar. They
  // are ADDED to the design's padding, never instead of it.
  const insets = useSafeAreaInsets();
  return (
    <ScreenBackground>
      <StatusBar style="dark" />
      {header ? (
        <View style={[styles.header, { paddingTop: HEADER_TOP + insets.top }]}>
          <AppText
            size={typeStyle.screenTitle.size}
            weight={typeStyle.screenTitle.weight}
            accessibilityRole="header"
          >
            {header.title}
          </AppText>
          <AppText size={12} color={color.muted}>
            {header.titleTamil}
          </AppText>
        </View>
      ) : null}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: CONTENT_TOP + (header ? 0 : insets.top),
            paddingBottom: CONTENT_BOTTOM + (footer ? 0 : insets.bottom),
          },
        ]}
      >
        {children}
      </ScrollView>
      {footer ? (
        <View style={[styles.footer, { paddingBottom: FOOTER_BOTTOM + insets.bottom }]}>
          {footer}
        </View>
      ) : null}
    </ScreenBackground>
  );
}

const HEADER_TOP = 22;
const CONTENT_TOP = 40;
const CONTENT_BOTTOM = 12;
const FOOTER_BOTTOM = 26;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    gap: 2,
  },
  scroll: { flex: 1 },
  // CSS `justify-content: safe center`: centred while it fits, top-aligned
  // and scrollable when it doesn't. `flexGrow: 1` lets the content fill the
  // scroll area so centring has room to work; once the content is taller, it
  // simply starts at the top.
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 22,
  },
  footer: {
    paddingTop: 14,
    paddingHorizontal: 20,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.border,
    gap: 10,
  },
});
