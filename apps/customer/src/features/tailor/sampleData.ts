import type { Handover, TailorOrder } from './types';

// The design's sample data (design/source/{TailorBook,OrderStatus}.dc.html).
// Used by the routes until orders and measurements come from Supabase; delete
// this file then.

export const SAMPLE_ORDER: TailorOrder = {
  id: 'sample-tailor-order',
  summary: 'Blouse stitching × 2',
  tailor: { initials: 'MS', name: 'Meena S.', firstName: 'Meena', level: 2, rating: '4.8' },
  dates: {
    booked: 'Thu 13 Nov',
    measured: 'Sat 15 Nov',
    due: 'Fri 21 Nov',
    stitched: 'Thu 20 Nov',
    delivered: 'Fri 21 Nov',
  },
  how: 'Home measurement, delivered to you',
  pieces: 2,
  priceEach: '₹550',
  total: '₹1,100',
  measurements: 'Saved · Priya, Nov',
};

/** The "Use my saved measurements" row's second line on Tailor booking. */
export const SAMPLE_SAVED_MEASUREMENTS = 'Priya · saved October';

/** The pickup and delivery drawn in design/source/Handover.dc.html. */
export const SAMPLE_HANDOVER: Handover = {
  runner: { initials: 'AK', name: 'Arun K.', firstName: 'Arun' },
  tailorName: 'Meena S.',
  tailorFirstName: 'Meena',
  eta: 'about 15 min',
  pickupCode: '6152',
  pickupItems: ['2 blouse fabric pieces', '1 lining cloth', 'Design photo (shared in the app)'],
  deliveryItems: ['2 stitched blouses', 'Leftover fabric returned'],
  packedPhotoCount: 3,
};

/** When Handover.dc.html's "I've received everything" was recorded. */
export const SAMPLE_RECEIVED_AT = 'Fri 21 Nov, 5:12 PM';
