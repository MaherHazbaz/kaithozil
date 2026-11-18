import { useState } from 'react';

import type { GarmentMeasurements, MeasuredPerson } from '../types';

export type MeasurementSelectionState = {
  person: MeasuredPerson;
  garment: GarmentMeasurements;
  pickPerson: (personId: string) => void;
  pickGarment: (garment: string) => void;
};

/**
 * Which person and garment are shown. Picking another person goes back to that
 * person's first garment, as in the design: not everyone has every garment.
 */
export function useMeasurementSelection(
  people: readonly [MeasuredPerson, ...MeasuredPerson[]],
): MeasurementSelectionState {
  const [personId, setPersonId] = useState(people[0].id);
  const [garmentName, setGarmentName] = useState<string | null>(null);

  // Falls back to the first entry if the list changes under the selection
  // (for example after a refetch removes a person).
  const person = people.find((p) => p.id === personId) ?? people[0];
  const garment = person.garments.find((g) => g.garment === garmentName) ?? person.garments[0];

  return {
    person,
    garment,
    pickPerson: (id) => {
      setPersonId(id);
      setGarmentName(null);
    },
    pickGarment: setGarmentName,
  };
}
