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
