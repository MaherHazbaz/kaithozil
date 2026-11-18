import { formatRupees } from '@kaithozhil/core';
import {
  AppText,
  Avatar,
  Card,
  Gradient,
  Icon,
  PrimaryButton,
  SecondaryButton,
  Tappable,
  color,
  radius,
  shadow,
} from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BadgePageLayout } from '../components/BadgePageLayout';
import { DetailRow, LockNote } from '../components/Parts';
import { quoteCopy as copy } from '../copy';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { paymentStages, quoteTotal } from '../quoteMoney';
import type { Quote, QuoteStatus } from '../types';

export type QuoteScreenProps = {
  quote: Quote;
  /** Default "open". Tests and the route can show the other states. */
  initialStatus?: QuoteStatus;
  onBack: () => void;
  onOpenWorker?: () => void;
  /**
   * Accepts the quote on the server. Resolves when it is recorded; rejects
   * to stay on the open quote. It takes no money: paying the start amount
   * happens later, when the worker arrives.
   */
  onAccept: () => Promise<void>;
  onDecline: () => Promise<void>;
  /** "Undo" after declining: reopens the quote on the server. */
  onReopen: () => Promise<void>;
  onAsk?: () => void;
  onCompare?: () => void;
  onSeeProgress?: () => void;
};

