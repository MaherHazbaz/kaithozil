import type { payCopy } from './copy';

/** Stars given for a job. 0 means the customer has not rated it yet. */
export type Rating = 0 | 1 | 2 | 3 | 4 | 5;

export const RATINGS = [1, 2, 3, 4, 5] as const satisfies readonly Rating[];

export type FeedbackTag = (typeof payCopy.feedbackTags)[number]['key'];

export type JobFeedback = {
  rating: Rating;
  tags: readonly FeedbackTag[];
};

/** Adds the tag if it is missing, removes it if it is there. Never changes `tags` itself. */
export function toggleFeedbackTag(
  tags: readonly FeedbackTag[],
  tag: FeedbackTag,
): readonly FeedbackTag[] {
  return tags.includes(tag) ? tags.filter((chosen) => chosen !== tag) : [...tags, tag];
}
