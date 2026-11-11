// Exact wording from design/source/Login.dc.html. English first, Tamil secondary.
// These move into en.json / ta.json when i18next is added.

export const loginCopy = {
  back: 'Back',
  title: 'Log in',
  titleTamil: 'உள்நுழைக',
  heading: 'Enter your mobile number',
  headingTamil: 'உங்கள் மொபைல் எண்ணை உள்ளிடுங்கள்',
  mobileLabel: 'Mobile number',
  countryCode: '+91',
  mobileHelp: "We'll send a 6-digit code by SMS.",
  codeHeading: 'Enter the code',
  sentTo: (mobile: string) => `Sent to +91 ${mobile} · `,
  change: 'Change',
  codeGroupLabel: '6-digit code',
  digitLabel: (position: number) => `Digit ${position}`,
  resendIn: (time: string) => `Resend code in ${time}`,
  verify: 'Verify and continue',
  workerLink: 'Joining as a worker? Set up your profile',
} as const;
