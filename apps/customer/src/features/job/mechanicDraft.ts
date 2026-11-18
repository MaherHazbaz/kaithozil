import {
  missingJobDetail,
  type JobDraft,
  type JobProblem,
  type JobTiming,
  type MissingJobDetail,
} from './jobDraft';

export type VehicleType = 'bike' | 'car' | 'autoVan' | 'other';

/** "home" = at home or work; "roadside" = broken down on the road (urgent). */
export type VehicleLocation = 'home' | 'roadside';

export type MechanicDraft = Pick<JobDraft, 'problem' | 'description'> & {
  vehicle: VehicleType | null;
  location: VehicleLocation;
  timing: JobTiming;
};

/** A draft that is ready to send. */
export type MechanicJob = Omit<MechanicDraft, 'vehicle'> & { vehicle: VehicleType };

export type MissingMechanicDetail = 'vehicle' | MissingJobDetail;

/**
 * What still has to be filled in before a mechanic job can be sent, or null.
 *
 * WHY the vehicle comes first: a bike mechanic cannot fix a van. The vehicle
 * decides which mechanics are called, so without it there is no one to ask.
 * The problem and description follow the same rule as other jobs (decision 0005).
 */
export function missingMechanicDetail(
  draft: Pick<MechanicDraft, 'vehicle' | 'problem' | 'description'>,
  problems: readonly JobProblem[],
): MissingMechanicDetail {
  if (draft.vehicle === null) return 'vehicle';
  return missingJobDetail(draft, problems);
}
