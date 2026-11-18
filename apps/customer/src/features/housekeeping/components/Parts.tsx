import {
  AppText,
  Avatar,
  Card,
  Icon,
  IconBox,
  Tappable,
  Toggle,
  color,
  radius,
  type IconName,
} from '@kaithozhil/ui';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Housekeeper } from '../types';

/** "What needs doing? · என்ன வேலை?" (14/800, the Tamil part 500 muted). */
export function SectionHeading({ text, tamil }: { text: string; tamil: string }) {
  return (
    <AppText size={14} weight={800} accessibilityRole="header">
      {text}
      <AppText weight={500} color={color.muted}>
        {tamil}
      </AppText>
    </AppText>
  );
}

export type ChoiceCardProps = {
  icon: IconName;
  title: string;
  titleTamil: string;
  detail: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
};

/**
 * "Regular help" / "One-time cleaning" on HousekeepingBook.dc.html: icon box
 * and three lines (padding 12 14, radius 16). Unlike Tailor's MethodCard it
 * has no radio dot; the lavender fill and 2pt border show the choice.
 */
export function ChoiceCard({
  icon,
  title,
  titleTamil,
  detail,
  selected,
  onPress,
  testID,
}: ChoiceCardProps) {
  return (
    <Tappable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${title}. ${detail}`}
      accessibilityHint={titleTamil}
      style={[styles.choice, selected ? styles.choiceOn : styles.choiceOff]}
      testID={testID}
    >
      <IconBox icon={icon} tone="lavender" size={40} />
      <View style={styles.grow}>
        <AppText size={15} weight={800}>
          {title}
        </AppText>
        <AppText size={11} color={color.muted}>
          {titleTamil}
        </AppText>
        <AppText size={12}>{detail}</AppText>
      </View>
    </Tappable>
  );
}

export type ToggleRowProps = {
  title: string;
  detail: string;
  on: boolean;
  onPress: () => void;
  testID?: string;
};

/** A white row with a title, a muted line and a 52 x 30 toggle (min height 60, radius 14). */
export function ToggleRow({ title, detail, on, onPress, testID }: ToggleRowProps) {
  return (
    <Tappable
      onPress={onPress}
      // "switch" makes screen readers say "on" / "off" with the title.
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={title}
      accessibilityHint={detail}
      style={styles.toggleRow}
      testID={testID}
    >
      <View style={styles.grow}>
        <AppText size={14} weight={700}>
          {title}
        </AppText>
        <AppText size={12} color={color.muted}>
          {detail}
        </AppText>
      </View>
      <Toggle on={on} />
    </Tappable>
  );
}

export type HousekeeperCardProps = {
  housekeeper: Housekeeper;
  /** "Trial · Wed 1 Oct · 6:02 – 8:05 AM" or "Housekeeper · ★ 4.9 · since 2 Oct". */
  subtitle: string;
  /** Read after the name, e.g. "verified". */
  verifiedLabel: string;
  /** Shows the round message button (HousekeepingPlan.dc.html). */
  onMessage?: () => void;
  messageLabel?: string;
  testID?: string;
};

/** The housekeeper's card: 48pt mango avatar, name with the verified badge, one muted line. */
export function HousekeeperCard({
  housekeeper,
  subtitle,
  verifiedLabel,
  onMessage,
  messageLabel,
  testID,
}: HousekeeperCardProps) {
  return (
    <Card style={styles.person} testID={testID}>
      <Avatar initials={housekeeper.initials} size={48} fontSize={15} />
      {/* One element for screen readers; the message button stays separate. */}
      <View
        style={styles.personText}
        accessible
        accessibilityLabel={`${housekeeper.name}, ${verifiedLabel}. ${subtitle}`}
      >
        <View style={styles.nameRow}>
          <AppText size={16} weight={800}>
            {housekeeper.name}
          </AppText>
          <Icon name="badgeCheck" size={16} color={color.purple} strokeWidth={2.2} />
        </View>
        <AppText size={12} color={color.muted}>
          {subtitle}
        </AppText>
      </View>
      {onMessage ? (
        <Tappable
          onPress={onMessage}
          accessibilityRole="button"
          accessibilityLabel={messageLabel}
          style={styles.roundButton}
          testID={testID ? `${testID}-message` : undefined}
        >
          <Icon name="messageSquare" size={18} color={color.purple} />
        </Tappable>
      ) : null}
    </Card>
  );
}

/** A card of DetailRows (padding 4 14, no gap) with an optional 14/800 heading. */
export function RowsCard({ heading, children }: { heading?: string; children: ReactNode }) {
  return (
    <Card style={styles.rows}>
      {heading ? (
        <AppText size={14} weight={800} accessibilityRole="header" style={styles.rowsHeading}>
          {heading}
        </AppText>
      ) : null}
      {children}
    </Card>
  );
}

/**
 * The 2pt purple-bordered note with a ticked purple disc ("Regular help
 * confirmed", "Leave approved"): radius 18, padding 14.
 */
export function ConfirmedNote({
  title,
  detail,
  testID,
}: {
  title: string;
  detail: string;
  testID?: string;
}) {
  return (
    <View
      style={styles.confirmed}
      accessible
      // Announced when it appears, so screen-reader users hear the action worked.
      accessibilityLiveRegion="polite"
      accessibilityLabel={`${title}. ${detail}`}
      testID={testID}
    >
      <View style={styles.confirmedRow}>
        <View style={styles.tickDisc}>
          <Icon name="check" size={14} color={color.white} strokeWidth={3} />
        </View>
        <View style={styles.grow}>
          <AppText size={13} weight={700}>
            {title}
          </AppText>
          <AppText size={11} color={color.muted}>
            {detail}
          </AppText>
        </View>
      </View>
    </View>
  );
}

/** A centred card with a 16/800 title and a 13pt muted body ("We'll find someone else"). */
export function MessageCard({
  title,
  body,
  testID,
}: {
  title: string;
  body: string;
  testID?: string;
}) {
  return (
    <Card style={styles.message} testID={testID}>
      <AppText size={16} weight={800} align="center" accessibilityRole="header">
        {title}
      </AppText>
      <AppText size={13} color={color.muted} align="center" lineHeight={13 * 1.45}>
        {body}
      </AppText>
    </Card>
  );
}

/** A 44pt-high text link, 14/700 (purple by default, muted for the quiet links). */
export function TextLink({
  label,
  onPress,
  tone = 'purple',
  testID,
}: {
  label: string;
  onPress?: () => void;
  tone?: 'purple' | 'muted';
  testID?: string;
}) {
  return (
    <Tappable onPress={onPress} accessibilityRole="link" style={styles.link} testID={testID}>
      <AppText size={14} weight={700} color={tone === 'purple' ? color.purple : color.muted}>
        {label}
      </AppText>
    </Tappable>
  );
}

const ROUND = 44;
const DISC = 24;

const styles = StyleSheet.create({
  grow: { flexGrow: 1, flexShrink: 1, gap: 1 },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.button,
  },
  // The 1pt border grows to 2pt when chosen with the same padding, so the
  // content shifts by 1pt, exactly as it does in the design.
  choiceOn: { borderWidth: 2, borderColor: color.purple, backgroundColor: color.lavender },
  choiceOff: { borderWidth: 1, borderColor: color.borderStrong, backgroundColor: color.white },
  toggleRow: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.chipSquare,
  },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  personText: { flexGrow: 1, flexShrink: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  roundButton: {
    width: ROUND,
    height: ROUND,
    flexShrink: 0,
    borderRadius: ROUND / 2,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rows: { paddingVertical: 4, paddingHorizontal: 14 },
  rowsHeading: { paddingTop: 8, paddingBottom: 2 },
  confirmed: {
    backgroundColor: color.white,
    borderWidth: 2,
    borderColor: color.purple,
    borderRadius: radius.choiceCard,
    padding: 14,
    gap: 6,
  },
  confirmedRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tickDisc: {
    width: DISC,
    height: DISC,
    flexShrink: 0,
    borderRadius: DISC / 2,
    backgroundColor: color.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: { padding: 14, gap: 10, alignItems: 'center' },
  link: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
