// Exact wording from design/source/{NoInternet,ErrorState,EmptyState,UpdateApp,Maintenance}.dc.html.
// English first, Tamil secondary. These move into en.json / ta.json when i18next is added.
//
// Square-bracket values ([SUPPORT NUMBER], [TIME], [VERSION], [APP SIZE]) are decisions still to be
// made (DESIGN.md "Placeholders to decide") and stay visible until the owner supplies them.

export const noInternetCopy = {
  title: 'No internet connection',
  titleTamil: 'இணைய இணைப்பு இல்லை',
  body: "Check your mobile data or Wi-Fi. Anything you were typing is saved and will send when you're back online.",
  stillOffline: 'Still offline. Try moving near a window, or switch between mobile data and Wi-Fi.',
  helplineBefore: 'Urgent? Our helpline works without internet: ',
  helplineNumber: '[SUPPORT NUMBER]',
  helplineAfter: '.',
  tryAgain: 'Try again',
  checking: 'Checking…',
  openSettings: 'Open phone settings',
} as const;

export const errorStateCopy = {
  title: 'Something went wrong',
  titleTamil: 'ஏதோ தவறு நடந்துவிட்டது',
  body: "It's not you, it's us. Your bookings and payments are safe. Please try again in a moment.",
  referenceLabel: 'Error reference, for support',
  copy: 'Copy',
  copied: 'Copied ✓',
  copyLabel: 'Copy the error reference',
  tryAgain: 'Try again',
  goHome: 'Go home',
  getHelp: 'Get help',
} as const;

export const emptyStateCopy = {
  bookings: {
    heading: 'Your bookings',
    headingTamil: 'உங்கள் முன்பதிவுகள்',
    title: 'No bookings yet',
    titleTamil: 'இன்னும் முன்பதிவுகள் இல்லை',
    body: 'When you book a worker, your booking shows up here with live updates.',
    action: 'Book a worker',
  },
  search: {
    heading: 'Search workers',
    headingTamil: 'தேடல்',
    title: 'No electricians found nearby',
    titleTamil: 'அருகில் யாரும் கிடைக்கவில்லை',
    body: "Try fewer filters or a wider area. Or post the job and we'll find someone for you.",
    action: 'Post a job',
  },
} as const;

export const updateAppCopy = {
  headingRequired: 'Please update Kaithozhil',
  headingOptional: 'A new version is ready',
  headingTamil: 'புதிய பதிப்பைப் புதுப்பிக்கவும்',
  bodyRequired:
    'This version is too old to keep payments and verification safe. Updating takes about a minute.',
  bodyOptional: "Update when you're ready. You can keep using the app.",
  whatsNew: "What's new · புதியவை",
  newItems: [
    'Faster booking on slow networks',
    'Clearer payment confirmations',
    'Tamil voice help on more screens',
  ],
  versionLine: 'Version [VERSION] · about [APP SIZE]',
  updateNow: 'Update now',
  later: 'Later',
} as const;

export const maintenanceCopy = {
  title: "We'll be back soon",
  titleTamil: 'விரைவில் திரும்புவோம்',
  bodyBefore: 'Kaithozhil is being upgraded to serve you better. We expect to be back by ',
  bodyTime: '[TIME]',
  bodyAfter: '.',
  safe: 'Your bookings, earnings and payments are safe.',
  scheduled: 'Scheduled jobs stay as booked. Workers can still go to them.',
  urgentBefore: 'Urgent help: ',
  urgentNumber: '[SUPPORT NUMBER]',
  stillUpgrading: "Still upgrading. We'll send a notification when we're back.",
  checkAgain: 'Check again',
  checking: 'Checking…',
} as const;
