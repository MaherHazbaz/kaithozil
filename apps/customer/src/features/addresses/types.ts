/** One address on Saved addresses. */
export type SavedAddress = {
  id: string;
  /** "Home", "Office", or a name the customer chose ("Amma's house"). */
  label: string;
  /** Full street address, e.g. "12, 4th Street, Anna Nagar, Chennai 600040". */
  line: string;
  /** Landmark, e.g. "Near Tower Park". */
  near: string;
};

/** The "Save as" choices on Add or edit address. */
export type AddressLabel = 'home' | 'office' | 'other';

/** What Add or edit address collects. */
export type AddressDraft = {
  house: string;
  landmark: string;
  label: AddressLabel;
  isDefault: boolean;
};

/** The street and area under the map pin (the card above the fields). */
export type PinnedPlace = {
  /** "4th Street, Anna Nagar". */
  street: string;
  /** "Chennai, Tamil Nadu 600040". */
  area: string;
};
