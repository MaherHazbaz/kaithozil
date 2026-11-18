import {
  AppText,
  Chip,
  IconBox,
  PrimaryButton,
  SecondaryButton,
  Stepper,
  Tappable,
  Toggle,
  color,
  radius,
} from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { MethodCard } from '../components/MethodCard';
import { needByOptions, stitchingTypes, tailorBookCopy as copy, tailorMethods } from '../copy';
import { useTailorDraft, type TailorDraftInitial } from '../hooks/useTailorDraft';
import { MAX_PIECES, MIN_PIECES, type TailorBooking } from '../tailorDraft';

export type TailorBookScreenProps = {
  /**
   * Second line of "Use my saved measurements", e.g. "Priya · saved October".
   * Without saved measurements the row is not shown (no design for that yet).
   */
  savedMeasurements?: string;
  /** Starting values. The design's first state by default; tests pass others. */
  initialDraft?: TailorDraftInitial;
  onBack: () => void;
  /** "Add a design you like": opens Photos and voice note. */
  onAddDesign?: () => void;
  onSubmit?: (booking: TailorBooking) => void;
};

/** Customer · Tailor booking (design/source/TailorBook.dc.html). */
export function TailorBookScreen({
  savedMeasurements,
  initialDraft,
  onBack,
  onAddDesign,
  onSubmit,
}: TailorBookScreenProps) {
  const draft = useTailorDraft({
    useSavedMeasurements: savedMeasurements !== undefined,
    ...initialDraft,
  });
  const { stitching, method, pieces, needBy, useSavedMeasurements, missing, booking } = draft;
  const chosenMethod = tailorMethods.find((option) => option.key === method);

  const footer = (
    <>
      <PrimaryButton
        label={chosenMethod?.cta ?? copy.findCta}
        disabled={booking === null}
        // Read after the button's name, so screen-reader users hear why it is disabled.
        accessibilityHint={missing ? copy.missing[missing] : undefined}
        onPress={() => booking && onSubmit?.(booking)}
        testID="tailor-submit"
      />
      {/* A disabled button with no reason looks broken: say what is missing. */}
      {missing ? (
        <AppText size={12} color={color.muted} align="center" testID="tailor-missing">
          {copy.missing[missing]}
        </AppText>
      ) : null}
    </>
  );

  return (
    <PageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
      footer={footer}
    >
      <View style={styles.section}>
        <Heading text={copy.stitchingHeading} tamil={copy.stitchingHeadingTamil} />
        <View style={styles.chips} accessibilityLabel={copy.stitchingGroup}>
          {stitchingTypes.map((option) => (
            <Chip
              key={option.key}
              label={option.label}
              selected={stitching.includes(option.key)}
              onPress={() => draft.toggleStitching(option.key)}
              testID={`tailor-stitching-${option.key}`}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Heading text={copy.methodHeading} tamil={copy.methodHeadingTamil} />
        <View
          style={styles.section}
          accessibilityRole="radiogroup"
          accessibilityLabel={copy.methodGroup}
        >
          {tailorMethods.map((option) => (
            <MethodCard
              key={option.key}
              icon={option.icon}
              title={option.title}
              titleTamil={option.titleTamil}
              detail={option.detail}
              selected={method === option.key}
              onPress={() => draft.setMethod(option.key)}
              testID={`tailor-method-${option.key}`}
            />
          ))}
        </View>
      </View>

      <View style={styles.pieces}>
        <View>
          <AppText size={14} weight={700}>
            {copy.piecesTitle}
          </AppText>
          <AppText size={12} color={color.muted}>
            {copy.piecesTitleTamil}
          </AppText>
        </View>
        <Stepper
          value={pieces}
          onChange={draft.setPieces}
          min={MIN_PIECES}
          max={MAX_PIECES}
          decreaseLabel={copy.fewerPieces}
          increaseLabel={copy.morePieces}
        />
      </View>

      <View style={styles.section}>
        <Heading text={copy.needByHeading} tamil={copy.needByHeadingTamil} />
        <View style={styles.chips} accessibilityLabel={copy.needByGroup}>
          {needByOptions.map((option) => (
            <Chip
              key={option.key}
              label={option.label}
              selected={needBy === option.key}
              onPress={() => draft.setNeedBy(option.key)}
              testID={`tailor-need-by-${option.key}`}
            />
          ))}
        </View>
      </View>

      {savedMeasurements !== undefined ? (
        <Tappable
          onPress={draft.toggleSavedMeasurements}
          // "switch" makes screen readers say "on" / "off" with the title.
          accessibilityRole="switch"
          accessibilityState={{ checked: useSavedMeasurements }}
          accessibilityLabel={copy.useSaved}
          accessibilityHint={savedMeasurements}
          style={styles.saved}
          testID="tailor-saved-measurements"
        >
          <IconBox icon="ruler" tone="lavender" size={36} />
          <View style={styles.savedText}>
            <AppText size={14} weight={700}>
              {copy.useSaved}
            </AppText>
            <AppText size={12} color={color.muted}>
              {savedMeasurements}
            </AppText>
          </View>
          <Toggle on={useSavedMeasurements} />
        </Tappable>
      ) : null}

      <SecondaryButton
        label={copy.addDesign}
        icon="image"
        onPress={onAddDesign}
        testID="tailor-add-design"
      />

      <AppText size={12} color={color.muted} align="center" lineHeight={12 * 1.4}>
        {copy.photoNote}
      </AppText>
    </PageLayout>
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

const styles = StyleSheet.create({
  section: { gap: 8 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pieces: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.chipSquare,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  saved: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.chipSquare,
  },
  savedText: { flexGrow: 1, flexShrink: 1, gap: 1 },
});
