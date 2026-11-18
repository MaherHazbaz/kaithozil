import { AppText, Card, color } from '@kaithozhil/ui';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { requestSentCopy as copy } from '../copy';
import type { BookingRequest, BookingSlot } from '../types';

/** Job, When, Where and Estimate, as on the waiting and accepted outcomes. */
export function BookingSummary({ request, slot }: { request: BookingRequest; slot: BookingSlot }) {
  return (
    <SummaryCard>
      <SummaryRow label={copy.summary.job} value={request.job} detail={request.trade} />
      <SummaryRow label={copy.summary.when} value={copy.slot(slot.day, slot.time)} />
      <SummaryRow label={copy.summary.where} value={request.address} />
      <SummaryRow
        label={copy.summary.estimate}
        value={request.estimate}
        detail={copy.summary.estimateNote}
      />
    </SummaryCard>
  );
}

/** The white card the summary rows sit in (padding 4 14, rows 10 apart). */
export function SummaryCard({ children }: { children: ReactNode }) {
  return <Card style={styles.card}>{children}</Card>;
}

export type SummaryRowProps = {
  label: string;
  value: string;
  /** Small grey line under the value. */
  detail?: string;
  /** The slot the worker could not make: grey and struck through. */
  struck?: boolean;
};

/** Label on the left, value on the right, divider below (every row, the last one too). */
export function SummaryRow({ label, value, detail, struck = false }: SummaryRowProps) {
  return (
    <View style={styles.row}>
      <AppText size={13} color={color.muted} style={styles.label}>
        {label}
      </AppText>
      <View style={styles.value}>
        <AppText
          size={13}
          weight={700}
          color={struck ? color.muted : color.ink}
          align="right"
          style={struck ? styles.struck : null}
        >
          {value}
        </AppText>
        {detail ? (
          <AppText size={11} color={color.muted} align="right">
            {detail}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 4, paddingHorizontal: 14, gap: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  label: { flexShrink: 0 },
  // A long address wraps instead of pushing the label off the card.
  value: { flexShrink: 1, alignItems: 'flex-end' },
  struck: { textDecorationLine: 'line-through' },
});