/** Customer · Your quote (design/source/QuoteView.dc.html). */
export function QuoteScreen({
  quote,
  initialStatus = 'open',
  onBack,
  onOpenWorker,
  onAccept,
  onDecline,
  onReopen,
  onAsk,
  onCompare,
  onSeeProgress,
}: QuoteScreenProps) {
  const [status, setStatus] = useState<QuoteStatus>(initialStatus);
  const { busy, run } = useAsyncAction();
  const { worker } = quote;

  const total = quoteTotal(quote.lines);
  const [start, completion] = paymentStages(total, quote.atStartRupees);
  const atStartText = formatRupees(start.amountRupees);
  const onCompletionText = formatRupees(completion.amountRupees);

  const change = (action: () => Promise<void>, next: QuoteStatus) => {
    void run(async () => {
      await action();
      setStatus(next);
    });
  };

  return (
    <BadgePageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
      badge={quote.validity}
      badgeTone="mango"
      badgeLabel={copy.validityLabel(quote.validity)}
      testID="quote"
    >
      <Card
        onPress={onOpenWorker}
        accessibilityLabel={`${worker.name}, ${copy.verified}. ${worker.role}★ ${worker.rating}${copy.visited(worker.visitedOn)}`}
        style={styles.worker}
        testID="quote-worker"
      >
        <Avatar initials={worker.initials} size={48} fontSize={15} />
        <View style={styles.workerText}>
          <View style={styles.workerName}>
            <AppText size={16} weight={800}>
              {worker.name}
            </AppText>
            <Icon name="badgeCheck" size={16} color={color.purple} strokeWidth={2.2} />
          </View>
          <AppText size={12} color={color.muted}>
            {worker.role}
            <AppText weight={700} color={color.star}>
              ★ {worker.rating}
            </AppText>
            {copy.visited(worker.visitedOn)}
          </AppText>
        </View>
        <Icon name="chevronRight" size={18} color={color.muted} />
      </Card>

      {/* Shadow on the outer view; the inner one clips the purple top to the corners. */}
      <View style={styles.quoteShadow}>
        <View style={styles.quoteCard}>
          <Gradient name="hero" style={styles.quoteTop}>
            <View style={styles.quoteTotal}>
              <AppText size={12} color={color.lavenderText}>
                {quote.summary}
              </AppText>
              <AppText size={30} weight={800} color={color.white} testID="quote-total">
                {formatRupees(total)}
              </AppText>
            </View>
            <AppText size={12} color={color.lavenderText} align="right">
              {copy.durationFrom(quote.duration, quote.startsOn)}
            </AppText>
          </Gradient>
          <View style={styles.lines}>
            {quote.lines.map((line) => (
              <DetailRow
                key={line.label}
                variant="quote"
                label={line.label}
                value={formatRupees(line.amountRupees)}
                valueDetail={line.detail}
              />
            ))}
            <DetailRow
              variant="quote"
              label={copy.paymentPlan}
              value={quote.planName}
              valueDetail={copy.stages(atStartText, onCompletionText)}
            />
          </View>
        </View>
      </View>

      {quote.note ? (
        <View style={styles.bubble}>
          <AppText size={11} weight={700} color={color.muted}>
            {worker.firstName}
          </AppText>
          <AppText size={14} lineHeight={14 * 1.4}>
            {quote.note}
          </AppText>
        </View>
      ) : null}

      <LockNote>{copy.directUpiNote(worker.firstName)}</LockNote>

      {status === 'open' ? (
        <>
          <PrimaryButton
            label={copy.accept}
            disabled={busy}
            onPress={() => change(onAccept, 'accepted')}
            testID="quote-accept"
          />
          <View style={styles.pair}>
            <View style={styles.flex}>
              <SecondaryButton
                label={copy.ask(worker.firstName)}
                icon="messageSquare"
                onPress={onAsk}
                testID="quote-ask"
              />
            </View>
            <View style={styles.flex}>
              <SecondaryButton
                label={copy.decline}
                tone="ink"
                disabled={busy}
                onPress={() => change(onDecline, 'declined')}
                testID="quote-decline"
              />
            </View>
          </View>
          <Tappable
            onPress={onCompare}
            accessibilityRole="link"
            style={styles.textLink}
            testID="quote-compare"
          >
            <AppText size={13} weight={700} color={color.purple}>
              {copy.compare}
            </AppText>
          </Tappable>
        </>
      ) : null}

      {status === 'accepted' ? (
        <>
          <View style={styles.accepted}>
            <View style={styles.acceptedTitle}>
              <Icon name="check" size={20} color={color.purple} strokeWidth={3} />
              <AppText size={16} weight={800} color={color.purple} accessibilityRole="header">
                {copy.acceptedTitle}
              </AppText>
            </View>
            <AppText size={13} lineHeight={13 * 1.45}>
              {copy.acceptedStarts(worker.firstName)}
              <AppText weight={700}>{quote.startsOn}</AppText>
              {copy.acceptedRest(atStartText)}
            </AppText>
          </View>
          <PrimaryButton label={copy.seeProgress} onPress={onSeeProgress} testID="quote-progress" />
        </>
      ) : null}

      {status === 'declined' ? (
        <>
          <Card style={styles.declined}>
            <AppText size={16} weight={800} align="center" accessibilityRole="header">
              {copy.declinedTitle}
            </AppText>
            <AppText size={13} color={color.muted} align="center">
              {copy.declinedBody(worker.firstName)}
            </AppText>
          </Card>
          <View style={styles.pair}>
            <View style={styles.flex}>
              <SecondaryButton
                label={copy.askOthers}
                onPress={onCompare}
                testID="quote-ask-others"
              />
            </View>
            <View style={styles.flex}>
              <SecondaryButton
                label={copy.undo}
                tone="ink"
                disabled={busy}
                onPress={() => change(onReopen, 'open')}
                testID="quote-undo"
              />
            </View>
          </View>
        </>
      ) : null}
    </BadgePageLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  worker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  workerText: {
    flexGrow: 1,
    flexShrink: 1,
    gap: 2,
  },
  workerName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  quoteShadow: {
    borderRadius: radius.tile,
    boxShadow: shadow.card,
  },
  quoteCard: {
    borderRadius: radius.tile,
    borderWidth: 1,
    borderColor: color.borderSoft,
    backgroundColor: color.white,
    overflow: 'hidden',
  },
  quoteTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  quoteTotal: { gap: 2 },
  lines: {
    paddingTop: 4,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  // The design's `box-shadow` on this bubble is not valid CSS, so the browser
  // draws it without a shadow and with the card's 20pt corners. Matched as drawn.
  bubble: {
    alignSelf: 'flex-start',
    maxWidth: '92%',
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.borderSoft,
    borderRadius: radius.card,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 3,
  },
  pair: {
    flexDirection: 'row',
    gap: 8,
  },
  textLink: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accepted: {
    borderWidth: 2,
    borderColor: color.purple,
    borderRadius: radius.card,
    backgroundColor: color.white,
    padding: 14,
    gap: 6,
  },
  acceptedTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  declined: {
    padding: 14,
    gap: 10,
    alignItems: 'center',
  },
});
