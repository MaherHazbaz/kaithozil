import { formatRupees } from '@kaithozhil/core';
import {
  AppText,
  Card,
  Icon,
  InfoNote,
  PrimaryButton,
  Ripple,
  ScreenBackground,
  SecondaryButton,
  Tappable,
  color,
  radius,
  spacing,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAsyncAction } from '@/hooks/useAsyncAction';

import { RatingCard } from '../components/RatingCard';
import { SampleQrCode } from '../components/SampleQrCode';
import { TextButton } from '../components/TextButton';
import { payCopy as copy } from '../copy';
import { usePayFlow, type PayFlowActions } from '../hooks/usePayFlow';
import { useJobFeedback } from '../hooks/useJobFeedback';
import type { JobFeedback } from '../jobFeedback';
import { canRate, type PayView } from '../payFlow';

export type PayScreenProps = PayFlowActions & {
  worker: { name: string; firstName: string };
  /** e.g. "Fan repair + new regulator". */
  workDone: string;
  /** e.g. "KT-20481". */
  jobId: string;
  /** Whole rupees, as the server billed it. */
  amountRupees: number;
  /** Starting rating and chips. Unrated by default; tests pass the design's 4 stars. */
  initialFeedback?: Partial<JobFeedback>;
  /** Starting state, for tests and review. Default "choose". */
  initialView?: PayView;
  onViewReceipt?: () => void;
  /** "Done": saves the rating, then leaves. Rejects to stay. */
  onDone: (feedback: JobFeedback) => Promise<void>;
};

/**
 * Customer · Pay and rate, v3 (design/source/Pay.dc.html): pay through the
 * payment partner by UPI app or QR, wait for the bank, then rate. Cash is
 * possible but recorded as "not verified".
 */
