// The sample data drawn in design/source/{CrewProfile,JobPlan,CrewTeam,CrewPayments}.dc.html.
// It stands in for the server until Supabase is wired (Sprint 2).
import type { ConfirmedCrew, CrewPayments, CrewProfile, CrewRequest, JobPlan } from './types';

/** Crew.dc.html's starting values: 2 masons, 3 heavy helpers, 2 site helpers for 5 days. */
export const defaultCrewRequest: CrewRequest = {
  work: 'house',
  counts: { mason: 2, heavyHelper: 3, siteHelper: 2 },
  days: 5,
  withMestri: true,
  unsure: false,
};

export const sampleCrewProfile: CrewProfile = {
  id: 'selvam-crew',
  name: "Selvam's crew",
  initials: 'SR',
  badge: 'Verified team · mestri Selvam R.',
  specialities: 'New houses · walls · plastering · tiling',
  rating: '4.7',
  siteCount: 64,
  experienceYears: 14,
  mestriFirstName: 'Selvam',
  members: [
    {
      id: 'm1',
      name: 'Selvam R.',
      initials: 'SR',
      role: 'Mestri and mason · கொத்தனார்',
      level: 'Level 3',
      isNew: false,
    },
    {
      id: 'm2',
      name: 'Kumar P.',
      initials: 'KP',
      role: 'Mason · கொத்தனார்',
      level: 'Level 2',
      isNew: false,
    },
    {
      id: 'm3',
      name: 'Raja S.',
      initials: 'RS',
      role: 'Heavy helper · பெரியாள்',
      level: 'Level 2',
      isNew: false,
    },
    {
      id: 'm4',
      name: 'Mani K.',
      initials: 'MK',
      role: 'Heavy helper · பெரியாள்',
      level: 'Level 1',
      isNew: false,
    },
    {
      id: 'm5',
      name: 'Velu T.',
      initials: 'VT',
      role: 'Heavy helper · பெரியாள்',
      level: 'New',
      isNew: true,
    },
    {
      id: 'm6',
      name: 'Lakshmi R.',
      initials: 'LR',
      role: 'Site helper · சித்தாள்',
      level: 'Level 2',
      isNew: false,
    },
    {
      id: 'm7',
      name: 'Meena D.',
      initials: 'MD',
      role: 'Site helper · சித்தாள்',
      level: 'Level 1',
      isNew: false,
    },
  ],
  sites: [
    { id: 's1', caption: 'Compound wall, Ambattur', duration: '2 weeks', icon: 'brickWall' },
    { id: 's2', caption: '2-floor house, Avadi', duration: '3 months', icon: 'home' },
    { id: 's3', caption: 'Plastering, Villivakkam', duration: '6 days', icon: 'brickWall' },
    { id: 's4', caption: 'Terrace room, Kolathur', duration: '5 weeks', icon: 'home' },
    { id: 's5', caption: 'Tiling, Anna Nagar', duration: '4 days', icon: 'brickWall' },
    { id: 's6', caption: 'Sump tank, Padi', duration: '8 days', icon: 'brickWall' },
  ],
  reviews: [
    {
      id: 'r1',
      name: 'Ramesh V.',
      initials: 'RV',
      job: 'Compound wall',
      date: 'Oct',
      stars: 5,
      text: 'Finished in the promised two weeks. Daily attendance photos made it easy to pay day by day.',
    },
    {
      id: 'r2',
      name: 'Sudha N.',
      initials: 'SN',
      job: 'Plastering',
      date: 'Sep',
      stars: 4,
      text: "Clean, careful work. One day's delay due to rain, informed in advance.",
    },
  ],
  areas: 'Anna Nagar, Ambattur, Avadi, Villivakkam',
};

export const sampleJobPlan: JobPlan = {
  id: 'KT-30112',
  status: 'review',
  crewId: 'crew-1',
  mestriFirstName: 'Selvam',
  mestriInitials: 'SR',
  context: 'After visiting your site · New house, Anna Nagar',
  counts: { mason: 2, heavyHelper: 3, siteHelper: 2 },
  days: 6,
  dateRange: 'Mon 17 Nov – Sat 22 Nov',
  message: "The foundation needs 6 days with this team. If it rains, I'll send a change request.",
  mestriConfirmedAt: '3:52 PM',
  startsAt: 'Mon 17 Nov, 8 AM',
};

export const sampleConfirmedCrew: ConfirmedCrew = {
  id: 'crew-1',
  startLine: 'Starts tomorrow, 8 AM · 12, 4th Street, Anna Nagar',
  mestriName: 'Selvam R.',
  mestriFirstName: 'Selvam',
  mestriInitials: 'SR',
  mestriMeta: 'Mestri · team leader · Verified · ★ 4.7 · 14 yrs',
  roles: [
    {
      role: 'mason',
      members: [
        { id: 'kp', name: 'Kumar P', initials: 'KP' },
        { id: 'am', name: 'Arun M', initials: 'AM' },
      ],
    },
    {
      role: 'heavyHelper',
      members: [
        { id: 'rs', name: 'Raja S', initials: 'RS' },
        { id: 'mk', name: 'Mani K', initials: 'MK' },
        { id: 'vt', name: 'Velu T', initials: 'VT' },
      ],
    },
    {
      role: 'siteHelper',
      members: [
        { id: 'lr', name: 'Lakshmi R', initials: 'LR' },
        { id: 'md', name: 'Meena D', initials: 'MD' },
      ],
    },
  ],
  days: 5,
  workLabel: 'New house',
};

const FULL_TEAM = [
  { role: 'mason', halfDays: 4 },
  { role: 'heavyHelper', halfDays: 6 },
  { role: 'siteHelper', halfDays: 4 },
] as const;

export const sampleCrewPayments: CrewPayments = {
  crewId: 'crew-1',
  context: "New house · Selvam's crew · Day 3 of 6",
  mestriFirstName: 'Selvam',
  totalDays: 6,
  paidDays: 2,
  days: [
    {
      id: 'd1',
      date: 'Mon 17 Nov',
      summary: '7 workers · full day',
      status: 'paid',
      attendance: FULL_TEAM,
      markedAt: '8:58 AM',
    },
    {
      id: 'd2',
      date: 'Tue 18 Nov',
      summary: '7 workers · full day',
      status: 'paid',
      attendance: FULL_TEAM,
      markedAt: '8:58 AM',
    },
    {
      id: 'd3',
      date: 'Wed 19 Nov',
      summary: '5 present · 1 half day · 1 absent',
      status: 'due',
      attendance: [
        { role: 'mason', halfDays: 4 },
        { role: 'heavyHelper', halfDays: 4 },
        // "Site helpers × 1.5": one full day and one half day.
        { role: 'siteHelper', halfDays: 3 },
      ],
      markedAt: '8:58 AM',
    },
  ],
};
