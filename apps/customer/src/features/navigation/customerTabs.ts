// The customer's bottom navigation, shared by Home, Bookings and Profile.
// Wording from design/source/Main.dc.html (identical on every tab screen).

export const CUSTOMER_TABS = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'bookings', label: 'Bookings', icon: 'calendar' },
  { key: 'profile', label: 'Profile', icon: 'user' },
] as const;

export type CustomerTab = (typeof CUSTOMER_TABS)[number]['key'];
