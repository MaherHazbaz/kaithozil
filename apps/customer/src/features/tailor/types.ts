/** Where a tailor order is. OrderStatus.dc.html draws these three. */
export type OrderStage = 'stitching' | 'ready' | 'delivered';

/** Dates as shown, e.g. "Thu 13 Nov". Later steps are missing until they happen. */
export type OrderDates = {
  booked: string;
  measured: string;
  /** The date the customer needs it by. */
  due: string;
  stitched?: string;
  delivered?: string;
};

export type TailorOrder = {
  id: string;
  /** e.g. "Blouse stitching × 2". */
  summary: string;
  tailor: {
    initials: string;
    /** e.g. "Meena S." */
    name: string;
    firstName: string;
    level: number;
    rating: string;
  };
  dates: OrderDates;
  /** e.g. "Home measurement, delivered to you". */
  how: string;
  pieces: number;
  /** Formatted amounts, e.g. "₹550" and "₹1,100". */
  priceEach: string;
  total: string;
  /** e.g. "Saved · Priya, Nov". */
  measurements: string;
};

/** Which half of Handover.dc.html: the runner collecting fabric, or bringing the clothes back. */
export type HandoverStep = 'pickup' | 'delivery';

/** A pickup or delivery for a tailor order (Handover.dc.html). */
export type Handover = {
  /** The verified runner who carries the order, e.g. Arun K. */
  runner: { initials: string; name: string; firstName: string };
  /** e.g. "Meena S." */
  tailorName: string;
  tailorFirstName: string;
  /** e.g. "about 15 min". */
  eta: string;
  /** Four digits, made on the server; given to the runner at pickup. */
  pickupCode: string;
  /** "What you're handing over". */
  pickupItems: readonly string[];
  /** "Check before you confirm". */
  deliveryItems: readonly string[];
  /** Photos the tailor took when packing the order. */
  packedPhotoCount: number;
};
