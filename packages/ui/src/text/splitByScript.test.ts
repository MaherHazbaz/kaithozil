import { tamilWeight } from '../theme/fonts';
import { splitByScript } from './splitByScript';

describe('splitByScript', () => {
  it('returns one latin run for English text', () => {
    expect(splitByScript('Trusted hands for every job')).toEqual([
      { text: 'Trusted hands for every job', script: 'latin' },
    ]);
  });

  it('keeps spaces between Tamil words in the latin font, like a browser', () => {
    expect(splitByScript('நான் ஒரு')).toEqual([
      { text: 'நான்', script: 'tamil' },
      { text: ' ', script: 'latin' },
      { text: 'ஒரு', script: 'tamil' },
    ]);
  });

  it('splits a mixed line from the Home crew card', () => {
    const runs = splitByScript('Masons and helpers · கொத்தனார், பெரியாள்');
    expect(runs.map((run) => run.script)).toEqual(['latin', 'tamil', 'latin', 'tamil']);
    expect(runs.map((run) => run.text).join('')).toBe('Masons and helpers · கொத்தனார், பெரியாள்');
  });

  it('handles Tamil text that contains Latin letters', () => {
    expect(splitByScript('நேரடி UPI பணம்').map((run) => run.script)).toEqual([
      'tamil',
      'latin',
      'tamil',
    ]);
  });

  it('returns no runs for an empty string', () => {
    expect(splitByScript('')).toEqual([]);
  });
});

describe('tamilWeight', () => {
  it('maps to the bundled Noto Sans Tamil weights the way CSS font matching does', () => {
    expect(tamilWeight(400)).toBe(400);
    expect(tamilWeight(500)).toBe(400);
    expect(tamilWeight(600)).toBe(600);
    expect(tamilWeight(700)).toBe(700);
    expect(tamilWeight(800)).toBe(700);
  });
});
