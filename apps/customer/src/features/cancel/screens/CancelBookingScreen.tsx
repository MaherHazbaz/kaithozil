import {
  AppText,
  Avatar,
  Card,
  DangerButton,
  Icon,
  Tappable,
  color,
  fontFamily,
  radius,
} from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { missingStep } from '../cancelForm';
import { ReasonList } from '../components/ReasonList';
import { cancelCopy as copy, type CancelReason } from '../copy';

export type CancelBookingJob = {
  /** e.g. "Fan repair". */
  service: string;
  worker: { name: string; firstName: string; initials: string };
  /** e.g. "On the way · arrives in about 9 min". */
  status: string;
};

export type CancelBookingScreenProps = {
  job: CancelBookingJob;
  onBack: () => void;
  /** "Change the time instead?": opens Schedule. */
  onReschedule?: () => void;
  /** "Keep my booking": back to Tracking. */
  onKeep: () => void;
  /**
   * Cancels the booking on the server. Resolves when it is cancelled; rejects
   * to stay on this screen so the customer can try again.
   */
  onConfirm: (input: { reason: CancelReason; note: string | null }) => Promise<void>;
  /** After a successful cancel (the design goes to Bookings). */
  onCancelled: () => void;
};

/** Customer · Cancel booking (design/source/CancelBooking.dc.html). */
export function CancelBookingScreen({
  job,
  onBack,
  onReschedule,
  onKeep,
  onConfirm,
  onCancelled,
}: CancelBookingScreenProps) {
  const [reason, setReason] = useState<CancelReason | null>(null);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const missing = missingStep(reason, note);

  const confirm = async () => {
    if (reason === null || missing !== null) return;
    setSending(true);
    try {
      await onConfirm({ reason, note: reason === 'other' ? note.trim() : null });
      onCancelled();
    } catch {
      // Stays here so the customer can try again.
    } finally {
      setSending(false);
    }
  };

  return (
    <PageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      onBack={onBack}
      footer={
        <>
          <DangerButton
            label={copy.confirm}
            disabled={missing !== null || sending}
            accessibilityHint={missing ?? undefined}
            onPress={confirm}
            testID="cancel-confirm"
          />
          {missing ? (
            <AppText size={12} color={color.muted} align="center">
              {missing}
            </AppText>
          ) : null}
          <Tappable
            onPress={onKeep}
            accessibilityRole="button"
            style={styles.keep}
            testID="cancel-keep"
          >
            <AppText size={14} weight={700} color={color.purple}>
              {copy.keep}
            </AppText>
          </Tappable>
        </>
      }
    >
      <Card style={styles.jobCard}>
        <Avatar initials={job.worker.initials} size={44} />
        <View style={styles.jobText}>
          <AppText size={15} weight={800}>
            {copy.jobTitle(job.service, job.worker.name)}
          </AppText>
          <AppText size={12} color={color.muted}>
            {job.status}
          </AppText>
        </View>
      </Card>

      <View style={styles.warning}>
        <Icon name="alertCircle" size={18} color={color.mangoText} />
        <AppText size={13} lineHeight={13 * 1.45} color={color.mangoText} style={styles.flex}>
          {copy.onTheWay(job.worker.firstName)}
        </AppText>
      </View>

      <Tappable
        onPress={onReschedule}
        accessibilityRole="link"
        style={styles.reschedule}
        testID="cancel-reschedule"
      >
        <Icon name="calendar" size={20} color={color.purple} />
        <View style={styles.flex}>
          <AppText size={14} weight={800}>
            {copy.reschedule}
          </AppText>
          <AppText size={12} color={color.muted}>
            {copy.rescheduleDetail}
          </AppText>
        </View>
        <Icon name="chevronRight" size={18} color={color.purple} />
      </Tappable>

      <AppText size={14} weight={800} accessibilityRole="header">
        {copy.reasonHeading}
        <AppText weight={500} color={color.muted}>
          {copy.reasonHeadingTamil}
        </AppText>
      </AppText>

      <ReasonList selected={reason} onSelect={setReason} />

      {reason === 'other' ? (
        <View style={styles.field}>
          <AppText size={13} weight={700} color={color.muted}>
            {copy.noteLabel}
          </AppText>
          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            placeholder={copy.notePlaceholder}
            placeholderTextColor={color.placeholder}
            accessibilityLabel={copy.noteLabel}
            maxFontSizeMultiplier={1.3}
            style={styles.note}
            testID="cancel-note"
          />
        </View>
      ) : null}
    </PageLayout>
  );
}

// Three lines of 14pt text plus padding and border: the design's
// `<textarea rows="3">` (same as Describe the job).
const NOTE_HEIGHT = 75;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  jobCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  jobText: { flex: 1, gap: 2 },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: color.mangoTint,
    borderWidth: 1,
    borderColor: color.mangoBorder,
    borderRadius: radius.noteLarge,
  },
  reschedule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: color.lavender,
    borderRadius: radius.noteLarge,
  },
  field: { gap: 6 },
  note: {
    height: NOTE_HEIGHT,
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
  keep: { height: 44, alignItems: 'center', justifyContent: 'center' },
});
