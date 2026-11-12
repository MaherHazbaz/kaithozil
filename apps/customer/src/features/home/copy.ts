// Exact wording from design/source/Main.dc.html. English first, Tamil secondary.
// These move into en.json / ta.json when i18next is added.
import type { IconBoxTone, IconName } from '@kaithozhil/ui';

export const homeCopy = {
  brand: 'Kaithozhil',
  profileLabel: 'Your profile',
  greeting: (name: string) => `Vanakkam, ${name}`,
  youAreIn: "You're in",
  thereAre: 'There are ',
  verifiedWorkers: (count: number) => `${count} verified workers`,
  aroundYou: ' around you.',
  searchLabel: 'What needs fixing?',
  searchPlaceholder: 'What needs fixing today?',
  voiceLabel: 'Describe by voice',
  servicesLabel: 'Services',
  carouselLabel: 'Why Kaithozhil',
  showSlide: (position: number, name: string) => `Show slide ${position}: ${name}`,
  crew: {
    title: 'Construction crew',
    subtitle: 'Masons and helpers · கொத்தனார், பெரியாள், சித்தாள்',
  },
  bookAgain: 'Book again',
  book: 'Book',
  nav: { home: 'Home', bookings: 'Bookings', profile: 'Profile' },
} as const;

export type ServiceKey =
  'electrician' | 'plumber' | 'ac' | 'carpenter' | 'tailor' | 'painter' | 'mechanic';

export type Service = {
  key: ServiceKey;
  label: string;
  tamil: string;
  icon: IconName;
  tone: IconBoxTone;
};

// Owner changes to the design (docs/decisions/0004-service-tile-changes.md):
// Plumber uses a tap and Carpenter a sofa instead of the design's droplet and
// wrench, and the Mechanic tile is new. Mechanic takes the wrench as the common
// symbol for all vehicles; bike vs car is chosen on the Describe-the-job screen.
export const services: readonly Service[] = [
  { key: 'electrician', label: 'Electrician', tamil: 'மின் பணியாளர்', icon: 'zap', tone: 'mango' },
  { key: 'plumber', label: 'Plumber', tamil: 'குழாய்', icon: 'faucet', tone: 'lavender' },
  { key: 'ac', label: 'AC repair', tamil: 'ஏசி பழுது', icon: 'snowflake', tone: 'lavender' },
  { key: 'carpenter', label: 'Carpenter', tamil: 'தச்சர்', icon: 'sofa', tone: 'mango' },
  { key: 'tailor', label: 'Tailor', tamil: 'தையல்', icon: 'scissors', tone: 'lavender' },
  { key: 'painter', label: 'Painter', tamil: 'பெயிண்டர்', icon: 'paintRoller', tone: 'lavender' },
  // Mango continues the design's mango, lavender, lavender pattern.
  { key: 'mechanic', label: 'Mechanic', tamil: 'வாகன பழுது', icon: 'wrench', tone: 'mango' },
];
