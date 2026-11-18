import {
  AppText,
  Gradient,
  Icon,
  Tappable,
  color,
  radius,
  shadow,
  type GradientName,
  type IconName,
} from '@kaithozhil/ui';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { crewProfileCopy } from '../copy';
import type { CrewSite } from '../types';

export type LinkCardProps = {
  icon: IconName;
  title: string;
  detail: string;
  onPress?: () => void;
  testID?: string;
};

/**
 * A lavender card that opens another screen: icon, title, detail, chevron
 * (Crew.dc.html "Prefer to choose your crew?", CrewTeam.dc.html "Attendance
 * and daily payments": radius 16, padding 12 14, gap 12).
 */
export function LinkCard({ icon, title, detail, onPress, testID }: LinkCardProps) {
  return (
    <Tappable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={`${title}, ${detail}`}
      style={styles.link}
      testID={testID}
    >
      <Icon name={icon} size={20} color={color.purple} />
      <View style={styles.linkText}>
        <AppText size={14} weight={800}>
          {title}
        </AppText>
        <AppText size={12} color={color.muted}>
          {detail}
        </AppText>
      </View>
      <Icon name="chevronRight" size={18} color={color.purple} />
    </Tappable>
  );
}

export type HeroCardProps = {
  /** 20 on JobPlan.dc.html, 22 on CrewTeam and CrewPayments. */
  corner: 'card' | 'tile';
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

/** The purple gradient card at the top of Job plan, Your crew and Daily payments. */
export function HeroCard({ corner, style, children }: HeroCardProps) {
  const borderRadius = radius[corner];
  return (
    // Shadow on the wrapper: the gradient clips to its corners and could not show it.
    <View style={[styles.heroShadow, { borderRadius }]}>
      <Gradient name="hero" style={[styles.hero, { borderRadius }, style]}>
        {children}
      </Gradient>
    </View>
  );
}

/**
 * A lavender note with an 18pt lock (CrewProfile.dc.html). InfoNote draws a
 * 16pt icon, so this one is local.
 */
export function LockNote({ children }: { children: ReactNode }) {
  return (
    <View style={styles.note}>
      <Icon name="lock" size={18} color={color.purple} />
      <AppText size={12} lineHeight={12 * 1.45} style={styles.flex}>
        {children}
      </AppText>
    </View>
  );
}

const COLUMNS = 3;

// The design's stand-in tints, repeated by position (tile 5 = tile 1).
const TILE_TINTS: readonly GradientName[] = [
  'photoPlaceholder1',
  'photoPlaceholder2',
  'photoPlaceholder3',
  'photoPlaceholder4',
];

/**
 * The Sites tab: a three-column grid of square photo tiles with the
 * "Kaithozhil job" badge (CrewProfile.dc.html, gap 8, radius 14).
 *
 * React Native has no CSS grid, so the sites are split into rows of three and
 * each tile takes an equal share of its row (flex: 1). A short last row is
 * padded with empty cells so its tiles keep the same width, as CSS grid does.
 */
export function SiteGrid({ sites }: { sites: readonly CrewSite[] }) {
  const rows: CrewSite[][] = [];
  for (let start = 0; start < sites.length; start += COLUMNS) {
    rows.push(sites.slice(start, start + COLUMNS));
  }
  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={row[0]?.id ?? rowIndex} style={styles.row}>
          {row.map((site, column) => (
            <Gradient
              key={site.id}
              name={
                TILE_TINTS[(rowIndex * COLUMNS + column) % TILE_TINTS.length] ?? 'photoPlaceholder1'
              }
              style={[styles.cell, styles.tile]}
              // One image for screen readers, named like the design's aria-label.
              accessible
              accessibilityRole="image"
              accessibilityLabel={crewProfileCopy.siteLabel(site.caption, site.duration)}
              testID={`crew-site-${site.id}`}
            >
              <Icon name={site.icon} size={30} color={color.purple} strokeWidth={1.8} />
              <View style={styles.badge}>
                <Icon name="badgeCheck" size={11} color={color.gold} />
                <AppText size={9.5} weight={800} color={color.gold}>
                  {crewProfileCopy.jobBadge}
                </AppText>
              </View>
              <Gradient name="photoCaption" style={styles.caption}>
                <AppText size={10.5} weight={700} color={color.white} lineHeight={10.5 * 1.2}>
                  {site.caption}
                </AppText>
              </Gradient>
            </Gradient>
          ))}
          {Array.from({ length: COLUMNS - row.length }, (_, index) => (
            <View key={`empty-${index}`} style={styles.cell} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: color.lavender,
    borderRadius: radius.noteLarge,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 44,
  },
  linkText: { flexGrow: 1, flexShrink: 1 },
  heroShadow: { boxShadow: shadow.button },
  hero: { overflow: 'hidden' },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: radius.note,
    backgroundColor: color.lavender,
  },
  grid: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  cell: { flex: 1, minWidth: 0, aspectRatio: 1 },
  tile: {
    // 14 in the design; radius.note is the 14pt token.
    borderRadius: radius.note,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: color.photoBadge,
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  caption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 14,
    paddingHorizontal: 7,
    paddingBottom: 6,
  },
});
