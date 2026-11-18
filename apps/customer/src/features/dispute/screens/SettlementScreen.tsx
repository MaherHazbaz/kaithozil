import { formatRupees } from '@kaithozhil/core';
import {
  AppText,
  Card,
  Icon,
  InfoNote,
  PrimaryButton,
  Ripple,
  Tappable,
  color,
  fontFamily,
  radius,
} from '@kaithozhil/ui';
import { StyleSheet, TextInput, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { useAsyncAction } from '@/features/quote/hooks/useAsyncAction';
import { AmountRow, JobLine, Outcome, TextLink } from '../components/Parts';
import { settleCopy as copy } from '../copy';
import { amountDueRupees, totalForJobRupees, workValueRupees } from '../disputeMoney';
import { useSettlement } from '../hooks/useSettlement';
import type {
  DisputeJob,
  SettlementOffer,
  SettlementPlan,
  SettlementState,
  SettlementTerms,
} from '../types';

const PLANS: readonly SettlementPlan[] = ['endNow', 'finish'];

export type SettlementScreenProps = {
  job: DisputeJob;
  terms: SettlementTerms;
  /** Default "propose". The server says when an offer is out or agreed. */
  initialState?: SettlementState;
  onBack: () => void;
  /** Sends the offer to the worker. Resolves once recorded; rejects to stay on the form. */
  onSendOffer: (offer: SettlementOffer) => Promise<void>;
  /** Asks Kaithozhil to review. Resolves once the case is opened; rejects to stay here. */
  onAskReview: () => Promise<void>;
  /** After the review is requested: Dispute status. */
  onReviewOpened: () => void;
  /**
   * Pays the agreed amount. PAYMENTS ARE NOT BUILT: the method (gateway or
   * direct UPI) waits on the owner's decision, so the route resolves this
   * without doing anything.
   */
  onPay: (amountRupees: number) => Promise<void>;
};

/** Shared · Settle the payment, customer side (design/source/Settlement.dc.html). */
export function SettlementScreen({
  job,
  terms,
  initialState = { view: 'propose' },
  onBack,
  onSendOffer,
  onAskReview,
  onReviewOpened,
  onPay,
}: SettlementScreenProps) {
  const settlement = useSettlement(terms, initialState);
  const { busy, run } = useAsyncAction();
  const worker = job.workerFirstName;
  const { state } = settlement;

  // The server sends these figures; this only shows them.
  const value = workValueRupees(terms.quoteRupees, terms.donePercent);
  const due = amountDueRupees(value, terms.paidRupees);

  const send = () => {
    const offer = { plan: settlement.plan, amountRupees: settlement.amountRupees };
    void run(async () => {
      await onSendOffer(offer);
      settlement.setState({ view: 'sent', offer });
    });
  };
  const askReview = () => {
    void run(async () => {
      await onAskReview();
      onReviewOpened();
    });
  };

  const offerText = formatRupees(settlement.amountRupees);
  const totalText = formatRupees(totalForJobRupees(terms.paidRupees, settlement.amountRupees));

  return (
    <PageLayout title={copy.title} titleTamil={copy.titleTamil} onBack={onBack}>
      <JobLine job={job} />

      <Card style={styles.terms}>
        <AmountRow label={copy.quoteRow} value={formatRupees(terms.quoteRupees)} />
        <AmountRow
          label={copy.doneRow}
          labelDetail={copy.doneRowDetail}
          value={copy.doneValue(terms.donePercent)}
        />
        <AmountRow label={copy.valueRow} value={formatRupees(value)} />
        <AmountRow
          label={copy.paidRow}
          labelDetail={terms.paidNote}
          value={copy.minus(formatRupees(terms.paidRupees))}
        />
        <View style={styles.dueRow} accessible>
          <AppText size={14} weight={800} style={styles.shrink}>
            {copy.dueRow}
          </AppText>
          <AppText size={20} weight={800} color={color.purple} testID="settle-due">
            {formatRupees(due)}
          </AppText>
        </View>
      </Card>

      {state.view === 'propose' ? (
        <>
          <AppText size={15} weight={800} accessibilityRole="header">
            {copy.chooseHeading}
          </AppText>
          <View
            style={styles.options}
            accessibilityRole="radiogroup"
            accessibilityLabel={copy.optionsLabel}
          >
            {PLANS.map((plan) => {
              const checked = settlement.plan === plan;
              const option = copy.options[plan];
              return (
                <Tappable
                  key={plan}
                  onPress={() => settlement.choosePlan(plan)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked }}
                  accessibilityLabel={`${option.title(worker)}. ${option.detail(worker)}`}
                  style={[styles.option, checked ? styles.optionOn : styles.optionOff]}
                  testID={`settle-plan-${plan}`}
                >
                  <View style={styles.optionText}>
                    <AppText size={15} weight={800}>
                      {option.title(worker)}
                    </AppText>
                    <AppText size={12} color={color.muted}>
                      {option.detail(worker)}
                    </AppText>
                  </View>
                  <View style={[styles.dot, checked ? styles.dotOn : styles.dotOff]} />
                </Tappable>
              );
            })}
          </View>

          <View style={styles.offerRow}>
            <View style={styles.shrink}>
              <AppText size={14} weight={700}>
                {copy.offerLabel}
              </AppText>
              <AppText size={11} color={color.muted}>
                {copy.offerDetail}
              </AppText>
            </View>
            <View style={styles.offerBox}>
              <AppText size={15} weight={800} color={color.muted}>
                {copy.rupee}
              </AppText>
              <TextInput
                value={String(settlement.amountRupees)}
                onChangeText={settlement.typeAmount}
                // Opens the number pad; the parser still drops anything that is not a digit.
                keyboardType="number-pad"
                accessibilityLabel={`${copy.offerLabel}, ${copy.offerDetail}`}
                maxFontSizeMultiplier={1.3}
                style={styles.offerInput}
                testID="settle-amount"
              />
            </View>
          </View>

          <InfoNote tone="info" icon="lock">
            {copy.offerNoteBefore(worker)}
            <AppText weight={700}>{offerText}</AppText>
            {copy.offerNoteMiddle}
            <AppText weight={700}>{totalText}</AppText>
            {copy.offerNoteAfter}
          </InfoNote>

          <PrimaryButton
            label={copy.send(worker)}
            disabled={busy}
            onPress={send}
            testID="settle-send"
          />
          <TextLink
            label={copy.askReview}
            disabled={busy}
            onPress={askReview}
            testID="settle-review"
          />
        </>
      ) : null}

      {state.view === 'sent' ? (
        <>
          <Outcome
            paddingTop={20}
            icon={
              <View style={styles.rippleBox}>
                {/* Waves spread from behind the disc; hidden when reduce motion is on. */}
                <Ripple kind="waitingRipple" size={WAITING_DISC} color={color.waveGold} />
                <View style={styles.waitingDisc}>
                  <Icon name="clock" size={40} color={color.mangoText} />
                </View>
              </View>
            }
          >
            <AppText size={20} weight={800} align="center" accessibilityRole="header">
              {copy.sentTitle(worker)}
            </AppText>
            <AppText size={14} lineHeight={14 * 1.5} align="center" style={styles.body}>
              {copy.sentBody(
                copy.planText[state.offer.plan](worker),
                formatRupees(state.offer.amountRupees),
                worker,
              )}
            </AppText>
          </Outcome>
          <TextLink
            label={copy.noReply}
            disabled={busy}
            onPress={askReview}
            testID="settle-no-reply"
          />
        </>
      ) : null}

      {state.view === 'agreed' ? (
        <>
          <View style={styles.agreed}>
            <View style={styles.agreedRow}>
              <View style={styles.tick}>
                <Icon name="check" size={14} color={color.white} strokeWidth={3} />
              </View>
              <View style={styles.shrink}>
                <AppText size={13} weight={700} accessibilityRole="header">
                  {copy.agreedTitle(state.agreedAt)}
                </AppText>
                <AppText size={11} color={color.muted}>
                  {copy.planText[state.offer.plan](worker)}
                </AppText>
              </View>
            </View>
            <AppText size={13} lineHeight={13 * 1.45}>
              {copy.payBefore}
              <AppText weight={700}>{formatRupees(state.offer.amountRupees)}</AppText>
              {copy.payAfter}
            </AppText>
          </View>
          <PrimaryButton
            label={copy.pay(formatRupees(state.offer.amountRupees))}
            disabled={busy}
            onPress={() => {
              void run(() => onPay(state.offer.amountRupees));
            }}
            testID="settle-pay"
          />
        </>
      ) : null}
    </PageLayout>
  );
}

