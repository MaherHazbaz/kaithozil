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
  type as typeStyle,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TimingCard } from '../components/TimingCard';
import { describeJobCopy, jobServices, type JobService, type JobServiceKey } from '../copy';
import { useJobDraft, type JobDraftInitial } from '../hooks/useJobDraft';
import type { JobDraft } from '../jobDraft';

export type DescribeJobScreenProps = {
  service: JobServiceKey;
  /** Where the job is. The route passes the design's sample until addresses exist (Sprint 2). */
  address: { label: string; line: string };
  /** e.g. "₹400 – 700". Sample value until real estimates exist (Sprint 2). */
  estimateRange: string;
  /** Starting values. Empty by default; tests pass the design's sample state. */
  initialDraft?: JobDraftInitial;
  onBack: () => void;
  // The screens these lead to are not built yet, so the route leaves them unset.
  onAddPhoto?: () => void;
  onVoiceNote?: () => void;
  onChangeAddress?: () => void;
  onSubmit?: (draft: JobDraft) => void;
};

/** Describe the job (design/source/Post.dc.html). */
export function DescribeJobScreen({
  service,
  address,
  estimateRange,
  initialDraft,
  onBack,
  onAddPhoto,
  onVoiceNote,
  onChangeAddress,
  onSubmit,
}: DescribeJobScreenProps) {
  const insets = useSafeAreaInsets();
  const copy: JobService = jobServices[service];
  const draft = useJobDraft(copy.problems, initialDraft);
  const { problem, description, timing, missing } = draft;
  // "Other" says nothing by itself, so the description stops being optional.
  const descriptionRequired = copy.problems.some(
    (option) => option.key === problem && option.needsDescription,
  );
  const descriptionLabel = descriptionRequired
    ? describeJobCopy.descriptionLabelRequired
    : describeJobCopy.descriptionLabel;

  return (
    <ScreenBackground>
      {/* Dark status bar icons over the light page. */}
      <StatusBar style="dark" />
      {/*
        On the web the browser scrolls a focused field into view above the
        keyboard. React Native does not: this view shrinks by the keyboard's
        height instead, so the description box and the footer stay visible.
      */}
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScreenHeader
          title={copy.title}
          subtitle={copy.titleTamil}
          backLabel={describeJobCopy.back}
          onBack={onBack}
          topInset={insets.top}
          testID="job-back"
        />

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          // Lets a tap on a chip or button work while the keyboard is open.
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <AppText
              size={typeStyle.sectionLabel.size}
              weight={typeStyle.sectionLabel.weight}
              accessibilityRole="header"
            >
              {describeJobCopy.problemHeading}
              <AppText weight={500} color={color.muted}>
                {describeJobCopy.problemHeadingTamil}
              </AppText>
            </AppText>
            <View style={styles.chips} accessibilityLabel={describeJobCopy.problemGroupLabel}>
              {copy.problems.map((option) => (
                <Chip
                  key={option.key}
                  label={option.label}
                  selected={problem === option.key}
                  onPress={() => draft.setProblem(option.key)}
                  testID={`job-problem-${option.key}`}
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
              // An example of a useful description, so the worker who accepts
              // knows what to bring.
              placeholder={copy.descriptionHint}
              placeholderTextColor={color.placeholder}
              accessibilityLabel={descriptionLabel}
              maxFontSizeMultiplier={1.3}
              style={styles.description}
              testID="job-description"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.flex}>
              <SecondaryButton
                label={describeJobCopy.addPhoto}
                icon="camera"
                onPress={onAddPhoto}
                testID="job-add-photo"
              />
            </View>
            <View style={styles.flex}>
              <SecondaryButton
                label={describeJobCopy.voiceNote}
                icon="mic"
                onPress={onVoiceNote}
                testID="job-voice-note"
              />
            </View>
          </View>

          <View style={styles.section}>
            <AppText
              size={typeStyle.sectionLabel.size}
              weight={typeStyle.sectionLabel.weight}
              accessibilityRole="header"
            >
              {describeJobCopy.whenHeading}
            </AppText>
            <View style={styles.row}>
              <TimingCard
                icon="bell"
                title={describeJobCopy.now.title}
                subtitle={describeJobCopy.now.subtitle}
                selected={timing === 'now'}
                onPress={() => draft.setTiming('now')}
                testID="job-timing-now"
              />
              <TimingCard
                icon="calendar"
                title={describeJobCopy.schedule.title}
                subtitle={describeJobCopy.schedule.subtitle}
                selected={timing === 'schedule'}
                onPress={() => draft.setTiming('schedule')}
                testID="job-timing-schedule"
              />
            </View>
          </View>

          <View style={styles.address}>
            <Icon name="mapPin" size={20} color={color.purple} />
            <View style={styles.addressText}>
              <AppText size={14} weight={700}>
                {address.label}
              </AppText>
              <AppText size={12} color={color.muted}>
                {address.line}
              </AppText>
            </View>
            <Tappable
              onPress={onChangeAddress}
              accessibilityRole="link"
              accessibilityLabel={describeJobCopy.changeAddress}
              // The link is one short word; hitSlop extends its touch area to
              // 44pt without changing how it looks.
              hitSlop={{ top: 14, bottom: 14, left: 10, right: 10 }}
              testID="job-change-address"
            >
              <AppText size={13} weight={700} color={color.purple} underline>
                {describeJobCopy.changeAddress}
              </AppText>
            </Tappable>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: 26 + insets.bottom }]}>
          <View style={styles.estimate}>
            <AppText size={13} color={color.muted}>
              {describeJobCopy.estimateLabel}
            </AppText>
            <AppText size={13} weight={800}>
              {describeJobCopy.estimate(estimateRange)}
            </AppText>
          </View>
          <PrimaryButton
            label={timing === 'now' ? copy.findCta : copy.scheduleCta}
            disabled={missing !== null}
            // Read out after the button's name, so screen-reader users also
            // hear why it is disabled.
            accessibilityHint={missing ? describeJobCopy.missing[missing] : undefined}
            onPress={() => onSubmit?.({ problem, description, timing })}
            testID="job-submit"
          />
          {/* A disabled button with no reason looks broken: say what is missing. */}
          {missing ? (
            <AppText size={12} color={color.muted} align="center" testID="job-missing">
              {describeJobCopy.missing[missing]}
            </AppText>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

// Three lines of 14pt text: Plus Jakarta Sans has a natural line height of
// 1.26 x its size (17.64pt), plus 10pt padding and a 1pt border on each side.
// This is the height of the design's `<textarea rows="3">`.
const DESCRIPTION_HEIGHT = 75;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: {
    paddingTop: 16,
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.gapL,
  },
  section: {
    gap: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  field: {
    gap: spacing.gapS,
  },
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
  row: {
    flexDirection: 'row',
    gap: 8,
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
  estimate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