export function PayScreen({
  worker,
  workDone,
  jobId,
  amountRupees,
  initialFeedback,
  initialView,
  onStartPayment,
  onConfirmCash,
  onViewReceipt,
  onDone,
}: PayScreenProps) {
  const insets = useSafeAreaInsets();
  const flow = usePayFlow({ onStartPayment, onConfirmCash }, initialView);
  const { rating, tags, setRating, toggleTag } = useJobFeedback(initialFeedback);
  const done = useAsyncAction();
  const amount = formatRupees(amountRupees);

  return (
    <ScreenBackground>
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: 48 + insets.top }]}>
        <View style={styles.doneDisc}>
          <Icon name="check" size={36} color={color.purple} strokeWidth={2.4} />
        </View>
        <AppText size={22} weight={800} accessibilityRole="header">
          {copy.title}
        </AppText>
        <AppText size={14} color={color.muted} align="center">
          {copy.subtitle(worker.firstName)}
        </AppText>
      </View>

      <ScrollView
        style={styles.flex}
        // The design has no bottom padding because everything fits its frame.
        // On a shorter screen this keeps the last card clear of the gesture bar.
        contentContainerStyle={[styles.body, { paddingBottom: 20 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.summary}>
          <SummaryRow label={copy.workDone} value={workDone} />
          <SummaryRow label={copy.worker} value={worker.name} />
          <SummaryRow label={copy.jobId} value={jobId} />
          <View style={styles.divider} />
          <View style={styles.totalRow} accessible>
            <AppText size={15} weight={700}>
              {copy.total}
            </AppText>
            <AppText size={30} weight={800}>
              {amount}
            </AppText>
          </View>
        </Card>

        <View style={styles.section}>
          {flow.view === 'choose' ? (
            <View style={styles.section}>
              <View style={styles.payHeading}>
                <AppText size={15} weight={800} accessibilityRole="header" style={styles.shrink}>
                  {copy.payHeading(amount)}
                </AppText>
                <AppText size={12} color={color.muted} style={styles.shrink}>
                  {copy.payHeadingTamil}
                </AppText>
              </View>
              <View style={styles.apps}>
                {copy.apps.map((app) => (
                  <PayAppButton
                    key={app.method}
                    badge={app.badge}
                    label={app.label}
                    disabled={flow.busy}
                    onPress={() => flow.startPay(app.method)}
                  />
                ))}
              </View>
              <SecondaryButton
                label={copy.showQr}
                icon="qrCode"
                onPress={flow.showQr}
                testID="pay-show-qr"
              />
              <InfoNote tone="info" icon="shield">
                {copy.partnerNote(worker.firstName)}
              </InfoNote>
              <TextButton
                label={copy.toCash}
                tone="muted"
                size={13}
                onPress={flow.toCash}
                testID="pay-to-cash"
              />
            </View>
          ) : null}

          {flow.view === 'qr' ? (
            <Card style={[styles.card, styles.centred]}>
              <SampleQrCode accessibilityLabel={copy.qrLabel(amount)} />
              <AppText size={14} weight={800} align="center">
                {copy.qrTitle(amount)}
              </AppText>
              <AppText size={12} color={color.muted} align="center">
                {copy.qrNote(jobId)}
              </AppText>
              <View style={styles.fullWidth}>
                <SecondaryButton
                  label={copy.qrPaid}
                  disabled={flow.busy}
                  onPress={() => flow.startPay('qr')}
                  testID="pay-qr-paid"
                />
              </View>
            </Card>
          ) : null}

          {flow.view === 'checking' ? (
            // Read out when it appears, so a screen-reader user knows to wait.
            <Card style={[styles.card, styles.centred, styles.checking]}>
              <View accessibilityLiveRegion="polite" style={styles.checkingInner}>
                <View style={styles.rippleBox}>
                  {/* Waves spread from behind the disc; hidden when reduce motion is on. */}
                  <Ripple kind="waitingRipple" size={WAITING_DISC} />
                  <View style={styles.waitingDisc}>
                    <Icon name="loader" size={30} color={color.purple} />
                  </View>
                </View>
                <AppText size={17} weight={800} align="center" accessibilityRole="header">
                  {copy.checkingTitle}
                </AppText>
                <AppText size={12} color={color.muted} align="center" lineHeight={12 * 1.45}>
                  {copy.checkingBody}
                </AppText>
              </View>
            </Card>
          ) : null}

          {flow.view === 'verified' && flow.verified ? (
            <View style={styles.verified} accessibilityLiveRegion="polite">
              <View style={styles.titleRow}>
                <Icon name="check" size={20} color={color.purple} strokeWidth={3} />
                <AppText size={16} weight={800} color={color.purple} accessibilityRole="header">
                  {copy.verifiedTitle(amount)}
                </AppText>
              </View>
              <AppText size={12} color={color.muted}>
                {copy.verifiedDetail(flow.verified.reference, flow.verified.time, worker.name)}
              </AppText>
              <Tappable
                onPress={onViewReceipt}
                accessibilityRole="link"
                accessibilityLabel={copy.viewReceipt}
                style={styles.receiptLink}
                testID="pay-view-receipt"
              >
                <AppText size={13} weight={700} color={color.purple}>
                  {copy.viewReceipt}
                </AppText>
              </Tappable>
            </View>
          ) : null}

          {flow.view === 'failed' ? (
            <Card style={[styles.card, styles.gap8]}>
              <View style={styles.titleRow} accessibilityLiveRegion="polite">
                <Icon name="alertCircle" size={20} color={color.dangerStrong} />
                <AppText size={16} weight={800} accessibilityRole="header" style={styles.shrink}>
                  {copy.failedTitle}
                </AppText>
              </View>
              <AppText size={12} color={color.muted} lineHeight={12 * 1.45}>
                {copy.failedBody}
              </AppText>
              <PrimaryButton
                label={copy.tryAgain}
                icon="rotateCcw"
                iconSize={18}
                onPress={flow.backToChoose}
                testID="pay-try-again"
              />
            </Card>
          ) : null}

          {flow.view === 'cash' ? (
            <Card style={[styles.card, styles.gap8]}>
              <View style={styles.titleRow}>
                <Icon name="banknote" size={20} color={color.mangoText} />
                <AppText size={16} weight={800} accessibilityRole="header">
                  {copy.cashTitle}
                </AppText>
              </View>
              <InfoNote tone="warning" icon="alertCircle">
                {copy.cashDisclaimer}
              </InfoNote>
              <Tappable
                onPress={flow.confirmCash}
                disabled={flow.busy}
                accessibilityRole="button"
                accessibilityLabel={copy.cashConfirm(amount)}
                accessibilityState={{ disabled: flow.busy }}
                style={[styles.cashButton, flow.busy ? styles.busy : null]}
                testID="pay-cash-confirm"
              >
                <AppText size={15} weight={700} color={color.white} numberOfLines={1}>
                  {copy.cashConfirm(amount)}
                </AppText>
              </Tappable>
              <TextButton
                label={copy.payInApp}
                size={13}
                onPress={flow.backToChoose}
                testID="pay-in-app"
              />
            </Card>
          ) : null}

          {flow.view === 'cashDone' ? (
            <Card style={[styles.card, styles.gap4]}>
              <AppText size={15} weight={800} accessibilityRole="header">
                {copy.cashDoneTitle}
              </AppText>
              <AppText size={12} color={color.muted}>
                {copy.cashDoneBody}
              </AppText>
            </Card>
          ) : null}
        </View>

        {canRate(flow.view) ? (
          <>
            <RatingCard rating={rating} tags={tags} onRate={setRating} onToggleTag={toggleTag} />
            <PrimaryButton
              label={copy.done}
              disabled={done.busy}
              onPress={() => void done.run(() => onDone({ rating, tags }))}
              testID="pay-done"
            />
          </>
        ) : null}
      </ScrollView>
    </ScreenBackground>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow} accessible>
      <AppText size={14} color={color.muted}>
        {label}
      </AppText>
      {/* A long value wraps instead of pushing the label off the card. */}
      <AppText size={14} weight={600} align="right" style={styles.shrink}>
        {value}
      </AppText>
    </View>
  );
}

