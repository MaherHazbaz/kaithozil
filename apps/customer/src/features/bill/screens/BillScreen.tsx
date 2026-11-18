import { formatRupees } from '@kaithozhil/core';
import { AppText, Avatar, Card, Icon, InfoNote, PrimaryButton, color } from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { PhotoPlaceholderGrid } from '@/components/PhotoPlaceholderGrid';
import { useAsyncAction } from '@/hooks/useAsyncAction';

import { billTotal, formatRupeeRange, isWithinEstimate } from '../billMoney';
import { TextButton } from '../components/TextButton';
import { billCopy as copy } from '../copy';
import type { JobBill } from '../types';

export type BillScreenProps = {
  bill: JobBill;
  onBack: () => void;
  /**
   * "Looks right, pay …": records that the customer accepted the bill, then
   * opens Pay and rate. Rejects to stay on the bill.
   */
  onApprove: () => Promise<void>;
  /** "Report a problem" in the note shown after "Something's not right". */
  onReportProblem?: () => void;
  /** Starts with the note open (for tests and review). */
  initialFlagged?: boolean;
};

/**
 * Customer · Check the bill (design/source/BillApprove.dc.html). The worker
 * has finished; the customer checks the itemised bill and the photos before
 * paying, or says something is wrong.
 */
export function BillScreen({
  bill,
  onBack,
  onApprove,
  onReportProblem,
  initialFlagged = false,
}: BillScreenProps) {
  const [flagged, setFlagged] = useState(initialFlagged);
  const { busy, run } = useAsyncAction();
  const totalRupees = billTotal(bill.lines);
  const total = formatRupees(totalRupees);
  const { worker } = bill;

  const footer = (
    <>
      <PrimaryButton
        label={copy.pay(total)}
        disabled={busy}
        onPress={() => void run(onApprove)}
        testID="bill-pay"
      />
      {flagged ? (
        <TextButton label={copy.unflag} onPress={() => setFlagged(false)} testID="bill-unflag" />
      ) : (
        <TextButton
          label={copy.flag}
          tone="ink"
          onPress={() => setFlagged(true)}
          testID="bill-flag"
        />
      )}
    </>
  );

  return (
    <PageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
      footer={footer}
    >
      <Card style={styles.worker}>
        <Avatar initials={worker.initials} tone="mango" />
        <View style={styles.workerText}>
          <AppText size={15} weight={800}>
            {copy.finished(worker.firstName)}
          </AppText>
          <AppText size={12} color={color.muted}>
            {copy.jobLine(bill.service, bill.jobId, bill.workTime)}
          </AppText>
        </View>
      </Card>

      {/* The source sets `gap: 10px; padding: 14px`, then `gap: 0; padding: 6px 14px`; the last ones win. */}
      <Card style={styles.bill}>
        <AppText size={14} weight={800} accessibilityRole="header" style={styles.billHeading}>
          {copy.billHeading}
        </AppText>
        {bill.lines.map((line) => (
          // One element for screen readers: "Labour, ₹450".
          <View
            key={line.label}
            style={styles.line}
            accessible
            accessibilityLabel={`${line.label}, ${formatRupees(line.amountRupees)}`}
          >
            <AppText size={13} color={color.muted} style={styles.shrink}>
              {line.label}
            </AppText>
            <AppText size={13} weight={800}>
              {formatRupees(line.amountRupees)}
            </AppText>
          </View>
        ))}
        <View style={styles.totalRow} accessible>
          <AppText size={15} weight={800}>
            {copy.total}
          </AppText>
          <AppText size={26} weight={800} color={color.purple} testID="bill-total">
            {total}
          </AppText>
        </View>
        {/* The design only draws the "within" case; nothing is shown otherwise (see the report). */}
        {isWithinEstimate(totalRupees, bill.estimate) ? (
          <View style={styles.estimate}>
            <Icon name="check" size={14} color={color.purple} strokeWidth={3} />
            <AppText size={12} weight={700} color={color.purple} style={styles.shrink}>
              {copy.withinEstimate(formatRupeeRange(bill.estimate))}
            </AppText>
          </View>
        ) : null}
      </Card>

      {bill.photoCount > 0 ? (
        <View style={styles.photos}>
          <AppText size={14} weight={800} accessibilityRole="header">
            {copy.photosHeading}
          </AppText>
          <PhotoPlaceholderGrid
            iconSize={24}
            labels={Array.from({ length: bill.photoCount }, (_, i) => copy.photoLabel(i + 1))}
          />
        </View>
      ) : null}

      {flagged ? (
        <InfoNote tone="warning" icon="alertCircle">
          <AppText weight={700}>{copy.flaggedLead}</AppText>
          {copy.flaggedBody(worker.firstName)}
          <AppText
            weight={800}
            color={color.purple}
            onPress={onReportProblem}
            accessibilityRole="link"
            testID="bill-report"
          >
            {copy.reportProblem}
          </AppText>
        </InfoNote>
      ) : null}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  shrink: { flexShrink: 1 },
  worker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    flexShrink: 0,
  },
  workerText: { flexGrow: 1, flexShrink: 1, gap: 2 },
  bill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexShrink: 0,
  },
  billHeading: { paddingVertical: 6 },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // Lines up the small "Total" with the bottom of the large amount.
    alignItems: 'baseline',
    paddingTop: 10,
    paddingBottom: 4,
  },
  estimate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 8,
  },
  photos: { gap: 8, flexShrink: 0 },
});
