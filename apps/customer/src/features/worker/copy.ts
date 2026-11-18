// Exact wording from design/source/Book.dc.html. English first, Tamil secondary.
// These move into en.json / ta.json when i18next is added.
export const bookWorkerCopy = {
  back: 'Back',
  rating: 'Rating',
  ratingValue: (rating: string) => `★ ${rating}`,
  jobsDone: 'Jobs done',
  experience: 'Experience',
  experienceValue: (years: number) => `${years} yrs`,
  chooseTime: 'Choose a time',
  timeGroupLabel: 'Time slot',
  problem: 'Your problem',
  estimate: 'Estimate',
  priceNote: (firstName: string) => `Final price is agreed with ${firstName} before work starts.`,
  bookCta: (firstName: string, day: string, time: string) => `Book ${firstName} · ${day} ${time}`,
} as const;

// Exact wording from design/source/WorkerProfile.dc.html.
export const publicProfileCopy = {
  back: 'Back',
  save: 'Save',
  saved: 'Saved',
  // NOT visible in the design: screen-reader name of the Save button.
  saveLabel: (firstName: string) => `Save ${firstName}`,
  serves: (areas: readonly string[]) => `Serves ${areas.join(', ')}`,
  ratingValue: (rating: string) => `★ ${rating}`,
  reviews: (count: number) => `${count} reviews`,
  jobsDone: 'Jobs done',
  repeatValue: (percent: number) => `${percent}%`,
  repeat: 'Repeat',
  experienceValue: (years: number) => `${years} yrs`,
  experience: 'Experience',
  sections: 'Profile sections',
  workTab: (count: number) => `Work (${count})`,
  reviewsTab: (count: number) => `Reviews (${count})`,
  aboutTab: 'About',
  jobBadge: 'Kaithozhil job',
  // NOT visible in the design: what a screen reader says for a work photo.
  photoLabel: (caption: string, date: string) => `${caption}, ${date}`,
  workNote:
    "Every photo is from a job done through Kaithozhil, shared with the customer's permission.",
  reviewMeta: (job: string, date: string) => `${job} · ${date}`,
  stars: (count: number) => '★'.repeat(count),
  // NOT visible in the design: screen readers say "5 stars", not five symbols.
  starsLabel: (count: number) => `${count} stars`,
  safetyNote:
    'To keep everyone safe, you book and pay only through Kaithozhil. Phone numbers stay private; you can chat or call through the app once a job is booked.',
  book: (firstName: string) => `Book ${firstName}`,
} as const;
