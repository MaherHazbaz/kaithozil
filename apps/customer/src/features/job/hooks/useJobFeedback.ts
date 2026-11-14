import { useState } from 'react';

import { toggleFeedbackTag, type FeedbackTag, type JobFeedback, type Rating } from '../jobFeedback';

/**
 * The rating and feedback chips on Pay and rate. Kept in the screen for now;
 * it is sent to the server once ratings exist there (Sprint 2).
 */
export function useJobFeedback(initial?: Partial<JobFeedback>) {
  const [rating, setRating] = useState<Rating>(initial?.rating ?? 0);
  const [tags, setTags] = useState<readonly FeedbackTag[]>(initial?.tags ?? []);

  return {
    rating,
    tags,
    setRating,
    toggleTag: (tag: FeedbackTag) => setTags((current) => toggleFeedbackTag(current, tag)),
  };
}
