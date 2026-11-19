import { compareVersions, fetchAppStatus, isUpdateRequired } from './appStatus';

describe('compareVersions', () => {
  it('compares number by number, not as text', () => {
    expect(compareVersions('0.10.0', '0.9.0')).toBeGreaterThan(0);
    expect(compareVersions('1.2.3', '1.2.4')).toBeLessThan(0);
    expect(compareVersions('2.0.0', '2.0.0')).toBe(0);
  });

  it('treats missing parts as 0', () => {
    expect(compareVersions('1.2', '1.2.0')).toBe(0);
    expect(compareVersions('1', '1.0.1')).toBeLessThan(0);
  });
});

describe('isUpdateRequired', () => {
  const status = { minimumVersion: '0.2.0', maintenance: false };

  it('blocks versions below the minimum only', () => {
    expect(isUpdateRequired('0.1.9', status)).toBe(true);
    expect(isUpdateRequired('0.2.0', status)).toBe(false);
    expect(isUpdateRequired('0.3.0', status)).toBe(false);
  });

  it('never blocks an unknown or malformed version', () => {
    expect(isUpdateRequired(undefined, status)).toBe(false);
    expect(isUpdateRequired('', status)).toBe(false);
    expect(isUpdateRequired('dev', status)).toBe(false);
    expect(isUpdateRequired('0.1.0', { ...status, minimumVersion: 'soon' })).toBe(false);
  });
});

describe('fetchAppStatus (sample data)', () => {
  it('allows every version and has no maintenance', async () => {
    const status = await fetchAppStatus();
    expect(status.maintenance).toBe(false);
    expect(isUpdateRequired('0.1.0', status)).toBe(false);
  });
});
