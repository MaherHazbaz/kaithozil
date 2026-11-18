import { AppText, Card, IconBox, Tappable, color, radius } from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { paymentsCopy as copy, upiApps } from '../copy';
import type { PaymentRecord, UpiAppChoice } from '../types';

export type PaymentsScreenProps = {
  /** The saved preference. */
  initialApp: UpiAppChoice;
  payments: readonly PaymentRecord[];
  onBack: () => void;
  /** Called on every choice; the design has no Save button here. */
  onPreferredAppChange?: (app: UpiAppChoice) => void;
};

/** Customer · Payments (design/source/Payments.dc.html). */
export function PaymentsScreen({
  initialApp,
  payments,
  onBack,
  onPreferredAppChange,
}: PaymentsScreenProps) {
  const [app, setApp] = useState(initialApp);
  const choose = (next: UpiAppChoice) => {
    setApp(next);
    onPreferredAppChange?.(next);
  };

  return (
    <PageLayout title={copy.title} titleTamil={copy.titleTamil} onBack={onBack}>
      <View style={styles.direct}>
        <IconBox icon="shield" tone="purple" size={40} />
        <View style={styles.directText}>
          <AppText size={15} weight={800}>
            {copy.directTitle}
          </AppText>
          <AppText size={12} color={color.muted} lineHeight={12 * 1.4}>
            {copy.directBody}
          </AppText>
        </View>
      </View>

      <View style={styles.heading}>
        <AppText size={14} weight={800} accessibilityRole="header">
          {copy.preferredApp}
        </AppText>
        <AppText size={12} color={color.muted}>
          {copy.preferredAppHint}
        </AppText>
      </View>
      <Card>
        <View
          style={styles.group}
          accessibilityRole="radiogroup"
          accessibilityLabel={copy.preferredApp}
        >
          {upiApps.map((option) => {
            const selected = option.id === app;
            return (
              <Tappable
                key={option.id}
                onPress={() => choose(option.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={option.name}
                style={styles.appRow}
                testID={`payments-app-${option.id}`}
              >
                <View style={styles.initials}>
                  <AppText size={13} weight={800} color={color.muted}>
                    {option.initials}
                  </AppText>
                </View>
                <AppText size={15} weight={700} style={styles.flex}>
                  {option.name}
                </AppText>
                <View style={[styles.radio, selected ? styles.radioOn : styles.radioOff]} />
              </Tappable>
            );
          })}
        </View>
      </Card>

      {/* No design for an empty history yet, so the section is left out until there is one. */}
      {payments.length > 0 ? (
        <>
          <AppText size={15} weight={800} accessibilityRole="header" style={styles.recentHeading}>
            {copy.recent}
          </AppText>
          <Card>
            <View style={styles.group}>
              {payments.map((payment) => (
                <View key={payment.id} style={styles.paymentRow}>
                  <IconBox icon="wallet" tone="lavender" size={36} />
                  <View style={styles.paymentText}>
                    <AppText size={14} weight={700}>
                      {payment.title}
                    </AppText>
                    <AppText size={12} color={color.muted}>
                      {payment.detail}
                    </AppText>
                  </View>
                  <View style={styles.amount}>
                    <AppText size={15} weight={800}>
                      {payment.amount}
                    </AppText>
                    <AppText size={12} weight={700} color={color.purple}>
                      {copy.paid}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </>
      ) : null}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  direct: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: color.lavender,
    borderWidth: 1,
    borderColor: color.lavenderText,
    // 16 in the design; the same value as the button radius.
    borderRadius: radius.button,
    padding: 14,
  },
  directText: { flex: 1, gap: 2 },
  heading: { gap: 2 },
  // The rows pad themselves. This inner view clips their square corners to
  // the card's radius (minus its 1pt border); the shadow stays on the Card
  // outside, because a clipping view cannot draw a shadow beyond itself.
  group: { borderRadius: radius.card - 1, overflow: 'hidden' },
  appRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: color.white,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  initials: {
    width: 36,
    height: 36,
    flexShrink: 0,
    borderRadius: radius.iconBox,
    backgroundColor: color.neutralTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 22,
    height: 22,
    flexShrink: 0,
    borderRadius: 11,
    backgroundColor: color.white,
  },
  radioOn: { borderWidth: 7, borderColor: color.purple },
  radioOff: { borderWidth: 2, borderColor: color.borderStrong },
  recentHeading: { paddingTop: 2 },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: color.white,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  paymentText: { flex: 1, minWidth: 0, gap: 1 },
  amount: { alignItems: 'flex-end' },
});