type PayAppButtonProps = {
  badge: string;
  label: string;
  disabled: boolean;
  onPress: () => void;
};

/** One of the four UPI app buttons: a letter badge over the app's name. */
function PayAppButton({ badge, label, disabled, onPress }: PayAppButtonProps) {
  return (
    <Tappable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={copy.payWith(label)}
      accessibilityState={{ disabled }}
      style={styles.app}
      testID={`pay-app-${label}`}
    >
      <View style={styles.appBadge}>
        <AppText size={12} weight={800} color={color.muted}>
          {badge}
        </AppText>
      </View>
      <AppText size={11} weight={700} numberOfLines={1}>
        {label}
      </AppText>
    </Tappable>
  );
}

const DONE_DISC = 72;
const WAITING_DISC = 64;
/** The design's 122pt box: room for the waves to spread (64 x 1.9). */
const RIPPLE_BOX = 122;
const APP_BADGE = 28;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  shrink: { flexShrink: 1 },
  header: {
    paddingHorizontal: spacing.screenPadding,
    alignItems: 'center',
    gap: 12,
  },
  doneDisc: {
    width: DONE_DISC,
    height: DONE_DISC,
    borderRadius: DONE_DISC / 2,
    backgroundColor: color.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingTop: 24,
    paddingHorizontal: spacing.screenPadding,
    gap: 16,
  },
  summary: {
    padding: 16,
    gap: spacing.gapM,
    flexShrink: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: color.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // Lines up the small "Total" with the bottom of the large amount.
    alignItems: 'baseline',
  },
  section: { gap: 10, flexShrink: 0 },
  payHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 8,
  },
  // Four equal columns (the design's 4-column grid).
  apps: { flexDirection: 'row', gap: 8 },
  app: {
    flex: 1,
    height: 64,
    borderRadius: radius.smallButton,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  appBadge: {
    width: APP_BADGE,
    height: APP_BADGE,
    borderRadius: radius.payAppBadge,
    backgroundColor: color.neutralTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: { padding: 14, gap: 10 },
  centred: { alignItems: 'center' },
  fullWidth: { alignSelf: 'stretch' },
  gap8: { gap: 8 },
  gap4: { gap: 4 },
  checking: { paddingVertical: 22 },
  checkingInner: { alignItems: 'center', gap: 10 },
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
    backgroundColor: color.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verified: {
    backgroundColor: color.white,
    borderWidth: 2,
    borderColor: color.purple,
    borderRadius: radius.choiceCard,
    padding: 14,
    gap: 4,
  },
  receiptLink: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
  },
  cashButton: {
    height: 52,
    borderRadius: radius.smallButton,
    backgroundColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  busy: { opacity: 0.5 },
});
