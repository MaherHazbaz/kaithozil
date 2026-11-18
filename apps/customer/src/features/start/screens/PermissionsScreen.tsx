import {
  AppText,
  Card,
  PrimaryButton,
  ScreenBackground,
  StateIllustration,
  Tappable,
  TickItem,
  color,
  radius,
  spacing,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { permissionsCopy as copy, type PermissionKey } from '../copy';

export type PermissionsScreenProps = {
  /**
   * Called for each step with the customer's answer. "Allow" is where the
   * route asks Android for the permission; the screen only explains why.
   */
  onAnswer?: (permission: PermissionKey, allowed: boolean) => void | Promise<void>;
  /** After the last step. */
  onDone: () => void;
};

/** Shared · Permissions, explained one at a time (design/source/Permissions.dc.html). */
export function PermissionsScreen({ onAnswer, onDone }: PermissionsScreenProps) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const total = copy.steps.length;
  // `index` never leaves 0..total-1, so the step always exists.
  const step = copy.steps[index] ?? copy.steps[0];

  const answer = async (allowed: boolean) => {
    await onAnswer?.(step.key, allowed);
    if (index === total - 1) onDone();
    else setIndex(index + 1);
  };

  return (
    <ScreenBackground>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: 26 + insets.top }]}>
        <AppText size={13} weight={700} color={color.muted}>
          {copy.stepOf(index + 1, total)}
        </AppText>
        {/* Decorative: the step text above says the same thing. */}
        <View
          style={styles.dots}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {copy.steps.map((item, dot) => (
            <View
              key={item.key}
              style={[
                styles.dot,
                dot === index ? styles.dotNow : dot < index ? styles.dotDone : styles.dotNext,
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          {/*
            Waves around the icon, as on Finding a worker. Added at the owner's
            request; not in the design (docs/decisions/0007-permissions-ripple.md).
          */}
          <StateIllustration icon={step.icon} tone="brand" discShadow="strong" ripple />
          <View style={styles.titles}>
            <AppText size={24} weight={800} align="center" accessibilityRole="header">
              {step.title}
            </AppText>
            <AppText size={13} color={color.muted} align="center">
              {step.titleTamil}
            </AppText>
          </View>
          <AppText size={15} lineHeight={15 * 1.5} align="center" style={styles.body}>
            {step.body}
          </AppText>
        </View>
        <Card style={styles.card}>
          {step.points.map((point) => (
            <TickItem key={point} size="large">
              {point}
            </TickItem>
          ))}
        </Card>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 26 + insets.bottom }]}>
        <PrimaryButton label={copy.allow} onPress={() => answer(true)} testID="permissions-allow" />
        <Tappable
          onPress={() => answer(false)}
          accessibilityRole="button"
          style={styles.later}
          testID="permissions-later"
        >
          <AppText size={14} weight={700} color={color.muted}>
            {copy.notNow}
          </AppText>
        </Tappable>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.screenPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 8, borderRadius: radius.dot },
  dotNow: { width: 24, backgroundColor: color.purple },
  dotDone: { width: 8, backgroundColor: color.purpleSoft },
  dotNext: { width: 8, backgroundColor: color.dotInactive },
  scroll: { flex: 1 },
  content: { paddingTop: 16, paddingHorizontal: spacing.screenPadding, gap: 12 },
  intro: { alignItems: 'center', gap: 18, paddingTop: 24 },
  titles: { gap: 4 },
  body: { maxWidth: 320 },
  card: { padding: 16, gap: 10, marginTop: 8 },
  footer: {
    paddingTop: 14,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.border,
    gap: 10,
  },
  later: { height: 44, alignItems: 'center', justifyContent: 'center' },
});
