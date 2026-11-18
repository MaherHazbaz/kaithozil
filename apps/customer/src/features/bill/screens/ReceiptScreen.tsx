import { formatRupees } from '@kaithozhil/core';
import {
  AppText,
  Gradient,
  Icon,
  InfoNote,
  Logo,
  PrimaryButton,
  SecondaryButton,
  Tappable,
  color,
  radius,
  shadow,
} from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';

import { receiptCopy as copy } from '../copy';
import type { JobReceipt } from '../types';

export type ReceiptScreenProps = {
  receipt: JobReceipt;
  onBack: () => void;
  /** Fetches the receipt PDF made on the server. */
  onDownload?: () => void;
  onShare?: () => void;
  onBookAgain?: () => void;
  onHelp?: () => void;
};

/**
 * Customer · Job receipt (design/source/Receipt.dc.html). A verified UPI
 * payment, or cash marked "not verified" (the design's "Paid by" tweak).
 */
export function ReceiptScreen({
  receipt,
  onBack,
  onDownload,
  onShare,
  onBookAgain,
  onHelp,
}: ReceiptScreenProps) {
  const cash = receipt.paidBy === 'cash';
  const { worker } = receipt;
  const rows: ReceiptRowProps[] = [
    { label: copy.service, value: receipt.service, detail: receipt.trade },
    { label: copy.workDone, value: receipt.workDone },
    {
      label: copy.date,
      value: receipt.date,
      detail: copy.times(receipt.startedAt, receipt.finishedAt),
    },
    { label: copy.address, value: receipt.address },
    { label: copy.worker, value: worker.name, detail: worker.detail },
    {
      label: copy.upiReference,
      value: cash || !receipt.upi ? copy.noReference : receipt.upi.reference,
    },
  ];

  return (
    <PageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
    >
      {/* The shadow sits on this wrapper: the card clips its corners for the header and could not show it. */}
      <View style={styles.cardShadow}>
        <View style={styles.card}>
          <Gradient name="hero" style={styles.head}>
            <View style={styles.headTop}>
              <View style={styles.brand}>
                <Logo size={30} radius="payAppBadge" />
                <AppText size={15} weight={800} color={color.gold}>
                  {copy.brand}
                </AppText>
              </View>
              <AppText size={12} color={color.lavenderText} style={styles.shrink}>
                {copy.receiptNo(receipt.jobId)}
              </AppText>
            </View>
            <View style={styles.amount} accessible>
              <AppText size={12} color={color.lavenderText}>
                {cash ? copy.paidLine.cash(worker.name) : copy.paidLine.upi(worker.name)}
              </AppText>
              <AppText size={34} weight={800} color={color.white} testID="receipt-amount">
                {formatRupees(receipt.amountRupees)}
              </AppText>
            </View>
          </Gradient>

          <View style={styles.body}>
            {rows.map((row) => (
              <ReceiptRow key={row.label} {...row} />
            ))}

            {cash ? (
              <View style={styles.after}>
                <InfoNote tone="warning" icon="alertCircle">
                  <AppText weight={700}>{copy.cashLead}</AppText>
                  {copy.cashBody}
                </InfoNote>
              </View>
            ) : (
              <View style={[styles.after, styles.proofs]}>
                <View style={styles.verified} accessible>
                  <Icon name="shield" size={18} color={color.purple} />
                  <View style={styles.shrink}>
                    <AppText size={13} weight={800} color={color.purple}>
                      {copy.verifiedTitle}
                    </AppText>
                    <AppText size={11} color={color.muted}>
                      {copy.verifiedDetail(receipt.upi?.confirmedAt ?? '')}
                    </AppText>
                  </View>
                </View>
                <View style={styles.codes}>
                  <CodeTile title={copy.arrived} detail={copy.codeMatched(receipt.arrivedAt)} />
                  <CodeTile title={copy.workStarted} detail={copy.codeMatched(receipt.startedAt)} />
                </View>
              </View>
            )}
          </View>
        </View>
      </View>

      <AppText size={12} color={color.muted} align="center" lineHeight={12 * 1.4}>
        {cash ? copy.footNote.cash : copy.footNote.upi}
      </AppText>

      <View style={styles.pair}>
        <View style={styles.flex}>
          <SecondaryButton
            label={copy.download}
            icon="download"
            onPress={onDownload}
            testID="receipt-download"
          />
        </View>
        <View style={styles.flex}>
          <SecondaryButton
            label={copy.share}
            icon="share"
            onPress={onShare}
            testID="receipt-share"
          />
        </View>
      </View>

      <PrimaryButton
        label={copy.bookAgain(worker.firstName)}
        onPress={onBookAgain}
        testID="receipt-book-again"
      />

      <Tappable
        onPress={onHelp}
        accessibilityRole="link"
        accessibilityLabel={copy.help}
        style={styles.help}
        testID="receipt-help"
      >
        <Icon name="helpCircle" size={18} color={color.purple} />
        <AppText size={14} weight={700} color={color.purple}>
          {copy.help}
        </AppText>
      </Tappable>
    </PageLayout>
  );
}

