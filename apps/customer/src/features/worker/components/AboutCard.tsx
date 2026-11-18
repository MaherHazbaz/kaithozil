import { AppText, IconBox, color, radius, shadow } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import type { AboutFact } from '../types';

/** The About tab: skills, languages, hours, checks and training (WorkerProfile.dc.html). */
export function AboutCard({ facts }: { facts: readonly AboutFact[] }) {
  return (
    <View style={styles.card}>
      {facts.map((fact) => (
        // Label and value are read together: "Languages, Tamil · English".
        <View
          key={fact.label}
          style={styles.row}
          accessible
          accessibilityLabel={`${fact.label}, ${fact.value}`}
        >
          <IconBox icon={fact.icon} tone="lavender" size={34} />
          <View style={styles.text}>
            <AppText size={12} color={color.muted}>
              {fact.label}
            </AppText>
            <AppText size={14} weight={700}>
              {fact.value}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // Like `Card`, but radius 18 here instead of 20.
  card: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.borderSoft,
    borderRadius: radius.choiceCard,
    paddingVertical: 4,
    paddingHorizontal: 14,
    boxShadow: shadow.card,
  },
  // Every row has the divider, the last one too, as drawn.
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  text: { flexShrink: 1 },
});
