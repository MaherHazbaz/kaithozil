import { formatRupees } from '@kaithozhil/core';
import { AppText, IconBox, Tappable, color, radius } from '@kaithozhil/ui';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { jobLineCopy } from '../copy';
import type { DisputeJob } from '../types';

/**
 * The grey job line at the top of all four problem screens: 36pt lavender
 * icon, 13/700 title, 12pt muted detail (radius 14, padding 10 12, gap 10).
 */
export function JobLine({ job }: { job: DisputeJob }) {
  const title = jobLineCopy.title(job.summary, job.jobId);
  const detail = jobLineCopy.detail(job.people, job.day, formatRupees(job.paidRupees));
  return (
    // One stop for screen readers instead of two separate lines.
    <View style={styles.job} accessible accessibilityLabel={`${title}. ${detail}`}>
      <IconBox icon={job.icon} tone="lavender" size={36} />
      <View style={styles.shrink}>
        <AppText size={13} weight={700}>
          {title}
        </AppText>
        <AppText size={12} color={color.muted}>
          {detail}
        </AppText>
      </View>
    </View>
  );
}

export type AmountRowProps = {
  label: string;
  /** Small muted line under the label ("Materials, paid at the start"). */
  labelDetail?: string;
  value: string;
  /** DisputeStatus "Priya pays now": the label in ink, 800, instead of muted 400. */
  strong?: boolean;
  testID?: string;
};

/**
 * A label and a value with a divider below (Settlement.dc.html and
 * DisputeStatus.dc.html: centred, padding 9 0, gap 12, text 13, value 800).
 */
export function AmountRow({ label, labelDetail, value, strong = false, testID }: AmountRowProps) {
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={[label, labelDetail, value].filter(Boolean).join(', ')}
      testID={testID}
    >
      <View style={styles.shrink}>
        <AppText size={13} weight={strong ? 800 : 400} color={strong ? color.ink : color.muted}>
          {label}
        </AppText>
        {labelDetail ? (
          <AppText size={11} color={color.muted}>
            {labelDetail}
          </AppText>
        ) : null}
      </View>
      <AppText size={13} weight={800} align="right" style={styles.shrink}>
        {value}
      </AppText>
    </View>
  );
}

export type TextLinkProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
};

/** The purple 14/700 text link, at least 44pt high ("Can't agree? Ask Kaithozhil to review"). */
export function TextLink({ label, onPress, disabled, testID }: TextLinkProps) {
  return (
    <Tappable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="link"
      accessibilityState={{ disabled: Boolean(disabled) }}
      style={styles.link}
      testID={testID}
    >
      <AppText size={14} weight={700} color={color.purple} align="center">
        {label}
      </AppText>
    </Tappable>
  );
}

/** The centred icon, title and message of a step that is done or waiting (padding top varies). */
export function Outcome({
  icon,
  paddingTop,
  children,
}: {
  icon: ReactNode;
  paddingTop: number;
  children: ReactNode;
}) {
  return (
    <View style={[styles.outcome, { paddingTop }]}>
      {icon}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shrink: { flexShrink: 1 },
  job: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: color.pageBackground,
    borderRadius: radius.note,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  link: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outcome: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 6,
  },
});
