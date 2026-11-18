import { useState } from 'react';

import {
  missingTailorDetail,
  toTailorBooking,
  type NeedBy,
  type StitchingType,
  type TailorDraft,
  type TailorMethod,
} from '../tailorDraft';

export type TailorDraftInitial = Partial<TailorDraft>;

/**
 * The tailor booking being filled in, before it is sent. In memory only for
 * now, like useMechanicDraft; sending it is added here with the backend.
 * Defaults are the design's first state: nothing chosen, 1 piece, "In a week".
 */
export function useTailorDraft(initial: TailorDraftInitial = {}) {
  const [stitching, setStitching] = useState<readonly StitchingType[]>(initial.stitching ?? []);
  const [method, setMethod] = useState<TailorMethod | null>(initial.method ?? null);
  const [pieces, setPieces] = useState(initial.pieces ?? 1);
  const [needBy, setNeedBy] = useState<NeedBy>(initial.needBy ?? 'week');
  const [useSavedMeasurements, setUseSavedMeasurements] = useState(
    initial.useSavedMeasurements ?? true,
  );

  // Several types can be chosen at once (a blouse and an alteration).
  const toggleStitching = (type: StitchingType) =>
    setStitching((current) =>
      current.includes(type) ? current.filter((t) => t !== type) : [...current, type],
    );

  const draft: TailorDraft = { stitching, method, pieces, needBy, useSavedMeasurements };

  return {
    ...draft,
    toggleStitching,
    setMethod,
    setPieces,
    setNeedBy,
    toggleSavedMeasurements: () => setUseSavedMeasurements((on) => !on),
    /** What is still needed before the booking can be sent; null when ready. */
    missing: missingTailorDetail(draft),
    /** The booking to send, or null while it is incomplete. */
    booking: toTailorBooking(draft),
  };
}
