import type { PublicWorkerProfile } from './types';

/**
 * SAMPLE DATA: the worker drawn in design/source/WorkerProfile.dc.html. The
 * profile comes from Supabase in Sprint 2, with real job photos.
 */
export const SAMPLE_PROFILE: PublicWorkerProfile = {
  id: 'murugan-k',
  name: 'Murugan K.',
  firstName: 'Murugan',
  initials: 'MK',
  badge: 'Verified · Level 2 Electrician',
  areas: ['Anna Nagar', 'Kilpauk', 'Aminjikarai'],
  rating: '4.8',
  reviewCount: 212,
  jobsDone: 280,
  repeatPercent: 58,
  experienceYears: 12,
  work: [
    { id: 'w1', caption: 'Bedroom fan and regulator', date: '10 Nov', icon: 'zap' },
    { id: 'w2', caption: 'Kitchen modular switchboard', date: '6 Nov', icon: 'zap' },
    { id: 'w3', caption: 'LED strip lighting in hall', date: '1 Nov', icon: 'lightbulb' },
    { id: 'w4', caption: 'Inverter wiring, 2BHK', date: '28 Oct', icon: 'battery' },
    { id: 'w5', caption: 'Geyser point in bathroom', date: '24 Oct', icon: 'wrench' },
    { id: 'w6', caption: 'MCB box upgrade', date: '19 Oct', icon: 'zap' },
  ],
  // The design draws three of the 212 reviews.
  reviews: [
    {
      id: 'r1',
      name: 'Priya R.',
      initials: 'PR',
      job: 'Fan repair',
      date: '10 Nov',
      stars: 5,
      text: 'Came on time, fixed the fan quickly and explained what was wrong. Very neat work.',
    },
    {
      id: 'r2',
      name: 'Karthik S.',
      initials: 'KS',
      job: 'Switchboard',
      date: '6 Nov',
      stars: 5,
      text: 'New switchboard in the kitchen looks clean. Fair price, agreed before starting.',
    },
    {
      id: 'r3',
      name: 'Lakshmi N.',
      initials: 'LN',
      job: 'Lighting',
      date: '1 Nov',
      stars: 4,
      text: 'Good LED work in the hall. Took a little longer than expected.',
    },
  ],
  about: [
    { icon: 'wrench', label: 'Skills', value: 'Wiring · fans · switchboards · inverter · LED' },
    { icon: 'globe', label: 'Languages', value: 'Tamil · English' },
    { icon: 'clock', label: 'Usually works', value: 'Mon–Sat, 8 AM – 7 PM' },
    { icon: 'idCard', label: 'Verified', value: 'Aadhaar · PAN · face match · UPI name' },
    {
      icon: 'graduationCap',
      label: 'Training',
      value: 'Electrical safety ✓ · Solar (in progress)',
    },
  ],
};
