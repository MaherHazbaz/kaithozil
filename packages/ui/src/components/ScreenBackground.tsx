import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import type { GradientName } from '../tokens';
import { Gradient } from './Gradient';

type ScreenBackgroundProps = {
  children?: ReactNode;
  /** Defaults to the page gradient. Home uses its slightly darker `homePage` (owner change). */
  name?: GradientName;
};

/** The light page background used by every non-alert screen (top to bottom). */
export function ScreenBackground({ children, name = 'page' }: ScreenBackgroundProps) {
  return (
    <Gradient name={name} style={styles.fill}>
      {children}
    </Gradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
