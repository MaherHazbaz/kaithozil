export type Measurement = {
  label: string;
  labelTamil: string;
  /** Value with its unit, e.g. "86 cm". */
  value: string;
};

/** One garment's measurements for one person. */
export type GarmentMeasurements = {
  garment: string;
  measurements: readonly Measurement[];
  /** Who measured and when, e.g. "Measured by Meena S. · 15 Nov 2026". */
  source: string;
};

export type MeasuredPerson = {
  id: string;
  name: string;
  /** At least one garment: a person is only listed once something is measured. */
  garments: readonly [GarmentMeasurements, ...GarmentMeasurements[]];
};

/** Which person and garment the buttons act on. */
export type MeasurementSelection = { personId: string; garment: string };
