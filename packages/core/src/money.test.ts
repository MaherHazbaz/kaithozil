import { formatRupees } from './money';

describe('formatRupees', () => {
  it('puts the rupee sign before small amounts, as in the design', () => {
    expect(formatRupees(650)).toBe('₹650');
    expect(formatRupees(350)).toBe('₹350');
    expect(formatRupees(0)).toBe('₹0');
  });

  // YOUR TASK: turn each of these into a real test, then implement the grouping.
  it.todo('groups thousands: 1500 -> "₹1,500"');
  it.todo('uses two-digit groups above a thousand: 125000 -> "₹1,25,000"');
  it.todo('handles crores: 12345678 -> "₹1,23,45,678"');
  it.todo('does not add a comma to exactly three digits: 999 -> "₹999"');
});
