import {
  AppText,
  Avatar,
  Card,
  InfoNote,
  PrimaryButton,
  ScreenBackground,
  SecondaryButton,
  Tappable,
  color,
  spacing,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrderHeader } from '../components/OrderHeader';
import { OrderLink } from '../components/OrderLink';
import { OrderTimeline } from '../components/OrderTimeline';
import { orderCopy as copy, orderStages } from '../copy';
import { orderTimeline } from '../orderTimeline';
import type { OrderStage, TailorOrder } from '../types';

export type OrderStatusScreenProps = {
  order: TailorOrder;
  /** Where the order is. Drawn as three states in the design. */
  stage: OrderStage;
  onBack: () => void;
  onMeasurements?: () => void;
  /** "Pickup and delivery": codes and checklists (Handover.dc.html). */
  onHandover?: () => void;
  onMessage?: () => void;
  onReportProblem?: () => void;
  /** "Fits well, pay …": opens Pay and rate. */
  onPay?: () => void;
  onRequestAlteration?: () => void;
};

/** Customer · Order status for a tailor order (design/source/OrderStatus.dc.html). */
export function OrderStatusScreen({
  order,
  stage,
  onBack,
  onMeasurements,
  onHandover,
  onMessage,
  onReportProblem,
  onPay,
  onRequestAlteration,
}: OrderStatusScreenProps) {
  const insets = useSafeAreaInsets();
  const { tailor } = order;
  const delivered = stage === 'delivered';
  const details = [
    { label: copy.how, value: order.how },
    { label: copy.due, value: order.dates.due },
    {
      label: copy.price,
      detail: copy.priceDetail(order.priceEach, order.pieces),
      value: order.total,
    },
    { label: copy.measurements, value: order.measurements },
  ];

  return (
    <ScreenBackground>
      <StatusBar style="dark" />
      <OrderHeader status={orderStages[stage]} onBack={onBack} topInset={insets.top} />
      <ScrollView
        style={styles.flex}
        // The design's bottom padding is 0; the inset keeps the last button
        // clear of the gesture bar.
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.summary}>
          <Avatar initials={tailor.initials} tone="mango" />
          <View style={styles.summaryText}>
            <AppText size={15} weight={800}>
              {order.summary}
            </AppText>
            <AppText size={12} color={color.muted}>
              {copy.tailorLine(tailor.name, tailor.level, tailor.rating)}
            </AppText>
          </View>
        </Card>

        <OrderTimeline steps={orderTimeline(stage, order.dates)} />

        <Card style={styles.details}>
          {details.map((row) => (
            <View key={row.label} style={styles.detailRow}>
              <View>
                <AppText size={13} weight={400} color={color.muted}>
                  {row.label}
                </AppText>
                {row.detail ? (
                  <AppText size={11} color={color.muted}>
                    {row.detail}
                  </AppText>
                ) : null}
              </View>
              <AppText size={13} weight={800} style={styles.detailValue}>
                {row.value}
              </AppText>
            </View>
          ))}
        </Card>

        <View style={styles.links}>
          <OrderLink
            icon="ruler"
            title={copy.yourMeasurements}
            detail={copy.measurementsDetail(tailor.firstName)}
            onPress={onMeasurements}
            testID="order-measurements"
          />
          <OrderLink
            icon="truck"
            title={copy.handover}
            detail={copy.handoverDetail}
            onPress={onHandover}
            testID="order-handover"
          />
        </View>

        {delivered ? (
          <>
            <InfoNote tone="info" icon="check" iconStrokeWidth={2.5}>
              {copy.tryOnNote}
            </InfoNote>
            <PrimaryButton label={copy.pay(order.total)} onPress={onPay} testID="order-pay" />
            <Tappable
              onPress={onRequestAlteration}
              accessibilityRole="button"
              style={styles.alteration}
              testID="order-alteration"
            >
              <AppText size={14} weight={700} color={color.purple}>
                {copy.alteration}
              </AppText>
            </Tappable>
          </>
        ) : (
          // Two equal columns (the design's 2-column grid).
          <View style={styles.actions}>
            <View style={styles.flex}>
              <SecondaryButton
                label={copy.message(tailor.firstName)}
                icon="messageSquare"
                onPress={onMessage}
                testID="order-message"
              />
            </View>
            <View style={styles.flex}>
              <SecondaryButton
                label={copy.reportProblem}
                tone="ink"
                onPress={onReportProblem}
                testID="order-report"
              />
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingTop: 16,
    paddingHorizontal: spacing.screenPadding,
    gap: 12,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  summaryText: { flexGrow: 1, flexShrink: 1, gap: 2 },
  // The source sets `gap: 10px` and `padding: 14px`, then `gap: 0; padding: 6px 14px`; the last ones win.
  details: { paddingVertical: 6, paddingHorizontal: 14 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
    // Every row has the divider, the last one included, as drawn.
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  detailValue: { flexShrink: 1 },
  links: { gap: 8 },
  actions: { flexDirection: 'row', gap: 8 },
  alteration: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
