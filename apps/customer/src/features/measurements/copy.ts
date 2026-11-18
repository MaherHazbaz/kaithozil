// Exact wording from design/source/MyMeasurements.dc.html.
// English first, Tamil secondary. These move into en.json / ta.json when i18next is added.

export const measurementsCopy = {
  title: 'Measurements',
  titleTamil: 'அளவுகள்',
  whose: 'Whose measurements',
  // NOT visible in the design: the chip groups' screen-reader names (aria-label).
  personGroup: 'Person',
  garment: 'Garment',
  privacy: 'Only tailors you book can see these, and only for that order.',
  edit: 'Edit',
  book: 'Book with these',
  addPerson: 'Add a person',
} as const;
