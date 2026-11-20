import {
  AppText,
  BottomNav,
  ScreenBackground,
  SegmentedControl,
  color,
  spacing,
  type as typeStyle,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CUSTOMER_TABS, type CustomerTab } from '@/features/navigation/customerTabs';
import { EmptyStateScreen } from '@/features/system/screens/EmptyStateScreen';

import { PastBookingCard } from '../components/PastBookingCard';
import { UpcomingBookingCard } from '../components/UpcomingBookingCard';
import { bookingsCopy } from '../copy';
import type { BookingsTab, PastBooking, UpcomingBooking } from '../types';

export type BookingsScreenProps = {
  /** Shown data. The route passes the design's sample values until Supabase exists (Sprint 2). */
  upcoming: readonly UpcomingBooking[];
  past: readonly PastBooking[];
  /** Which list shows first. Default: upcoming, as in the design. */
  initialTab?: BookingsTab;
  onOpenBooking?: (id: string) => void;
  onViewReceipt?: (id: string) => void;
  onGetHelp?: (id: string) => void;
  onTab?: (tab: CustomerTab) => void;
  /** "Book a worker" on the empty state. */
  onBookWorker?: () => void;
};

/** Your bookings (design/source/Bookings.dc.html). */
export function BookingsScreen({
  upcoming,
  past,
  initialTab = 'upcoming',
  onOpenBooking,
  onViewReceipt,
  onGetHelp,
  onTab,
  onBookWorker,
}: BookingsScreenProps) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<BookingsTab>(initialTab);

  // No bookings at all: Shared · Empty list (EmptyState.dc.html), which the
  // design draws without the Upcoming/Past switch and the bottom navigation.
  // (Hooks above run first: React needs the same hooks on every render.)
  if (upcoming.length === 0 && past.length === 0) {
    return <EmptyStateScreen kind="bookings" onAction={onBookWorker} />;
  }

  return (
    <ScreenBackground>
      {/* Dark status bar icons over the light page. */}
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: 22 + insets.top }]}>
        <AppText
          size={typeStyle.screenTitle.size}
          weight={typeStyle.screenTitle.weight}
          accessibilityRole="header"
        >
          {bookingsCopy.title}
        </AppText>
        <AppText size={12} color={color.muted}>
          {bookingsCopy.titleTamil}
        </AppText>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <SegmentedControl
          segments={[
            { key: 'upcoming', label: bookingsCopy.upcomingTab(upcoming.length) },
            { key: 'past', label: bookingsCopy.pastTab(past.length) },
          ]}
          selectedKey={tab}
          onSelect={setTab}
          accessibilityLabel={bookingsCopy.showLabel}
          testID="bookings-tab"
        />

        {tab === 'upcoming' ? (
          <View style={styles.list}>
            {upcoming.map((booking) => (
              <UpcomingBookingCard
                key={booking.id}
                booking={booking}
                onPress={() => onOpenBooking?.(booking.id)}
                testID={`booking-${booking.id}`}
              />
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            <AppText
              size={typeStyle.cardTitle.size}
              weight={typeStyle.cardTitle.weight}
              accessibilityRole="header"
              style={styles.pastHeading}
            >
              {bookingsCopy.pastHeading}
            </AppText>
            {past.map((booking) => (
              <PastBookingCard
                key={booking.id}
                booking={booking}
                onViewReceipt={() => onViewReceipt?.(booking.id)}
                onGetHelp={() => onGetHelp?.(booking.id)}
                testID={`booking-${booking.id}`}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <BottomNav
        items={CUSTOMER_TABS}
        activeKey="bookings"
        onSelect={(next) => onTab?.(next)}
        bottomInset={insets.bottom}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.screenPadding,
  },
  scroll: {
    flex: 1,
  },
  body: {
    paddingTop: 16,
    paddingHorizontal: spacing.screenPadding,
    // Room for the last card's shadow above the bottom navigation.
    paddingBottom: 16,
    gap: spacing.gapM,
  },
  list: {
    gap: spacing.gapM,
  },
  pastHeading: {
    paddingTop: 4,
  },
});
