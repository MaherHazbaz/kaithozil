import { cancelCopy as copy, type CancelReason } from './copy';

/**
 * What still blocks the Cancel button, as the line shown under it, or null
 * when the customer may cancel. "Other" needs a typed reason.
 */
export function missingStep(reason: CancelReason | null, note: string): string | null {
  if (reason === null) return copy.chooseReason;
  if (reason === 'other' && note.trim() === '') return copy.tellReason;
  return null;
}
