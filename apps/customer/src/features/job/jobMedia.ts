/** Media.dc.html: "Up to 3 photos". */
export const MAX_JOB_PHOTOS = 3;

/** Media.dc.html: "Recording… up to 60 seconds". */
export const MAX_VOICE_NOTE_SECONDS = 60;

export type JobPhoto = {
  id: string;
  /** Local file from the camera or gallery. Without one, the design's placeholder tile is shown. */
  uri?: string;
};

export type PhotoSource = 'camera' | 'gallery';

/** The voice-note card's three states (Media.dc.html). */
export type VoiceNoteState =
  { status: 'idle' } | { status: 'recording' } | { status: 'recorded'; durationSeconds: number };
