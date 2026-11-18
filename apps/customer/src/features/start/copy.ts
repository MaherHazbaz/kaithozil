// Exact wording from design/source/Splash.dc.html and Welcome.dc.html.
// English first, Tamil secondary. Do not reword without asking.
// These move into en.json / ta.json when i18next is added (next step in Sprint 1).

export const splashCopy = {
  tamilName: 'கைத்தொழில்',
  continueLabel: 'Continue to Kaithozhil',
} as const;

export const welcomeCopy = {
  brand: 'Kaithozhil',
  brandTamil: 'கைத்தொழில்',
  tagline: 'Trusted hands for every job',
  taglineTamil: 'ஒவ்வொரு வேலைக்கும் நம்பகமான கைகள்',
  language: 'Language',
  languages: ['English', 'தமிழ்'],
  needWorker: {
    title: 'I need a worker',
    tamil: 'வேலைக்கு ஆள் வேண்டும்',
    description: 'Repairs, home services and construction crews',
  },
  amWorker: {
    title: "I'm a worker",
    tamil: 'நான் ஒரு தொழிலாளி',
    description: 'Get jobs nearby and build your income record',
  },
  legal: {
    before: 'By continuing, you agree to the ',
    terms: 'Terms',
    between: ' and ',
    privacy: 'Privacy Policy',
    after: '.',
  },
} as const;

// Exact wording from design/source/Permissions.dc.html.
export type PermissionKey = 'location' | 'notifications' | 'camera';

export const permissionsCopy = {
  stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
  allow: 'Allow',
  notNow: 'Not now',
  steps: [
    {
      key: 'location',
      icon: 'mapPin',
      title: 'Allow location',
      titleTamil: 'இருப்பிட அனுமதி',
      body: 'So we can find verified workers near you and show when they will arrive.',
      points: [
        'Used only while you book or track a job',
        'Workers see your full address only after they accept',
      ],
    },
    {
      key: 'notifications',
      icon: 'bell',
      title: 'Allow notifications',
      titleTamil: 'அறிவிப்பு அனுமதி',
      body: 'So we can tell you when a worker accepts, arrives, or needs you to confirm a payment.',
      points: [
        'Only job and payment updates, no promotions',
        'Change this any time in your phone settings',
      ],
    },
    {
      key: 'camera',
      icon: 'camera',
      title: 'Allow camera',
      titleTamil: 'கேமரா அனுமதி',
      body: 'So you can add photos of the problem, and workers can record their skill check.',
      points: [
        'Photos go only to the worker on your job',
        'Used only when you tap a camera button',
      ],
    },
  ],
} as const;
