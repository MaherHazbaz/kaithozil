import {
  AppText,
  Chip,
  Icon,
  PrimaryButton,
  ScreenBackground,
  Tappable,
  Toggle,
  color,
  fontFamily,
  radius,
  shadow,
  spacing,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ADDRESS_MAP_HEIGHT, AddressMap } from '../components/AddressMap';
import { addressEditCopy as copy } from '../copy';
import { useAddressForm } from '../hooks/useAddressForm';
import type { AddressDraft, AddressLabel, PinnedPlace } from '../types';

const LABELS: readonly AddressLabel[] = ['home', 'office', 'other'];

export type AddressEditScreenProps = {
  /** The street and area under the pin. */
  place: PinnedPlace;
  /** A saved address being edited. Omit to add a new one. */
  initial?: Partial<AddressDraft>;
  onBack: () => void;
  onSave: (draft: AddressDraft) => void;
  /** "Use my current location". Needs expo-location, which is not installed yet. */
  onUseMyLocation?: () => void;
  /** True once the pin is on the phone's location; changes the button's text. */
  usingCurrentLocation?: boolean;
};

/** Customer · Add or edit address (design/source/AddressEdit.dc.html). */
export function AddressEditScreen({
  place,
  initial,
  onBack,
  onSave,
  onUseMyLocation,
  usingCurrentLocation = false,
}: AddressEditScreenProps) {
  const insets = useSafeAreaInsets();
  const { draft, missingHouse, update, toggleDefault } = useAddressForm(initial);

  return (
    <ScreenBackground>
      <StatusBar style="dark" />
      {/* Keeps the fields and the Save button above the keyboard. */}
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <View style={[styles.map, { height: ADDRESS_MAP_HEIGHT + insets.top }]}>
          <AddressMap topInset={insets.top} />
          {/* The pin is centred on the design's 250pt map, 46 x 46 above the centre. */}
          <View
            style={[styles.pin, { top: insets.top + ADDRESS_MAP_HEIGHT / 2 - 46 }]}
            pointerEvents="none"
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          >
            <Icon name="mapPin" size={36} color={color.purple} strokeWidth={2.4} />
          </View>
          <Tappable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={copy.back}
            style={[styles.back, { top: 22 + insets.top }]}
            testID="address-edit-back"
          >
            <Icon name="chevronLeft" size={20} color={color.ink} />
          </Tappable>
          <View style={[styles.hint, { top: 28 + insets.top }]}>
            <AppText size={12} weight={700} color={color.white} numberOfLines={1}>
              {copy.mapHint}
            </AppText>
          </View>
          {/* A full-width row centres the button, like the design's translateX(-50%).
              "box-none" lets touches on the empty sides reach the map below. */}
          <View style={styles.locateRow} pointerEvents="box-none">
            <Tappable
              onPress={onUseMyLocation}
              accessibilityRole="button"
              style={styles.locate}
              testID="address-edit-locate"
            >
              <Icon name="locate" size={16} color={color.purple} />
              <AppText size={13} weight={700} color={color.purple} numberOfLines={1}>
                {usingCurrentLocation ? copy.usingLocation : copy.useLocation}
              </AppText>
            </Tappable>
          </View>
        </View>

        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={styles.sheetContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heading}>
              <AppText size={20} weight={800} accessibilityRole="header">
                {copy.title}
              </AppText>
              <AppText size={12} color={color.muted}>
                {copy.titleTamil}
              </AppText>
            </View>

            <View style={styles.place}>
              <Icon name="mapPin" size={18} color={color.purple} />
              <View style={styles.placeText}>
                <AppText size={14} weight={700}>
                  {place.street}
                </AppText>
                <AppText size={12} color={color.muted}>
                  {place.area}
                </AppText>
              </View>
            </View>

            <Field
              label={copy.house}
              value={draft.house}
              onChangeText={(house) => update('house', house)}
              placeholder={copy.housePlaceholder}
              testID="address-edit-house"
            />
            <Field
              label={copy.landmark}
              value={draft.landmark}
              onChangeText={(landmark) => update('landmark', landmark)}
              placeholder={copy.landmarkPlaceholder}
              testID="address-edit-landmark"
            />

            <View style={styles.field}>
              <AppText size={13} weight={700} color={color.muted}>
                {copy.saveAs}
              </AppText>
              <View style={styles.chips}>
                {LABELS.map((label) => (
                  <Chip
                    key={label}
                    label={copy.labels[label]}
                    selected={draft.label === label}
                    onPress={() => update('label', label)}
                  />
                ))}
              </View>
            </View>

            <Tappable
              onPress={toggleDefault}
              accessibilityRole="switch"
              accessibilityState={{ checked: draft.isDefault }}
              accessibilityLabel={copy.makeDefault}
              accessibilityHint={copy.makeDefaultDetail}
              style={styles.defaultRow}
              testID="address-edit-default"
            >
              <View style={styles.defaultText}>
                <AppText size={14} weight={700}>
                  {copy.makeDefault}
                </AppText>
                <AppText size={12} color={color.muted}>
                  {copy.makeDefaultDetail}
                </AppText>
              </View>
              <Toggle on={draft.isDefault} />
            </Tappable>
          </ScrollView>
        </View>

        <View style={[styles.footer, { paddingBottom: 26 + insets.bottom }]}>
          <PrimaryButton
            label={copy.save}
            onPress={() => onSave(draft)}
            disabled={missingHouse}
            accessibilityHint={missingHouse ? copy.missingHouse : undefined}
            testID="address-edit-save"
          />
          {missingHouse ? (
            <AppText size={12} color={color.muted} align="center">
              {copy.missingHouse}
            </AppText>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

type FieldProps = Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'testID'> & {
  label: string;
};

/** A labelled 48pt text field. */
function Field({ label, ...input }: FieldProps) {
  return (
    <View style={styles.field}>
      <AppText size={13} weight={700} color={color.muted}>
        {label}
      </AppText>
      <TextInput
        {...input}
        placeholderTextColor={color.placeholder}
        accessibilityLabel={label}
        maxFontSizeMultiplier={1.3}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  map: { overflow: 'hidden', flexShrink: 0 },
  pin: {
    position: 'absolute',
    left: '50%',
    marginLeft: -18,
    width: 36,
    height: 46,
  },
  back: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadow.mapButton,
  },
  hint: {
    position: 'absolute',
    left: 76,
    right: 20,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: color.overlayInk,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locateRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 36,
    alignItems: 'center',
  },
  locate: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: color.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    boxShadow: shadow.mapChip,
  },
  // The sheet overlaps the map by 24 so its rounded top sits on the drawing.
  sheet: {
    flex: 1,
    marginTop: -24,
    backgroundColor: color.pageBackground,
    borderTopLeftRadius: radius.sheetTop,
    borderTopRightRadius: radius.sheetTop,
    overflow: 'hidden',
  },
  sheetContent: {
    paddingTop: 18,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 16,
    gap: 12,
  },
  heading: { gap: 2 },
  place: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.note,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  placeText: { flex: 1, gap: 1 },
  field: { gap: 6 },
  input: {
    height: 48,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    paddingHorizontal: 14,
    fontFamily: fontFamily.body,
    fontSize: 15,
    color: color.ink,
    includeFontPadding: false,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  defaultRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.note,
  },
  defaultText: { flex: 1 },
  footer: {
    paddingTop: 14,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.border,
    gap: 10,
  },
});
