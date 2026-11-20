import {
  AppText,
  Card,
  Chip,
  Icon,
  InfoNote,
  PrimaryButton,
  SecondaryButton,
  Tappable,
  color,
  radius,
} from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { HeroDisc } from '../components/Parts';
import { visitCopy as copy } from '../copy';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { useVisitDraft, type VisitDraftInitial } from '../hooks/useVisitDraft';
import type { Address, BookedVisit, Slot } from '../types';
import type { VisitRequest } from '../visitRequest';

export type VisitRequestScreenProps = {
  /** The default saved address; empty when the customer has removed them all. */
  address?: Address;
  /** The visit time chosen on Schedule. */
  visitSlot: Slot;
  /** Starting answers. Empty by default; tests pass other states. */
  initialDraft?: VisitDraftInitial;
  onBack: () => void;
  onAddPhotos?: () => void;
  onVoiceNote?: () => void;
  onChangeTime?: () => void;
  onChangeAddress?: () => void;
  /** Books the visit. Resolves with the worker who will come; rejects to stay on the form. */
  onRequest: (request: VisitRequest) => Promise<BookedVisit>;
  onSeeQuote?: () => void;
  onBookings?: () => void;
};

/** Customer · Request a site visit (design/source/QuoteRequest.dc.html). */
export function VisitRequestScreen({
  address,
  visitSlot,
  initialDraft,
  onBack,
  onAddPhotos,
  onVoiceNote,
  onChangeTime,
  onChangeAddress,
  onRequest,
  onSeeQuote,
  onBookings,
}: VisitRequestScreenProps) {
  const defaultDuration = copy.durations[0].key;
  const draft = useVisitDraft(defaultDuration, initialDraft);
  const { busy, run } = useAsyncAction();
  const [booked, setBooked] = useState<BookedVisit | null>(null);
  const { work, size, duration, missing } = draft;

  const submit = () => {
    if (size === null || missing !== null) return;
    void run(async () => setBooked(await onRequest({ work, size, duration })));
  };

  return (
    <PageLayout title={copy.title} titleTamil={copy.titleTamil} onBack={onBack}>
      {booked ? (
        <>
          <View style={styles.booked}>
            <HeroDisc icon="calendar" />
            <AppText size={21} weight={800} align="center" accessibilityRole="header">
              {copy.bookedTitle}
            </AppText>
            <AppText size={13} color={color.muted} align="center">
              {copy.bookedTitleTamil}
            </AppText>
            <AppText size={14} lineHeight={14 * 1.5} align="center" style={styles.bookedBody}>
              {copy.bookedBefore(booked.workerName, booked.workerLevel)}
              <AppText weight={700}>{copy.bookedSlot(visitSlot.day, visitSlot.time)}</AppText>
              {copy.bookedAfter}
            </AppText>
          </View>
          <PrimaryButton
            label={copy.seeQuote}
            icon="receipt"
            iconSize={18}
            onPress={onSeeQuote}
            testID="visit-see-quote"
          />
          <SecondaryButton label={copy.goToBookings} onPress={onBookings} testID="visit-bookings" />
        </>
      ) : (
        <>
          <Card style={styles.steps}>
            {copy.steps.map((step, index) => (
              <View key={step.title} style={styles.step}>
                <View style={styles.stepNumber}>
                  <AppText size={13} weight={800} color={color.purple}>
                    {index + 1}
                  </AppText>
                </View>
                <View style={styles.stepText}>
                  <AppText size={14} weight={800}>
                    {step.title}
                  </AppText>
                  <AppText size={12} color={color.muted}>
                    {step.detail}
                  </AppText>
                </View>
              </View>
            ))}
          </Card>

          <View style={styles.section}>
            <Heading text={copy.workHeading} tamil={copy.workHeadingTamil} />
            <View style={styles.chips} accessibilityLabel={copy.workGroupLabel}>
              {copy.works.map((option) => (
                <Chip
                  key={option.key}
                  label={option.label}
                  selected={work.includes(option.key)}
                  onPress={() => draft.toggleWork(option.key)}
                  testID={`visit-work-${option.key}`}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Heading text={copy.sizeHeading} tamil={copy.sizeHeadingTamil} />
            <View style={styles.chips} accessibilityLabel={copy.sizeGroupLabel}>
              {copy.sizes.map((option) => (
                <Chip
                  key={option.key}
                  label={option.label}
                  selected={size === option.key}
                  onPress={() => draft.setSize(option.key)}
                  testID={`visit-size-${option.key}`}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            {/* This heading is drawn larger than the two above (15 / Tamil 12 600). */}
            <AppText size={15} weight={800} accessibilityRole="header">
              {copy.durationHeading}
              <AppText size={12} weight={600} color={color.muted}>
                {copy.durationHeadingTamil}
              </AppText>
            </AppText>
            <View style={styles.chips} accessibilityLabel={copy.durationGroupLabel}>
              {copy.durations.map((option) => (
                <Chip
                  key={option.key}
                  label={option.label}
                  selected={duration === option.key}
                  onPress={() => draft.setDuration(option.key)}
                  testID={`visit-duration-${option.key}`}
                />
              ))}
            </View>
            {duration === defaultDuration ? (
              <InfoNote tone="info" icon="check" iconStrokeWidth={2.5}>
                {copy.durationUnsureNote}
              </InfoNote>
            ) : null}
          </View>

          <View style={styles.row}>
            <View style={styles.flex}>
              <SecondaryButton
                label={copy.addPhotos}
                icon="camera"
                onPress={onAddPhotos}
                testID="visit-add-photos"
              />
            </View>
            <View style={styles.flex}>
              <SecondaryButton
                label={copy.voiceNote}
                icon="mic"
                onPress={onVoiceNote}
                testID="visit-voice-note"
              />
            </View>
          </View>

          {/* The whole row is the link here, unlike the address row below. */}
          <Tappable
            onPress={onChangeTime}
            accessibilityRole="link"
            accessibilityLabel={`${copy.changeVisitTimeLabel}, ${copy.visitSlot(visitSlot.day, visitSlot.time)}`}
            style={[styles.infoRow, styles.timeRow]}
            testID="visit-change-time"
          >
            <Icon name="calendar" size={20} color={color.purple} />
            <View style={styles.infoText}>
              <AppText size={14} weight={700}>
                {copy.visitTime}
              </AppText>
              <AppText size={12} color={color.muted}>
                {copy.visitSlot(visitSlot.day, visitSlot.time)}
              </AppText>
            </View>
            <AppText size={13} weight={700} color={color.purple}>
              {copy.change}
            </AppText>
          </Tappable>

          <View style={styles.infoRow}>
            <Icon name="mapPin" size={20} color={color.purple} />
            <View style={styles.infoText}>
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
              accessibilityLabel={copy.changeAddressLabel}
              style={styles.addressLink}
              testID="visit-change-address"
            >
              <AppText size={13} weight={700} color={color.purple} underline>
                {copy.change}
              </AppText>
            </Tappable>
          </View>

          <AppText size={12} color={color.muted} align="center" lineHeight={12 * 1.4}>
            {copy.feeNote}
          </AppText>

          <PrimaryButton
            label={copy.cta}
            disabled={missing !== null || busy}
            // Read after the button's name, so screen-reader users hear why it is disabled.
            accessibilityHint={missing ? copy.missing[missing] : undefined}
            onPress={submit}
            testID="visit-submit"
          />
          {/* A disabled button with no reason looks broken: the design says what is missing. */}
          {missing ? (
            <AppText size={12} color={color.muted} align="center" testID="visit-missing">
              {copy.missing[missing]}
            </AppText>
          ) : null}
        </>
      )}
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

const STEP_NUMBER = 28;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  steps: {
    padding: 14,
    gap: 10,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: STEP_NUMBER,
    height: STEP_NUMBER,
    borderRadius: STEP_NUMBER / 2,
    backgroundColor: color.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    flexShrink: 1,
    gap: 1,
  },
  section: { gap: 8 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: radius.chipSquare,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.white,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  timeRow: { gap: 12 },
  infoText: {
    flexGrow: 1,
    flexShrink: 1,
  },
  // min-height 44 in the design: the link itself is the touch target.
  addressLink: {
    minHeight: 44,
    justifyContent: 'center',
  },
  booked: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 30,
    paddingBottom: 6,
  },
  bookedBody: { maxWidth: 310 },
});
