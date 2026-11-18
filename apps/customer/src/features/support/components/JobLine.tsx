import { AppText, IconBox, color } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import type { SupportJob } from '../types';

export type JobLineProps = {
  job: SupportJob;
  /**
   * Support.dc.html draws a 40pt icon with a 15/800 title; Ticket.dc.html, a
   * 36pt icon with a 13/700 title inside a grey box.
   */
  compact?: boolean;
};

/** "Fan repair · KT-20481 / 10 Nov · Murugan K. · ₹650" with the service icon. */
export function JobLine({ job, compact = false }: JobLineProps) {
  return (
    <View style={[styles.row, compact ? styles.compact : styles.regular]}>
      <IconBox icon={job.icon} tone="lavender" size={compact ? 36 : 40} />
      <View style={styles.text}>
        <AppText size={compact ? 13 : 15} weight={compact ? 700 : 800}>
          {job.title}
        </AppText>
        <AppText size={12} color={color.muted}>
          {job.detail}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  regular: { gap: 12 },
  compact: { gap: 10 },
  text: { flexShrink: 1 },
});