type ReceiptRowProps = { label: string; value: string; detail?: string };

/** A label and a right-aligned value over a dashed divider (padding 9 0, text 13). */
function ReceiptRow({ label, value, detail }: ReceiptRowProps) {
  return (
    <View accessible accessibilityLabel={[label, value, detail].filter(Boolean).join(', ')}>
      <View style={styles.row}>
        <AppText size={13} color={color.muted} style={styles.rowLabel}>
          {label}
        </AppText>
        <View style={styles.rowValue}>
          <AppText size={13} weight={700} align="right">
            {value}
          </AppText>
          {detail ? (
            <AppText size={11} color={color.muted} align="right">
              {detail}
            </AppText>
          ) : null}
        </View>
      </View>
      <DashedDivider />
    </View>
  );
}

/**
 * A 1pt dashed line. WHY not `borderBottomWidth` with `borderStyle: 'dashed'`:
 * React Native draws dashes reliably only when all four sides have the same
 * border, so this draws a dashed box and clips everything but its top edge.
 */
function DashedDivider() {
  return (
    <View style={styles.dashClip}>
      <View style={styles.dashBox} />
    </View>
  );
}

function CodeTile({ title, detail }: { title: string; detail: string }) {
  return (
    <View style={styles.codeTile} accessible>
      <AppText size={12} weight={800} color={color.purple}>
        {title}
      </AppText>
      <AppText size={11} color={color.muted}>
        {detail}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  shrink: { flexShrink: 1 },
  cardShadow: {
    borderRadius: radius.receiptCard,
    boxShadow: shadow.card,
    flexShrink: 0,
  },
  card: {
    backgroundColor: color.white,
    borderRadius: radius.receiptCard,
    borderWidth: 1,
    borderColor: color.borderSoft,
    overflow: 'hidden',
  },
  head: { padding: 16, gap: 10 },
  headTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amount: { gap: 2 },
  body: {
    paddingTop: 6,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 9,
  },
  rowLabel: { flexShrink: 0 },
  rowValue: { flexShrink: 1, alignItems: 'flex-end' },
  dashClip: { height: 1, overflow: 'hidden' },
  dashBox: {
    height: 2,
    // Pulls the box's side borders outside the clip so only the top edge shows.
    marginHorizontal: -1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: color.borderStrong,
  },
  after: { paddingTop: 12 },
  proofs: { gap: 8 },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: color.lavender,
    borderRadius: radius.codeDigit,
    padding: 10,
  },
  // Two equal columns (the design's 2-column grid).
  codes: { flexDirection: 'row', gap: 8 },
  codeTile: {
    flex: 1,
    backgroundColor: color.lavender,
    borderRadius: radius.codeDigit,
    padding: 10,
    gap: 2,
  },
  pair: { flexDirection: 'row', gap: 8 },
  help: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
