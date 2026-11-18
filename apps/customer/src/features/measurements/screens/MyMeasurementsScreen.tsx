import {
  AppText,
  Card,
  Chip,
  Icon,
  InfoNote,
  SecondaryButton,
  Tappable,
  color,
} from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { measurementsCopy as copy } from '../copy';
import { useMeasurementSelection } from '../hooks/useMeasurementSelection';
import type { MeasuredPerson, MeasurementSelection } from '../types';

export type MyMeasurementsScreenProps = {
  people: readonly [MeasuredPerson, ...MeasuredPerson[]];
  onBack: () => void;
  onEdit?: (selection: MeasurementSelection) => void;
  /** Opens Tailor booking with the shown measurements. */
  onBook?: (selection: MeasurementSelection) => void;
  onAddPerson?: () => void;
};

/** Customer · My measurements (design/source/MyMeasurements.dc.html). */
export function MyMeasurementsScreen({
  people,
  onBack,
  onEdit,
  onBook,
  onAddPerson,
}: MyMeasurementsScreenProps) {
  const { person, garment, pickPerson, pickGarment } = useMeasurementSelection(people);
  const selection = { personId: person.id, garment: garment.garment };

  return (
    <PageLayout title={copy.title} titleTamil={copy.titleTamil} onBack={onBack}>
      <View style={styles.group}>
        <AppText size={13} weight={700} color={color.muted}>
          {copy.whose}
        </AppText>
        <View style={styles.chips} accessibilityLabel={copy.personGroup}>
          {people.map((p) => (
            <Chip
              key={p.id}
              label={p.name}
              selected={p.id === person.id}
              onPress={() => pickPerson(p.id)}
            />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <AppText size={13} weight={700} color={color.muted}>
          {copy.garment}
        </AppText>
        <View style={styles.chips} accessibilityLabel={copy.garment}>
          {person.garments.map((g) => (
            <Chip
              key={g.garment}
              label={g.garment}
              selected={g.garment === garment.garment}
              onPress={() => pickGarment(g.garment)}
            />
          ))}
        </View>
      </View>

      <Card style={styles.table}>
        {garment.measurements.map((m) => (
          <View key={m.label} style={styles.row}>
            <View>
              <AppText size={14} weight={700}>
                {m.label}
              </AppText>
              <AppText size={11} color={color.muted}>
                {m.labelTamil}
              </AppText>
            </View>
            <AppText size={15} weight={800}>
              {m.value}
            </AppText>
          </View>
        ))}
        <AppText size={11} color={color.muted} style={styles.source}>
          {garment.source}
        </AppText>
      </Card>

      <InfoNote tone="info" icon="lock">
        {copy.privacy}
      </InfoNote>

      <View style={styles.pair}>
        <View style={styles.half}>
          <SecondaryButton
            label={copy.edit}
            icon="pencil"
            onPress={() => onEdit?.(selection)}
            testID="measurements-edit"
          />
        </View>
        <View style={styles.half}>
          <SecondaryButton
            label={copy.book}
            icon="ruler"
            onPress={() => onBook?.(selection)}
            testID="measurements-book"
          />
        </View>
      </View>

      <Tappable
        onPress={onAddPerson}
        accessibilityRole="button"
        style={styles.add}
        testID="measurements-add-person"
      >
        <Icon name="plus" size={16} color={color.purple} />
        <AppText size={14} weight={700} color={color.purple}>
          {copy.addPerson}
        </AppText>
      </Tappable>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  group: { gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  // The source sets padding 14 / gap 10 and then overrides them: 4 14, gap 0.
  table: { paddingVertical: 4, paddingHorizontal: 14 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  source: { paddingVertical: 10 },
  pair: { flexDirection: 'row', gap: 8 },
  half: { flex: 1 },
  add: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
