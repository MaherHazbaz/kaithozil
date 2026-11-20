import {
  AppText,
  Chip,
  Icon,
  PrimaryButton,
  ScreenBackground,
  ScreenHeader,
  SecondaryButton,
  Tappable,
  color,
  fontFamily,
  radius,
  spacing,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OptionCard, VehicleCard } from '../components/MechanicChoices';
import { mechanicCopy as copy } from '../copy';
import { useMechanicDraft, type MechanicDraftInitial } from '../hooks/useMechanicDraft';
import type { MechanicJob } from '../mechanicDraft';

export type MechanicScreenProps = {
  /**
   * Where the vehicle is: the default saved address. Empty when the customer
   * has removed them all; "Change" then leads to Saved addresses to add one.
   */
  address?: { label: string; line: string };
  /** Starting values. Empty by default; tests pass other states. */
  initialDraft?: MechanicDraftInitial;
  onBack: () => void;
  onAddPhoto?: () => void;
  onVoiceNote?: () => void;
  onChangeAddress?: () => void;
  /** "Choose a date and time", shown when Schedule is picked. */
  onChooseTime?: () => void;
  onSubmit?: (job: MechanicJob) => void;
};

/** Customer · Mechanic job (design/source/MechPost.dc.html). */
export function MechanicScreen({
  address,
  initialDraft,
  onBack,
  onAddPhoto,
  onVoiceNote,
  onChangeAddress,
  onChooseTime,
  onSubmit,
}: MechanicScreenProps) {
  const insets = useSafeAreaInsets();
  const draft = useMechanicDraft(copy.problems, initialDraft);
  const { vehicle, problem, description, location, timing, missing } = draft;
  const descriptionRequired = copy.problems.some(
    (option) => option.key === problem && 'needsDescription' in option,
  );
  const descriptionLabel = descriptionRequired
    ? copy.descriptionLabelRequired
    : copy.descriptionLabel;

  const submit = () => {
    if (vehicle === null || missing !== null) return;
    onSubmit?.({ vehicle, problem, description, location, timing });
  };

  return (
    <ScreenBackground>
      <StatusBar style="dark" />
      {/* Keeps the description box and the footer above the keyboard. */}
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScreenHeader
          title={copy.title}
          subtitle={copy.titleTamil}
          backLabel={copy.back}
          onBack={onBack}
          topInset={insets.top}
          testID="mechanic-back"
        />

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Heading text={copy.vehicleHeading} tamil={copy.vehicleHeadingTamil} />
            <View
              style={styles.grid}
              accessibilityRole="radiogroup"
              accessibilityLabel={copy.vehicleGroupLabel}
            >
              {[copy.vehicles.slice(0, 2), copy.vehicles.slice(2)].map((row, index) => (
                <View key={index} style={styles.row}>
                  {row.map((option) => (
                    <VehicleCard
                      key={option.key}
                      icon={option.icon}
                      label={option.label}
                      labelTamil={option.labelTamil}
                      selected={vehicle === option.key}
                      onPress={() => draft.setVehicle(option.key)}
                      testID={`mechanic-vehicle-${option.key}`}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Heading text={copy.problemHeading} tamil={copy.problemHeadingTamil} />
            <View style={styles.chips} accessibilityLabel={copy.problemGroupLabel}>
              {copy.problems.map((option) => (
                <Chip
                  key={option.key}
                  label={option.label}
                  selected={problem === option.key}
                  onPress={() => draft.setProblem(option.key)}
                  testID={`mechanic-problem-${option.key}`}
                />
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <AppText size={13} weight={700} color={color.muted}>
              {descriptionLabel}
            </AppText>
            <TextInput
              value={description}
              onChangeText={draft.setDescription}
              multiline
              placeholder={copy.descriptionHint}
              placeholderTextColor={color.placeholder}
              accessibilityLabel={descriptionLabel}
              maxFontSizeMultiplier={1.3}
              style={styles.description}
              testID="mechanic-description"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.flex}>
              <SecondaryButton
                label={copy.addPhoto}
                icon="camera"
                onPress={onAddPhoto}
                testID="mechanic-add-photo"
              />
            </View>
            <View style={styles.flex}>
              <SecondaryButton
                label={copy.voiceNote}
                icon="mic"
                onPress={onVoiceNote}
                testID="mechanic-voice-note"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Heading text={copy.whereHeading} tamil={copy.whereHeadingTamil} />
            <View
              style={styles.row}
              accessibilityRole="radiogroup"
              accessibilityLabel={copy.whereGroupLabel}
            >
              <OptionCard
                icon="home"
                title={copy.atHome.title}
                subtitle={copy.atHome.subtitle}
                selected={location === 'home'}
                onPress={() => draft.setLocation('home')}
                testID="mechanic-where-home"
              />
              <OptionCard
                icon="road"
                title={copy.roadside.title}
                subtitle={copy.roadside.subtitle}
                selected={location === 'roadside'}
                onPress={() => draft.setLocation('roadside')}
                testID="mechanic-where-roadside"
              />
            </View>
            {location === 'roadside' ? (
              <View style={styles.roadsideNote}>
                <Icon name="alertCircle" size={16} color={color.mangoText} />
                <AppText
                  size={12}
                  color={color.mangoText}
                  lineHeight={12 * 1.4}
                  style={styles.flex}
                >
                  {copy.roadsideNote}
                </AppText>
              </View>
            ) : null}
          </View>

          <View style={styles.section}>
            <AppText size={14} weight={800} accessibilityRole="header">
              {copy.whenHeading}
            </AppText>
            <View
              style={styles.row}
              accessibilityRole="radiogroup"
              accessibilityLabel={copy.whenGroupLabel}
            >
              <OptionCard
                icon="bell"
                title={copy.now.title}
                subtitle={copy.now.subtitle}
                selected={timing === 'now'}
                onPress={() => draft.setTiming('now')}
                testID="mechanic-timing-now"
              />
              <OptionCard
                icon="calendar"
                title={copy.schedule.title}
                subtitle={copy.schedule.subtitle}
                selected={timing === 'schedule'}
                onPress={() => draft.setTiming('schedule')}
                testID="mechanic-timing-schedule"
              />
            </View>
            {timing === 'schedule' ? (
              <Tappable
                onPress={onChooseTime}
                accessibilityRole="link"
                style={styles.timeLink}
                testID="mechanic-choose-time"
              >
                <AppText size={14} weight={700} color={color.purple}>
                  {copy.chooseTime}
                </AppText>
                <Icon name="chevronRight" size={16} color={color.purple} />
              </Tappable>
            ) : null}
          </View>

          <View style={styles.address}>
            <Icon name="mapPin" size={20} color={color.purple} />
            <View style={styles.addressText}>
              <AppText size={14} weight={700}>
                {address?.label}
              </AppText>
              <AppText size={12} color={color.muted}>
                {address?.line}
              </AppText>
            </View>
            <Tappable
              onPress={onChangeAddress}
              accessibilityRole="link"
              accessibilityLabel={copy.changeAddress}
              // A short word: hitSlop makes the touch area 44pt without changing the look.
              hitSlop={{ top: 14, bottom: 14, left: 10, right: 10 }}
              testID="mechanic-change-address"
            >
              <AppText size={13} weight={700} color={color.purple} underline>
                {copy.changeAddress}
              </AppText>
            </Tappable>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: 26 + insets.bottom }]}>
          <AppText size={12} color={color.muted} align="center">
            {copy.priceNote}
          </AppText>
          <PrimaryButton
            label={timing === 'now' ? copy.findCta : copy.scheduleCta}
            disabled={missing !== null}
            // Read after the button's name, so screen-reader users hear why it is disabled.
            accessibilityHint={missing ? copy.missing[missing] : undefined}
            onPress={submit}
            testID="mechanic-submit"
          />
          {/* A disabled button with no reason looks broken: say what is missing. */}
          {missing ? (
            <AppText size={12} color={color.muted} align="center" testID="mechanic-missing">
              {copy.missing[missing]}
            </AppText>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

function Heading({ text, tamil }: { text: string; tamil: string }) {
  return (
    <AppText size={14} weight={800} accessibilityRole="header">
      {text}
      <AppText weight={500} color={color.muted}>
        {tamil}
      </AppText>
    </AppText>
  );
}

// Three lines of 14pt text plus padding and border: the design's
// `<textarea rows="3">` (same as Describe the job).
const DESCRIPTION_HEIGHT = 75;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: {
    paddingTop: 16,
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.gapL,
  },
  section: { gap: 8 },
  grid: { gap: 8 },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  field: { gap: spacing.gapS },
  description: {
    height: DESCRIPTION_HEIGHT,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fontFamily.body,
    fontSize: 14,
    color: color.ink,
    // Android centres multiline text vertically and pads it unless told not to.
    textAlignVertical: 'top',
    includeFontPadding: false,
  },
  roadsideNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: color.mangoTint,
    borderRadius: radius.input,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  timeLink: {
    alignSelf: 'flex-start',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  address: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: radius.chipSquare,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addressText: {
    flexGrow: 1,
    flexShrink: 1,
  },
  footer: {
    paddingTop: 14,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.border,
    gap: spacing.gapM,
  },
});
