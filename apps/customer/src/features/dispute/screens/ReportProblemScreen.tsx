import {
  AppText,
  Icon,
  IconBox,
  InfoNote,
  PrimaryButton,
  SecondaryButton,
  Tappable,
  color,
  fontFamily,
  radius,
  shadow,
} from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { useAsyncAction } from '@/features/quote/hooks/useAsyncAction';
import { JobLine, Outcome } from '../components/Parts';
import { reportCopy as copy } from '../copy';
import { useProblemReport, type ProblemReport } from '../hooks/useProblemReport';
import type { DisputeJob } from '../types';

export type ReportProblemScreenProps = {
  job: DisputeJob;
  onBack: () => void;
  /** "I feel unsafe": leaves the form for the safety line. */
  onUnsafe: () => void;
  /** Opens the camera or gallery (needs expo-image-picker, not installed yet). */
  onAddPhotos?: () => void;
  /**
   * Reports the problem and pauses the job and its payments on the server.
   * Resolves once both are recorded; rejects to stay on the form.
   */
  onReport: (report: ProblemReport) => Promise<void>;
  onRecordWork: () => void;
  /** "Talk to Ravi first": the job chat. */
  onTalk: () => void;
  /** Tests can open on the "Job paused" step. */
  initiallySent?: boolean;
};

/** Shared · Report a problem, customer side (design/source/ReportProblem.dc.html). */
export function ReportProblemScreen({
  job,
  onBack,
  onUnsafe,
  onAddPhotos,
  onReport,
  onRecordWork,
  onTalk,
  initiallySent = false,
}: ReportProblemScreenProps) {
  const form = useProblemReport();
  const [sent, setSent] = useState(initiallySent);
  const { busy, run } = useAsyncAction();
  const other = job.workerFirstName;

  const send = () => {
    const report = form.report();
    if (!report) return;
    void run(async () => {
      await onReport(report);
      setSent(true);
    });
  };

  return (
    <PageLayout title={copy.title} titleTamil={copy.titleTamil} onBack={onBack}>
      <JobLine job={job} />

      {sent ? (
        <>
          <Outcome
            paddingTop={26}
            icon={
              <View style={styles.pausedDisc}>
                <Icon name="alertCircle" size={40} color={color.mangoText} />
              </View>
            }
          >
            <AppText size={20} weight={800} align="center" accessibilityRole="header">
              {copy.pausedTitle}
            </AppText>
            <AppText size={13} color={color.muted} align="center">
              {copy.pausedTitleTamil}
            </AppText>
            <AppText size={14} lineHeight={14 * 1.5} align="center" style={styles.body}>
              {copy.pausedBody(other)}
            </AppText>
          </Outcome>
          <PrimaryButton
            label={copy.recordWork}
            onPress={onRecordWork}
            testID="problem-record-work"
          />
          <SecondaryButton
            label={copy.talkFirst(other)}
            icon="messageSquare"
            onPress={onTalk}
            testID="problem-talk"
          />
        </>
      ) : (
        <>
          <Tappable
            onPress={onUnsafe}
            accessibilityRole="link"
            accessibilityLabel={`${copy.unsafeTitle}. ${copy.unsafeDetail}`}
            style={styles.unsafe}
            testID="problem-unsafe"
          >
            <IconBox icon="shield" tone="purple" size={36} />
            <View style={styles.flex}>
              <AppText size={14} weight={800} color={color.purple}>
                {copy.unsafeTitle}
              </AppText>
              <AppText size={12} color={color.muted}>
                {copy.unsafeDetail}
              </AppText>
            </View>
            <Icon name="chevronRight" size={18} color={color.purple} />
          </Tappable>

          <AppText size={15} weight={800} accessibilityRole="header">
            {copy.reasonsHeading}
            <AppText size={12} weight={600} color={color.muted}>
              {copy.reasonsHeadingTamil}
            </AppText>
          </AppText>

          {/* Shadow on the outer view; the inner one clips the rows to the corners. */}
          <View style={styles.reasonsShadow}>
            <View
              style={styles.reasons}
              accessibilityRole="radiogroup"
              accessibilityLabel={copy.reasonsLabel}
            >
              {copy.reasons.customer.map((option) => {
                const checked = form.reason === option.key;
                return (
                  <Tappable
                    key={option.key}
                    onPress={() => form.setReason(option.key)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked }}
                    style={styles.reason}
                    testID={`problem-reason-${option.key}`}
                  >
                    <View style={[styles.dot, checked ? styles.dotOn : styles.dotOff]} />
                    <AppText size={15} weight={600} style={styles.flex}>
                      {option.label}
                    </AppText>
                  </Tappable>
                );
              })}
            </View>
          </View>

          <View style={styles.field}>
            <AppText size={13} weight={700} color={color.muted}>
              {copy.detailsLabel}
            </AppText>
            <TextInput
              value={form.details}
              onChangeText={form.setDetails}
              multiline
              placeholder={copy.detailsHint}
              placeholderTextColor={color.placeholder}
              accessibilityLabel={copy.detailsLabel}
              maxFontSizeMultiplier={1.3}
              style={styles.details}
              testID="problem-details"
            />
          </View>

          <SecondaryButton
            label={copy.addPhotos}
            icon="camera"
            onPress={onAddPhotos}
            testID="problem-add-photos"
          />

          <InfoNote tone="warning" icon="alertCircle">
            <AppText weight={700}>{copy.pauseNoteBold}</AppText>
            {copy.pauseNoteRest(other)}
          </InfoNote>

          <PrimaryButton
            label={copy.send}
            disabled={form.missing !== null || busy}
            accessibilityHint={form.missing ?? undefined}
            onPress={send}
            testID="problem-send"
          />
          {form.missing ? (
            <AppText size={12} color={color.muted} align="center">
              {form.missing}
            </AppText>
          ) : null}
        </>
      )}
    </PageLayout>
  );
}

const DOT = 22;
const PAUSED_DISC = 88;
// Three lines of 14pt text plus padding and border: the design's
// `<textarea rows="3">` (same as Cancel booking).
const DETAILS_HEIGHT = 75;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  unsafe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: color.white,
    borderWidth: 2,
    borderColor: color.purple,
    borderRadius: radius.noteLarge,
  },
  reasonsShadow: { borderRadius: radius.choiceCard, boxShadow: shadow.card },
  reasons: {
    borderRadius: radius.choiceCard,
    borderWidth: 1,
    borderColor: color.borderSoft,
    backgroundColor: color.white,
    overflow: 'hidden',
  },
  reason: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: color.white,
    // Every row has the divider, the last one too, as in the design.
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  dot: {
    width: DOT,
    height: DOT,
    flexShrink: 0,
    borderRadius: DOT / 2,
    backgroundColor: color.white,
  },
  dotOn: { borderWidth: 7, borderColor: color.purple },
  dotOff: { borderWidth: 2, borderColor: color.borderStrong },
  field: { gap: 6 },
  details: {
    height: DETAILS_HEIGHT,
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
  pausedDisc: {
    width: PAUSED_DISC,
    height: PAUSED_DISC,
    borderRadius: PAUSED_DISC / 2,
    backgroundColor: color.mangoTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { maxWidth: 300 },
});
