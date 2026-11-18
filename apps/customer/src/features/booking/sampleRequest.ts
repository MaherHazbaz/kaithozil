import type { BookingRequest, SimilarWorker, SuggestedTime } from './types';

// SAMPLE DATA: the request drawn in design/source/RequestSent.dc.html. In
// Sprint 2 it is read from Supabase and the outcome follows the worker's reply.

export const SAMPLE_REQUEST: BookingRequest = {
  id: 'murugan-k',
  worker: { firstName: 'Murugan', initials: 'MK' },
  job: 'Fan not working',
  trade: 'Electrician',
  tradePlural: 'electricians',
  slot: { day: 'Sat 15 Nov', time: '10 AM – 12 PM' },
  address: 'Home · 12, 4th Street, Anna Nagar',
  estimate: '₹400 – 700',
  replyBy: '6:30 PM today',
};

export const SAMPLE_SUGGESTION: SuggestedTime = {
  slot: { day: 'Sat 15 Nov', time: '2 – 4 PM' },
  message: 'Morning is already booked. I can come after lunch, around 2 PM.',
};

export const SAMPLE_SIMILAR_WORKERS: readonly SimilarWorker[] = [
  {
    id: 'senthil-r',
    name: 'Senthil R.',
    initials: 'SR',
    detail: 'Level 3 · 3.4 km',
    rating: '4.9',
  },
  {
    id: 'arun-p',
    name: 'Arun P.',
    initials: 'AP',
    detail: 'New on Kaithozhil · 1.6 km',
    rating: '5.0',
  },
];
