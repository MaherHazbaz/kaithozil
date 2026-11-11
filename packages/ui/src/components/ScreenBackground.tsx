import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { Gradient } from './Gradient';

/** The light page background used by every non-alert screen (page gradient, top to bottom). */
export function ScreenBackground({ children }: { children?: ReactNode }) {
  return (
    <Gradient name="page" style={styles.fill}>
      {children}
    </Gradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
