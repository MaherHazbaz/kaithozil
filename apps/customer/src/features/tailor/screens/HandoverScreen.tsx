import {
  AppText,
  Avatar,
  Card,
  Icon,
  PrimaryButton,
  Tappable,
  TickItem,
  color,
  radius,
} from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CodeCard } from '@/components/CodeCard';
import { PageLayout } from '@/components/PageLayout';
import { PhotoPlaceholderGrid } from '@/components/PhotoPlaceholderGrid';
import { useAsyncAction } from '@/hooks/useAsyncAction';

import { handoverCopy as copy } from '../copy';
import type { Handover, HandoverStep } from '../types';

export type HandoverScreenProps = {
  handover: Handover;
  /** Pickup (fabric to the tailor) or delivery (clothes back). Comes from the order. */
  step: HandoverStep;
  onBack: () => void;
  onMessage?: () => void;
  /**
   * "I've received everything": records the delivery and resolves with the
   * time the server recorded ("Fri 21 Nov, 5:12 PM"). Rejects to stay.
   */
  onConfirmReceived: () => Promise<{ receivedAt: string }>;
  onReportProblem?: () => void;
  /** "Back to your order" once received. */
  onBackToOrder?: () => void;
  /** Starts as already received (for tests and review). */
  initialReceivedAt?: string;
};

/** Customer · Pickup and delivery for a tailor order (design/source/Handover.dc.html). */
export function HandoverScreen({
  handover,
  step,
  onBack,
  onMessage,
  onConfirmReceived,
  onReportProblem,
  onBackToOrder,
  initialReceivedAt,
}: HandoverScreenProps) {
  return (
    <PageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
    >
      {step === 'pickup' ? (
        <Pickup handover={handover} onMessage={onMessage} />
      ) : (
        <Delivery
          handover={handover}
          onConfirmReceived={onConfirmReceived}
          onReportProblem={onReportProblem}
          onBackToOrder={onBackToOrder}
          initialReceivedAt={initialReceivedAt}
        />
      )}
    </PageLayout>
  );
}

function Pickup({ handover, onMessage }: Pick<HandoverScreenProps, 'handover' | 'onMessage'>) {
  const { runner } = handover;
  return (
    <>
      <Card style={styles.person}>
        <Avatar initials={runner.initials} tone="mango" />
        <View style={styles.personText}>
          <AppText size={15} weight={800}>
            {copy.coming(runner.name)}
          </AppText>
          <AppText size={12} color={color.muted}>
            {copy.comingDetail(handover.tailorName, handover.eta)}
          </AppText>
        </View>
        <Tappable
          onPress={onMessage}
          accessibilityRole="button"
          accessibilityLabel={copy.message(runner.firstName)}
          style={styles.round}
          testID="handover-message"
        >
          <Icon name="messageSquare" size={18} color={color.purple} />
        </Tappable>
      </Card>

      <CodeCard
        title={copy.pickupCode}
        titleTamil={copy.pickupCodeTamil}
        code={handover.pickupCode}
        spokenLabel={copy.pickupSpoken(handover.pickupCode)}
        note={copy.pickupNote(runner.firstName)}
        testID="handover-code"
      />

      <Card style={styles.list}>
        <AppText size={14} weight={800} accessibilityRole="header">
          {copy.handingOver}
        </AppText>
        {handover.pickupItems.map((item) => (
          <TickItem key={item}>{item}</TickItem>
        ))}
        <AppText size={12} color={color.muted}>
          {copy.pickupPhotos(runner.firstName)}
        </AppText>
      </Card>
    </>
  );
}

type DeliveryProps = Pick<
  HandoverScreenProps,
  'handover' | 'onConfirmReceived' | 'onReportProblem' | 'onBackToOrder' | 'initialReceivedAt'
>;

function Delivery({
  handover,
  onConfirmReceived,
  onReportProblem,
  onBackToOrder,
  initialReceivedAt,
}: DeliveryProps) {
  const [receivedAt, setReceivedAt] = useState(initialReceivedAt ?? null);
  const { busy, run } = useAsyncAction();
  const { runner } = handover;

  const confirm = () => {
    void run(async () => {
      const result = await onConfirmReceived();
      setReceivedAt(result.receivedAt);
    });
  };

  return (
    <>
      <Card style={styles.person}>
        <Avatar initials={runner.initials} tone="mango" />
        <View style={styles.personText}>
          <AppText size={15} weight={800}>
            {copy.arrived}
          </AppText>
          <AppText size={12} color={color.muted}>
            {copy.arrivedDetail(runner.name, handover.tailorName)}
          </AppText>
        </View>
      </Card>

      <Card style={styles.list}>
        <AppText size={14} weight={800} accessibilityRole="header">
          {copy.checkFirst}
        </AppText>
        {handover.deliveryItems.map((item) => (
          <TickItem key={item}>{item}</TickItem>
        ))}
        {handover.packedPhotoCount > 0 ? (
          <>
            <AppText size={12} color={color.muted}>
              {copy.packedPhotos(handover.tailorFirstName)}
            </AppText>
            <PhotoPlaceholderGrid
              iconSize={22}
              labels={Array.from({ length: handover.packedPhotoCount }, (_, i) =>
                copy.packedPhotoLabel(i + 1),
              )}
            />
          </>
        ) : null}
      </Card>

      {receivedAt ? (
        <>
          <View style={styles.received} accessible accessibilityLiveRegion="polite">
            <View style={styles.tick}>
              <Icon name="check" size={14} color={color.white} strokeWidth={3} />
            </View>
            <View style={styles.personText}>
              <AppText size={13} weight={700} accessibilityRole="header">
                {copy.receivedTitle(receivedAt)}
              </AppText>
              <AppText size={11} color={color.muted}>
                {copy.receivedDetail}
              </AppText>
            </View>
          </View>
          <PrimaryButton
            label={copy.backToOrder}
            onPress={onBackToOrder}
            testID="handover-back-to-order"
          />
        </>
      ) : (
        <>
          <PrimaryButton
            label={copy.received}
            icon="package"
            iconSize={18}
            disabled={busy}
            onPress={confirm}
            testID="handover-received"
          />
          <Tappable
            onPress={onReportProblem}
            accessibilityRole="link"
            accessibilityLabel={copy.missing}
            style={styles.textLink}
            testID="handover-missing"
          >
            <AppText size={14} weight={700}>
              {copy.missing}
            </AppText>
          </Tappable>
        </>
      )}
    </>
  );
}

const ROUND = 44;
const TICK = 24;

const styles = StyleSheet.create({
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    flexShrink: 0,
  },
  personText: { flexGrow: 1, flexShrink: 1, gap: 2 },
  round: {
    width: ROUND,
    height: ROUND,
    borderRadius: ROUND / 2,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  list: { padding: 14, gap: 10, flexShrink: 0 },
  received: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: color.purple,
    borderRadius: radius.choiceCard,
    backgroundColor: color.white,
    padding: 14,
    flexShrink: 0,
  },
  tick: {
    width: TICK,
    height: TICK,
    borderRadius: TICK / 2,
    backgroundColor: color.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLink: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
