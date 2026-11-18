// Exact wording from design/source/RequestSent.dc.html. English first, Tamil
// secondary. These move into en.json / ta.json when i18next is added.
//
// The Tamil lines name Murugan as drawn. They need the worker's name with
// Tamil case endings (முருகனுக்கு), which comes with i18next in Sprint 2.

export const requestSentCopy = {
  title: 'Your booking',
  titleTamil: 'உங்கள் முன்பதிவு',
  slot: (day: string, time: string) => `${day} · ${time}`,
  summary: {
    job: 'Job',
    when: 'When',
    where: 'Where',
    estimate: 'Estimate',
    estimateNote: 'Final price agreed on site',
  },
  waiting: {
    title: (firstName: string) => `Request sent to ${firstName}`,
    titleTamil: 'முருகனுக்கு கோரிக்கை அனுப்பப்பட்டது',
    bodyBefore: "He'll reply by ",
    bodyAfter: ". If he can't take it, we'll help you find someone else straight away.",
    stepSent: 'Request sent',
    stepReplies: (firstName: string) => `${firstName} replies`,
    stepConfirmed: 'Booking confirmed',
    // NOT visible in the design: the step states, for screen readers.
    stepDone: 'done',
    stepNow: 'now',
    stepNext: 'next',
    note: 'Chat and calls open once he accepts. Nothing is charged for a request.',
    cancel: 'Cancel request',
  },
  accepted: {
    title: (firstName: string) => `${firstName} confirmed your booking`,
    titleTamil: 'முன்பதிவு உறுதி செய்யப்பட்டது',
    body: "We'll remind you on the day. You'll give him an arrival code at the door, then a work-start code.",
    message: (firstName: string) => `Message ${firstName}`,
    bookings: 'Go to my bookings',
  },
  newTime: {
    title: (firstName: string) => `${firstName} suggested another time`,
    titleTamil: 'வேறு நேரம் பரிந்துரைக்கப்பட்டது',
    body: "He can't make your slot, but can come later the same day.",
    askedFor: 'You asked for',
    newTime: 'New time',
    accept: (time: string) => `Accept ${time}`,
    pickAnother: 'Pick another time',
    chooseAnother: 'Choose another worker',
  },
  declined: {
    title: (firstName: string) => `${firstName} isn't available`,
    titleTamil: 'முருகன் கிடைக்கவில்லை',
    body: "He's fully booked on Saturday. Your request has been closed, and nothing was charged.",
    findWorker: 'Let Kaithozhil find a worker',
    similar: (tradePlural: string) => `Similar ${tradePlural} near you`,
    rating: (rating: string) => `★ ${rating}`,
    seeAll: (tradePlural: string) => `See all ${tradePlural}`,
  },
} as const;
