import { formatIndianMobile, INDIAN_MOBILE_DIGITS } from './phone';

describe('formatIndianMobile', () => {
  it('returns a string for any input (placeholder until the task is done)', () => {
    expect(typeof formatIndianMobile('98400 12345')).toBe('string');
    expect(INDIAN_MOBILE_DIGITS).toBe(10);
  });

  // YOUR TASK: turn each of these into a real test, then implement the function.
  it.todo('returns an empty string for an empty input');
  it.todo('leaves up to five digits ungrouped: "98400" -> "98400"');
  it.todo('adds a space after the fifth digit: "984001" -> "98400 1"');
  it.todo('formats a full number: "9840012345" -> "98400 12345"');
  it.todo('is stable when given its own output: "98400 12345" -> "98400 12345"');
  it.todo('drops everything that is not a digit: "98400-12345", "98400 12a45"');
  it.todo('keeps only the first ten digits: "984001234567" -> "98400 12345"');
});
