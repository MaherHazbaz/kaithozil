// Exact wording from design/source/{Language,Safety,Legal,DeleteAccount}.dc.html.
// English first, Tamil secondary. These move into en.json / ta.json when i18next is added.
//
// Square-bracket values are decisions still to be made (DESIGN.md "Placeholders to decide").

export const languageCopy = {
  title: 'Language',
  titleTamil: 'மொழி',
  appLanguage: 'App language',
  appLanguageHint: 'Choose the language shown first · முதலில் காட்டப்படும் மொழி',
  english: { mark: 'Aa', name: 'English', detail: 'English first, Tamil underneath' },
  tamil: { mark: 'அ', name: 'தமிழ்', detail: 'தமிழ் முதலில், ஆங்கிலம் கீழே · Tamil first' },
  readingHeading: 'Reading and listening',
  both: { title: 'Show both languages', detail: 'Keep the second language in small text' },
  voice: { title: 'Read job details aloud', detail: 'Voice in your chosen language' },
  large: { title: 'Larger text', detail: 'Easier to read on small phones' },
  changeLater: 'You can change this any time from Profile.',
  save: 'Save',
} as const;

export const safetyCopy = {
  title: 'Safety',
  titleTamil: 'பாதுகாப்பு',
  unsafeTitle: 'If you ever feel unsafe',
  unsafeBody: 'Leave first, then call. Our safety line answers 24 hours, in Tamil and English.',
  callLine: 'Call the safety line · [SAFETY NUMBER]',
  contactsHeading: 'Emergency contacts ',
  contactsHeadingTamil: '· அவசரத் தொடர்புகள்',
  edit: 'Edit',
  editLabel: (name: string) => `Edit ${name}`,
  addContact: 'Add another contact',
  name: 'Name',
  namePlaceholder: 'e.g. Kavya R.',
  phone: 'Mobile number',
  phonePlaceholder: '+91',
  saveContact: 'Save contact',
  duringJobs: 'During jobs ',
  duringJobsTamil: '· வேலையின் போது',
  shareLocation: {
    title: 'Share my live location with my contacts',
    detail: 'Only while a job is in progress, and when I tap Help',
  },
  preferWomen: {
    title: 'Prefer women workers or customers',
    detail: 'We show women first where possible',
  },
  goodToKnow: 'Good to know',
  tips: [
    'Everyone is ID-verified, and jobs start with door codes',
    'Never pay or take money outside the app',
    'Every Help tap is reviewed by our safety team',
  ],
} as const;

