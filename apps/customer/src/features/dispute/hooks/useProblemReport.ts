import { useState } from 'react';

import { reportCopy } from '../copy';

/** What Report a problem sends to the server. */
export type ProblemReport = {
  reason: string;
  /** The typed account, or null when the field was left empty. */
  details: string | null;
};

/**
 * The Report a problem form. Only the reason is required (ReportProblem.dc.html
 * disables the button until one is chosen); the details and photos help the
 * other side and a reviewer but are optional.
 */
export function useProblemReport() {
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');

  /** The one-line reason under the disabled button, or null when it can be sent. */
  const missing = reason === null ? reportCopy.chooseReason : null;

  const report = (): ProblemReport | null => {
    if (reason === null) return null;
    const trimmed = details.trim();
    return { reason, details: trimmed === '' ? null : trimmed };
  };

  return { reason, setReason, details, setDetails, missing, report };
}
