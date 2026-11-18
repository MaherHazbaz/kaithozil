import { useState } from 'react';

import { MAX_JOB_PHOTOS, type JobPhoto } from '../jobMedia';

/**
 * The photos attached to the job being described.
 *
 * Adding needs the camera or gallery (expo-image-picker, not installed yet),
 * which will call `addPhoto` with the picked file. Removing works already.
 */
export function useJobMedia(initialPhotos: readonly JobPhoto[] = []) {
  const [photos, setPhotos] = useState<readonly JobPhoto[]>(initialPhotos);

  const addPhoto = (photo: JobPhoto) =>
    setPhotos((current) => (current.length >= MAX_JOB_PHOTOS ? current : [...current, photo]));
  const removePhoto = (id: string) =>
    setPhotos((current) => current.filter((photo) => photo.id !== id));

  return { photos, addPhoto, removePhoto };
}
