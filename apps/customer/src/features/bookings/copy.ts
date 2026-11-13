// Exact wording from design/source/Bookings.dc.html. English first, Tamil secondary.
// These move into en.json / ta.json when i18next is added.

export const bookingsCopy = {
  title: 'Your bookings',
  titleTamil: 'உங்கள் முன்பதிவுகள்',
  showLabel: 'Show',
  upcomingTab: (count: number) => `Upcoming (${count})`,
  pastTab: (count: number) => `Past (${count})`,
  pastHeading: 'Past',
  paid: 'Paid ✓',
  bookAgain: 'Book again',
  getHelp: 'Get help',
} as const;
