import {
  AppText,
  Card,
  Icon,
  IconBox,
  Tappable,
  color,
  radius,
  type IconName,
} from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { addressesCopy as copy } from '../copy';
import type { SavedAddress } from '../types';

export type AddressCardProps = {
  address: SavedAddress;
  isDefault: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onSetDefault: () => void;
};

/** One card on Saved addresses. The default one has a 2pt purple border and a "Default" pill. */
export function AddressCard({
  address,
  isDefault,
  onEdit,
  onRemove,
  onSetDefault,
}: AddressCardProps) {
  return (
    <Card style={[styles.card, isDefault ? styles.cardDefault : null]}>
      <View style={styles.top}>
        <IconBox icon="mapPin" tone="lavender" size={40} />
        <View style={styles.text}>
          <View style={styles.labelRow}>
            <AppText size={16} weight={800} style={styles.shrink}>
              {address.label}
            </AppText>
            {isDefault ? (
              <View style={styles.pill}>
                <AppText size={12} weight={700} color={color.purple}>
                  {copy.default}
                </AppText>
              </View>
            ) : null}
          </View>
          <AppText size={13} lineHeight={13 * 1.4}>
            {address.line}
          </AppText>
          <AppText size={12} color={color.muted}>
            {address.near}
          </AppText>
        </View>
      </View>
      <View style={styles.actions}>
        <ActionButton
          icon="pencil"
          label={copy.edit}
          accessibilityLabel={copy.editLabel(address.label)}
          onPress={onEdit}
        />
        <ActionButton
          icon="trash"
          label={copy.remove}
          accessibilityLabel={copy.removeLabel(address.label)}
          onPress={onRemove}
        />
        <View style={styles.spacer} />
        {isDefault ? null : (
          <ActionButton
            label={copy.setDefault}
            accessibilityLabel={copy.setDefaultLabel(address.label)}
            onPress={onSetDefault}
            tint={color.purple}
          />
        )}
      </View>
    </Card>
  );
}

type ActionButtonProps = {
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
  icon?: IconName;
  tint?: string;
};

/** The 44pt outlined buttons under each address (Edit, Remove, Set as default). */
function ActionButton({
  label,
  accessibilityLabel,
  onPress,
  icon,
  tint = color.ink,
}: ActionButtonProps) {
  return (
    <Tappable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={styles.action}
    >
      {icon ? <Icon name={icon} size={16} color={tint} /> : null}
      <AppText size={13} weight={700} color={tint} numberOfLines={1}>
        {label}
      </AppText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, gap: 10 },
  // The padding stays 14 in the design, so the content moves in by 1pt, as it does there.
  cardDefault: { borderWidth: 2, borderColor: color.purple },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  text: { flex: 1, minWidth: 0, gap: 3 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shrink: { flexShrink: 1 },
  pill: {
    backgroundColor: color.lavender,
    borderRadius: radius.statusPill,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  spacer: { flex: 1 },
  action: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: radius.compactButton,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
