import type { MeasuredPerson } from './types';

// The design's sample data (the <script> in design/source/MyMeasurements.dc.html).
// Used by the route until measurements come from Supabase; delete this file then.

export const SAMPLE_PEOPLE: readonly [MeasuredPerson, ...MeasuredPerson[]] = [
  {
    id: 'self',
    name: 'Priya',
    garments: [
      {
        garment: 'Blouse',
        source: 'Measured by Meena S. · 15 Nov 2026',
        measurements: [
          { label: 'Bust', labelTamil: 'மார்பு', value: '86 cm' },
          { label: 'Waist', labelTamil: 'இடுப்பு', value: '72 cm' },
          { label: 'Shoulder', labelTamil: 'தோள்', value: '36 cm' },
          { label: 'Blouse length', labelTamil: 'நீளம்', value: '38 cm' },
          { label: 'Sleeve length', labelTamil: 'கை நீளம்', value: '24 cm' },
          { label: 'Armhole', labelTamil: 'கைக்குழி', value: '40 cm' },
          { label: 'Front neck depth', labelTamil: 'முன் கழுத்து', value: '18 cm' },
          { label: 'Back neck depth', labelTamil: 'பின் கழுத்து', value: '20 cm' },
        ],
      },
      {
        garment: 'Kurta',
        source: 'Measured by Meena S. · 2 Aug 2026',
        measurements: [
          { label: 'Chest', labelTamil: 'மார்பு', value: '88 cm' },
          { label: 'Waist', labelTamil: 'இடுப்பு', value: '74 cm' },
          { label: 'Shoulder', labelTamil: 'தோள்', value: '37 cm' },
          { label: 'Kurta length', labelTamil: 'நீளம்', value: '102 cm' },
          { label: 'Sleeve length', labelTamil: 'கை நீளம்', value: '56 cm' },
        ],
      },
    ],
  },
  {
    id: 'amma',
    name: 'Amma',
    garments: [
      {
        garment: 'Blouse',
        source: 'Added by you · 10 Jun 2026',
        measurements: [
          { label: 'Bust', labelTamil: 'மார்பு', value: '94 cm' },
          { label: 'Waist', labelTamil: 'இடுப்பு', value: '84 cm' },
          { label: 'Shoulder', labelTamil: 'தோள்', value: '38 cm' },
          { label: 'Blouse length', labelTamil: 'நீளம்', value: '40 cm' },
          { label: 'Sleeve length', labelTamil: 'கை நீளம்', value: '28 cm' },
        ],
      },
    ],
  },
];