export const legalCopy = {
  title: 'Terms and privacy',
  titleTamil: 'விதிமுறைகள் · தனியுரிமை',
  sectionLabel: 'Section',
  tabs: { terms: 'Terms', privacy: 'Privacy', data: 'Your data' },
  termsIntro: 'The key points in plain words. The full terms decide if anything is unclear.',
  terms: [
    {
      icon: 'users',
      title: "We connect, we don't employ",
      titleTamil: 'இணைப்பாளர் மட்டுமே',
      body: "Kaithozhil connects customers with independent workers. Workers aren't Kaithozhil employees, and they set their own working hours.",
    },
    {
      icon: 'wallet',
      title: 'Payments',
      titleTamil: 'பணம் செலுத்துதல்',
      body: "Pay in the app so payments are verified. Cash payments aren't recorded or verified by Kaithozhil. Our fee is [FEE] and is shown before you book.",
    },
    {
      icon: 'calendar',
      title: 'Cancellations',
      titleTamil: 'ரத்து செய்தல்',
      body: 'Cancelling before a worker accepts is free. After that, [CANCELLATION RULE].',
    },
    {
      icon: 'scale',
      title: 'Disputes',
      titleTamil: 'புகார்கள்',
      body: 'Report a problem in the app. Work done is recorded, both sides are heard, and Kaithozhil decides within [X] days. You can appeal within 7 days.',
    },
    {
      icon: 'shield',
      title: 'Safety and conduct',
      titleTamil: 'பாதுகாப்பு',
      body: 'Be respectful and safe. Harassment, fraud or asking for payment outside the app can lead to removal.',
    },
  ],
  privacy: [
    {
      icon: 'idCard',
      title: 'What we collect',
      titleTamil: 'நாங்கள் சேகரிப்பவை',
      body: 'Your name, phone number and addresses; for workers, identity check results (never the full Aadhaar number), UPI ID, photos and location while online.',
    },
    {
      icon: 'eye',
      title: 'Why we use it',
      titleTamil: 'ஏன்',
      body: "To match jobs, keep everyone safe, verify payments and build workers' earnings statements. We never sell your data.",
    },
    {
      icon: 'users',
      title: 'Who sees it',
      titleTamil: 'யார் பார்க்கலாம்',
      body: "The other person on your job sees only what's needed, like your name and, after acceptance, the address. Lenders see statements only if a worker chooses to share them.",
    },
    {
      icon: 'clock',
      title: 'How long we keep it',
      titleTamil: 'எவ்வளவு காலம்',
      body: 'While your account is open, and payment records for [RETENTION PERIOD] as the law requires.',
    },
    {
      icon: 'mail',
      title: 'Questions or complaints',
      titleTamil: 'குறைதீர்ப்பு அலுவலர்',
      body: 'Grievance officer: [GRIEVANCE OFFICER], [EMAIL]. We reply within [RESPONSE TIME].',
    },
  ],
  dataIntro: 'Your data belongs to you. You can see it, correct it, or delete it.',
  dataActions: [
    {
      key: 'download',
      icon: 'download',
      title: 'Download my data',
      detail: 'A copy of your profile, jobs and payments',
    },
    {
      key: 'correct',
      icon: 'pencil',
      title: 'Correct my details',
      detail: 'Name, phone number, addresses',
    },
    {
      key: 'consents',
      icon: 'shield',
      title: 'Manage my consents',
      detail: "Change what you've agreed to share",
    },
    {
      key: 'delete',
      icon: 'trash',
      title: 'Delete my account',
      detail: 'Remove your account and data',
    },
  ],
  readFull: 'Read the full terms and privacy policy',
  versionLine: 'Version [VERSION] · last updated [DATE] · English and Tamil',
} as const;

export const deleteAccountCopy = {
  title: 'Log out or delete',
  titleTamil: 'வெளியேறு · கணக்கை நீக்கு',
  logOutTitle: 'Log out',
  logOutDetail: 'Your account stays. Log in again any time.',
  logOut: 'Log out',
  deleteHeading: 'Delete my account ',
  deleteHeadingTamil: '· கணக்கை நீக்கு',
  beforeTitle: 'Before you go',
  before: ['No active bookings or unpaid jobs', 'No open disputes'],
  beforeNote: 'Both are needed before an account can be deleted.',
  whatTitle: 'What happens',
  what: [
    'Your profile, addresses, photos and chats are deleted after 30 days. You can log in before then to cancel.',
    'Payment records are kept for [RETENTION PERIOD] because the law requires it, then deleted.',
  ],
  whyLabel: 'Why are you leaving? (optional)',
  whyGroupLabel: 'Reason',
  reasons: [
    { key: 'notNeeded', label: "I don't need it any more" },
    { key: 'otherAccount', label: 'I have another account' },
    { key: 'privacy', label: 'Privacy concerns' },
    { key: 'other', label: 'Something else' },
  ],
  understand: 'I understand my account will be deleted',
  delete: 'Delete my account',
  // NOT in the design: read after the disabled button's name (decision 0005).
  understandFirst: 'Tick "I understand" first',
  confirmTitle: "Confirm it's you",
  codeSent: (maskedPhone: string) => `We sent a 6-digit code to ${maskedPhone}`,
  codeLabel: 'Code',
  codePlaceholder: '6-digit code',
  enterCode: 'Enter the 6-digit code',
  goBack: 'Go back',
  doneTitle: 'Deletion scheduled',
  doneTitleTamil: 'கணக்கு நீக்கம் திட்டமிடப்பட்டது',
  doneBefore: 'Your account will be deleted on ',
  doneDate: '[DATE + 30 DAYS]',
  doneAfter: '. Changed your mind? Just log in before then.',
  close: 'Close',
} as const;
