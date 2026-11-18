// The sample data drawn in design/source/{QuoteView,JobProgress,ChangeRequest}.dc.html.
// It stands in for the server until Supabase is wired (Sprint 2).
import type { ChangeJob, ChangeProposal, JobProgress, Quote } from './types';

export const sampleQuote: Quote = {
  id: 'Q-1001',
  summary: 'Interior walls · 2 BHK',
  validity: 'Valid 7 days',
  worker: {
    id: 'ravi-s',
    name: 'Ravi S.',
    firstName: 'Ravi',
    initials: 'RS',
    role: 'Painter · Level 2 · ',
    rating: '4.7',
    visitedOn: '15 Nov',
  },
  duration: '4 days',
  startsOn: 'Mon 17 Nov',
  lines: [
    { label: 'Labour', amountRupees: 9600, detail: '2 painters' },
    { label: 'Paint and materials', amountRupees: 7200, detail: 'Emulsion, 2 coats' },
    { label: 'Putty and primer', amountRupees: 1600 },
  ],
  planName: 'Materials first, rest at end',
  atStartRupees: 7200,
  note: 'Price includes moving furniture and covering floors.',
};

export const sampleProgress: JobProgress = {
  jobId: 'KT-20517',
  status: 'On track',
  summary: 'Interior walls · 2 BHK · Ravi S.',
  workerFirstName: 'Ravi',
  endsOn: 'Thu 20 Nov',
  partsDone: 3,
  partsTotal: 5,
  days: [
    {
      id: 'd1',
      weekday: 'Mon',
      date: '17',
      team: '2 painters · 8:55 AM – 5:40 PM',
      note: 'Moved furniture, covered floors, started putty in the hall.',
      photoCount: 3,
    },
    {
      id: 'd2',
      weekday: 'Tue',
      date: '18',
      team: '2 painters · 9:05 AM – 6:00 PM',
      note: 'Putty and primer finished in all rooms.',
      photoCount: 3,
    },
    {
      id: 'd3',
      weekday: 'Wed',
      date: '19',
      team: '2 painters · 8:50 AM · working now',
      note: 'First coat done in the hall and bedroom 1. Bedroom 2 tomorrow morning.',
      photoCount: 3,
    },
    {
      id: 'd4',
      weekday: 'Thu',
      date: '20',
      team: 'Not started',
      note: 'Planned: second coat in all rooms, then clean-up.',
      photoCount: 0,
    },
  ],
  todayIndex: 2,
  payments: [
    { key: 'start', amountRupees: 7200, paidOn: 'Mon 17 Nov' },
    { key: 'completion', amountRupees: 11200 },
  ],
};

export const sampleChangeJob: ChangeJob = {
  icon: 'zap',
  title: 'Fan repair · KT-20481 · Priya R.',
  agreedRupees: 650,
  customerFirstName: 'Priya',
  workerFirstName: 'Murugan',
};

export const sampleChangeProposal: ChangeProposal = {
  title: 'Rewire the switchboard',
  description: 'Switchboard wiring is loose and burnt. Needs rewiring for safety.',
  extraRupees: 250,
  extraTime: '+30 min',
  hasPhoto: true,
};
