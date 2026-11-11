export type Script = 'latin' | 'tamil';
export type TextRun = { text: string; script: Script };

// The Tamil Unicode block, plus the zero-width joiners Tamil text can contain.
const TAMIL_RUN = /[஀-௿‌‍]+/g;

/**
 * Splits a string into runs of Tamil and non-Tamil characters.
 *
 * WHY: the design's CSS uses `font-family: 'Plus Jakarta Sans', 'Noto Sans Tamil'`.
 * A browser picks the font per character: Latin letters, digits, spaces and
 * punctuation come from Plus Jakarta Sans, and only Tamil characters fall
 * through to Noto Sans Tamil. React Native has no fallback list (one Text has
 * one fontFamily), so we split the string ourselves and give each run its font.
 *
 * Spaces and punctuation between Tamil words stay "latin" on purpose, because
 * that is what the browser does.
 */
export function splitByScript(text: string): TextRun[] {
  const runs: TextRun[] = [];
  let cursor = 0;

  for (const match of text.matchAll(TAMIL_RUN)) {
    const start = match.index;
    if (start > cursor) {
      runs.push({ text: text.slice(cursor, start), script: 'latin' });
    }
    runs.push({ text: match[0], script: 'tamil' });
    cursor = start + match[0].length;
  }

  if (cursor < text.length) {
    runs.push({ text: text.slice(cursor), script: 'latin' });
  }

  return runs;
}
