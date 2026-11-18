export type StitchingType = 'blouse' | 'salwar' | 'alterations' | 'uniform' | 'bridal' | 'mens';

/** Shop visit, the tailor measuring at home, or pickup and drop. */
export type TailorMethod = 'shopVisit' | 'homeMeasurement' | 'pickup';

export type NeedBy = 'threeDays' | 'week' | 'twoWeeks';

export type TailorDraft = {
  stitching: readonly StitchingType[];
  method: TailorMethod | null;
  pieces: number;
  needBy: NeedBy;
  useSavedMeasurements: boolean;
};

/** A draft that is ready to send. */
export type TailorBooking = Omit<TailorDraft, 'method'> & { method: TailorMethod };

export type MissingTailorDetail = 'stitching' | 'method' | null;

/** The design's stepper limits (TailorBook.dc.html: 1 to 20 pieces). */
export const MIN_PIECES = 1;
export const MAX_PIECES = 20;

/**
 * What still has to be chosen before a tailor booking can be sent, or null.
 *
 * WHY the stitching type comes first: it decides which tailors are asked (not
 * every tailor does bridal wear), and the design asks for it first. The method
 * decides whether anyone travels, so a booking without it cannot be scheduled.
 */
export function missingTailorDetail(
  draft: Pick<TailorDraft, 'stitching' | 'method'>,
): MissingTailorDetail {
  if (draft.stitching.length === 0) return 'stitching';
  if (draft.method === null) return 'method';
  return null;
}

/** The draft as a booking, or null while something is missing or out of range. */
export function toTailorBooking(draft: TailorDraft): TailorBooking | null {
  const { method } = draft;
  if (missingTailorDetail(draft) !== null || method === null) return null;
  if (!Number.isInteger(draft.pieces) || draft.pieces < MIN_PIECES || draft.pieces > MAX_PIECES) {
    return null;
  }
  return { ...draft, method };
}