const DOT = 22;
const WAITING_DISC = 88;
/** The design's 167pt box: room for the waves to spread (88 x 1.9). */
const RIPPLE_BOX = 167;
const TICK = 24;

const styles = StyleSheet.create({
  shrink: { flexShrink: 1 },
  terms: { paddingVertical: 6, paddingHorizontal: 14 },
  dueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  options: { gap: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.noteLarge,
  },
  optionOn: { backgroundColor: color.lavender, borderWidth: 2, borderColor: color.purple },
  optionOff: { backgroundColor: color.white, borderWidth: 1, borderColor: color.borderStrong },
  optionText: { flex: 1, gap: 2 },
  dot: {
    width: DOT,
    height: DOT,
    flexShrink: 0,
    borderRadius: DOT / 2,
    backgroundColor: color.white,
  },
  dotOn: { borderWidth: 7, borderColor: color.purple },
  dotOff: { borderWidth: 2, borderColor: color.borderStrong },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  offerBox: {
    width: 150,
    height: 48,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    paddingHorizontal: 12,
  },
  offerInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    textAlign: 'right',
    fontFamily: fontFamily.body,
    fontSize: 16,
    fontWeight: '800',
    color: color.ink,
    includeFontPadding: false,
  },
  rippleBox: {
    width: RIPPLE_BOX,
    height: RIPPLE_BOX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingDisc: {
    width: WAITING_DISC,
    height: WAITING_DISC,
    borderRadius: WAITING_DISC / 2,
    backgroundColor: color.mangoTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { maxWidth: 300 },
  agreed: {
    borderWidth: 2,
    borderColor: color.purple,
    borderRadius: radius.choiceCard,
    backgroundColor: color.white,
    padding: 14,
    gap: 8,
  },
  agreedRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tick: {
    width: TICK,
    height: TICK,
    flexShrink: 0,
    borderRadius: TICK / 2,
    backgroundColor: color.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
