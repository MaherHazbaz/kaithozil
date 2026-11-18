import type { WorkerResult } from './types';

// The three workers drawn in design/source/Search.dc.html, used by the /search
// route and the tests until results come from Supabase (Sprint 2).
// `freeThisWeek` is not drawn in the design; all three are shown as free.
export const SAMPLE_WORKERS: readonly WorkerResult[] = [
  {
    id: 'murugan-k',
    name: 'Murugan K.',
    initials: 'MK',
    trade: 'Electrician',
    level: 2,
    rating: 4.8,
    jobsDone: 280,
    distanceKm: 2.1,
    freeThisWeek: true,
    work: [
      { label: 'Fan and regulator', icon: 'zap' },
      { label: 'Switchboard', icon: 'zap' },
      { label: 'LED lighting', icon: 'lightbulb' },
    ],
  },
  {
    id: 'senthil-r',
    name: 'Senthil R.',
    initials: 'SR',
    trade: 'Electrician',
    level: 3,
    rating: 4.9,
    jobsDone: 512,
    distanceKm: 3.4,
    freeThisWeek: true,
    work: [
      { label: 'Panel upgrade', icon: 'zap' },
      { label: 'Inverter', icon: 'battery' },
      { label: 'Full wiring', icon: 'wrench' },
    ],
  },
  {
    id: 'arun-p',
    name: 'Arun P.',
    initials: 'AP',
    trade: 'Electrician',
    level: null,
    rating: 5.0,
    jobsDone: 3,
    distanceKm: 1.6,
    freeThisWeek: true,
    work: [
      { label: 'Fan install', icon: 'zap' },
      { label: 'Light fitting', icon: 'lightbulb' },
    ],
  },
];
