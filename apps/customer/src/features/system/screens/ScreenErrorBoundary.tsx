import { useRouter, type ErrorBoundaryProps } from 'expo-router';
import { useState } from 'react';

import { makeErrorReference } from '../errorReference';

import { ErrorStateScreen } from './ErrorStateScreen';

/**
 * Something went wrong, shown in place of a screen that crashed while
 * rendering. The root layout gives it to the Stack, which wraps every screen
 * in its own error boundary (React's way of catching a render error in the
 * components below it), so the rest of the navigation history keeps working.
 *
 * The error itself is not logged or shown: it can contain personal data
 * (CLAUDE.md, Privacy). In development React still prints it to the console.
 */
export function ScreenErrorBoundary({ retry }: ErrorBoundaryProps) {
  const router = useRouter();
  // One reference per crash, kept while this screen is shown.
  const [reference] = useState(() => makeErrorReference());
  return (
    <ErrorStateScreen
      reference={reference}
      // Renders the crashed screen again; if it still fails, this shows again.
      onRetry={retry}
      onHome={() => router.replace('/home')}
      onHelp={() => router.push('/support')}
    />
  );
}
