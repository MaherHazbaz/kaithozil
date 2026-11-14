// Exact wording from design/source/Book.dc.html. English first, Tamil secondary.
// These move into en.json / ta.json when i18next is added.
export const workerProfileCopy = {
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
