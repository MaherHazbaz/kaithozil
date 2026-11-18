import { useState } from 'react';

import type { JobProblem, JobTiming } from '../jobDraft';
import {
  missingMechanicDetail,
  type MechanicDraft,
  type VehicleLocation,
  type VehicleType,
} from '../mechanicDraft';

export type MechanicDraftInitial = Partial<MechanicDraft>;

/**
 * The mechanic job being described, before it is sent. In memory only for
 * now, like useJobDraft; sending it is added here with the backend.
 */
export function useMechanicDraft(
  problems: readonly JobProblem[],
  initial: MechanicDraftInitial = {},
) {
  const [vehicle, setVehicle] = useState<VehicleType | null>(initial.vehicle ?? null);
  const [problem, setProblem] = useState<string | null>(initial.problem ?? null);
  const [description, setDescription] = useState(initial.description ?? '');
  const [location, setLocationState] = useState<VehicleLocation>(initial.location ?? 'home');
  const [timing, setTiming] = useState<JobTiming>(initial.timing ?? 'now');

  // A broken-down vehicle needs help now, so choosing it switches back to
  // "Now" (as the design does). The customer can still pick Schedule after.
  const setLocation = (next: VehicleLocation) => {
    setLocationState(next);
    if (next === 'roadside') setTiming('now');
  };

  return {
    vehicle,
    problem,
    description,
    location,
    timing,
    setVehicle,
    setProblem,
    setDescription,
    setLocation,
    setTiming,
    /** What is still needed before the job can be sent; null when ready. */
    missing: missingMechanicDetail({ vehicle, problem, description }, problems),
  };
}
