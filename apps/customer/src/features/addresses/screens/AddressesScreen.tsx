import { AppText, Icon, PrimaryButton, color, radius } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { AddressCard } from '../components/AddressCard';
import { addressesCopy as copy } from '../copy';
import type { SavedAddress } from '../types';

export type AddressesScreenProps = {
  addresses: readonly SavedAddress[];
  defaultId: string | undefined;
  onBack: () => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
};

/** Customer · Saved addresses (design/source/Addresses.dc.html). */
export function AddressesScreen({
  addresses,
  defaultId,
  onBack,
  onAdd,
  onEdit,
  onRemove,
  onSetDefault,
}: AddressesScreenProps) {
  return (
    <PageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      onBack={onBack}
      footer={
        <PrimaryButton
          label={copy.addNew}
          icon="plusLines"
          iconSize={18}
          onPress={onAdd}
          testID="addresses-add"
        />
      }
    >
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          isDefault={address.id === defaultId}
          onEdit={() => onEdit(address.id)}
          onRemove={() => onRemove(address.id)}
          onSetDefault={() => onSetDefault(address.id)}
        />
      ))}
      {/* Larger than the shared InfoNote: radius 16, padding 12 14, 18pt icon, 13pt text. */}
      <View style={styles.note}>
        <Icon name="shield" size={18} color={color.purple} />
        <AppText size={13} lineHeight={13 * 1.4} style={styles.noteText}>
          {copy.privacyNote}
        </AppText>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: color.lavender,
    // 16 in the design; the same value as the button radius.
    borderRadius: radius.button,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  noteText: { flex: 1 },
});
