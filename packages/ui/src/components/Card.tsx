import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { color, radius, shadow } from '../tokens';
import { Tappable } from './Tappable';

export type CardProps = {
  children?: ReactNode;
  /** Makes the whole card a button. */
  onPress?: () => void;
  accessibilityLabel?: string;
  /** Default true. Home's "Book again" card has no border. */
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** White surface: radius 20, soft border, card shadow. Pass padding and layout in `style`. */
export function Card({
  children,
  onPress,
  accessibilityLabel,
  bordered = true,
  style,
  testID,
}: CardProps) {
  const cardStyle = [styles.card, bordered ? styles.bordered : null, style];
  if (onPress) {
    return (
      <Tappable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        style={cardStyle}
      >
        {children}
      </Tappable>
    );
  }
  return (
    <View style={cardStyle} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.white,
    borderRadius: radius.card,
    boxShadow: shadow.card,
  },
  bordered: {
    borderWidth: 1,
    borderColor: color.borderSoft,
  },
});
