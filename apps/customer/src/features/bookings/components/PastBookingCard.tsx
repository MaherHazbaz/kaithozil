import { formatRupees } from '@kaithozhil/core';
import { AppText, Card, IconBox, SecondaryButton, color, type as typeStyle } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { bookingsCopy } from '../copy';
import type { PastBooking } from '../types';

export type PastBookingCardProps = {
  booking: PastBooking;
  onBookAgain?: () => void;
  onGetHelp?: () => void;
  testID?: string;
};

/** One finished job with its amount, and Book again / Get help buttons. */
export function PastBookingCard({ booking, onBookAgain, onGetHelp, testID }: PastBookingCardProps) {
  return (
    <Card style={styles.card} testID={testID}>
      <View style={styles.summary}>
        <IconBox icon={booking.icon} tone="neutral" size={36} />
        <View style={styles.text}>
          <AppText size={14} weight={700}>
            {booking.title}
          </AppText>
          <AppText size={12} color={color.muted}>
            {booking.detail}
          </AppText>
        </View>
        <View style={styles.amount}>
          <AppText size={typeStyle.cardTitle.size} weight={typeStyle.cardTitle.weight}>
            {formatRupees(booking.amountRupees)}
          </AppText>
          <AppText size={12} weight={700} color={color.purple}>
            {bookingsCopy.paid}
          </AppText>
        </View>
      </View>
      <View style={styles.actions}>
        <View style={styles.action}>
          <SecondaryButton
            label={bookingsCopy.bookAgain}
            // Screen readers hear which job each button belongs to.
            accessibilityLabel={`${bookingsCopy.bookAgain}: ${booking.title}`}
            height={44}
            onPress={onBookAgain}
            testID={testID ? `${testID}-book-again` : undefined}
          />
        </View>
        <View style={styles.action}>
          <SecondaryButton
            label={bookingsCopy.getHelp}
            accessibilityLabel={`${bookingsCopy.getHelp}: ${booking.title}`}
            height={44}
            tone="ink"
            onPress={onGetHelp}
            testID={testID ? `${testID}-get-help` : undefined}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    flexGrow: 1,
    flexShrink: 1,
  },
  amount: {
    alignItems: 'flex-end',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  action: {
    flex: 1,
  },
});
