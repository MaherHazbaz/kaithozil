// Exact wording from design/source/{Addresses,AddressEdit}.dc.html.
// English first, Tamil secondary. These move into en.json / ta.json when i18next is added.

export const addressesCopy = {
  title: 'Saved addresses',
  titleTamil: 'சேமித்த முகவரிகள்',
  default: 'Default',
  edit: 'Edit',
  editLabel: (label: string) => `Edit ${label}`,
  remove: 'Remove',
  removeLabel: (label: string) => `Remove ${label}`,
  setDefault: 'Set as default',
  // NOT visible in the design: the screen-reader name of "Set as default", so
  // the reader knows which address it applies to.
  setDefaultLabel: (label: string) => `Set ${label} as default`,
  privacyNote: 'Workers see your full address only after they accept your job.',
  addNew: 'Add new address',
} as const;

export const addressEditCopy = {
  back: 'Back',
  mapHint: 'Move the map to place the pin',
  useLocation: 'Use my current location',
  usingLocation: 'Using your current location',
  title: 'Add address',
  titleTamil: 'முகவரியைச் சேர்க்கவும்',
  house: 'House or flat number · வீட்டு எண்',
  housePlaceholder: 'e.g. 12, 2nd floor',
  landmark: 'Landmark (optional) · அடையாளம்',
  landmarkPlaceholder: 'e.g. Near Tower Park',
  saveAs: 'Save as',
  labels: { home: 'Home', office: 'Office', other: 'Other' },
  makeDefault: 'Make this my default address',
  makeDefaultDetail: 'Used first when you book',
  save: 'Save address',
  missingHouse: 'Add your house or flat number to save',
} as const;
