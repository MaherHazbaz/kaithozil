import { AppText, PrimaryButton, SecondaryButton, Tappable, color, radius } from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';

import { BookingSummary, SummaryCard, SummaryRow } from '../components/BookingSummary';
import { OutcomeDisc, OutcomeHeading, WaitingAvatar } from '../components/OutcomeHeading';
import { ReplySteps } from '../components/ReplySteps';
import { SimilarWorkers } from '../components/SimilarWorkers';
import { requestSentCopy as copy } from '../copy';
import type { BookingOutcome, BookingRequest, SimilarWorker, SuggestedTime } from '../types';

export type RequestSentScreenProps = {
  request: BookingRequest;
  /** The worker's answer so far. The screen follows it until the customer accepts a new time. */
  outcome: BookingOutcome;
  /** Required by the "newTime" outcome. */
  suggestion?: SuggestedTime;
  /** Offered by the "declined" outcome. */
  similarWorkers?: readonly SimilarWorker[];
  onBack: () => void;
  onCancelRequest?: () => void;
  onMessage?: () => void;
  onGoToBookings?: () => void;
  /** Called after the customer accepts the suggested time; the screen then shows "accepted". */
  onAcceptNewTime?: () => void;
  onPickAnotherTime?: () => void;
  onChooseAnotherWorker?: () => void;
  onFindWorker?: () => void;
  onOpenWorker?: (id: string) => void;
  onSeeAll?: () => void;
};

/** Customer · Booking request sent (design/source/RequestSent.dc.html), all four outcomes. */
export function RequestSentScreen(props: RequestSentScreenProps) {
  const { request, outcome, suggestion, onBack } = props;
  // Accepting the suggested time moves the booking to it and shows "accepted",
  // as the design's script does.
  const [acceptedSuggestion, setAcceptedSuggestion] = useState(false);
  const shown: BookingOutcome = acceptedSuggestion ? 'accepted' : outcome;
  const slot = acceptedSuggestion && suggestion ? suggestion.slot : request.slot;

  const acceptNewTime = () => {
    setAcceptedSuggestion(true);
    props.onAcceptNewTime?.();
  };

  return (
    <PageLayout title={copy.title} titleTamil={copy.titleTamil} onBack={onBack}>
      {shown === 'waiting' ? <Waiting {...props} /> : null}
      {shown === 'accepted' ? <Accepted {...props} slot={slot} /> : null}
      {shown === 'newTime' && suggestion ? (
        <NewTime {...props} suggestion={suggestion} onAccept={acceptNewTime} />
      ) : null}
      {shown === 'declined' ? <Declined {...props} /> : null}
    </PageLayout>
  );
}

function Waiting({ request, onCancelRequest }: RequestSentScreenProps) {
  const { firstName } = request.worker;
  return (
    <>
      <WaitingAvatar initials={request.worker.initials} />
      <OutcomeHeading
        title={copy.waiting.title(firstName)}
        titleTamil={copy.waiting.titleTamil}
        body={
          <>
            {copy.waiting.bodyBefore}
            <AppText weight={700}>{request.replyBy}</AppText>
            {copy.waiting.bodyAfter}
          </>
        }
      />
      <BookingSummary request={request} slot={request.slot} />
      <ReplySteps firstName={firstName} />
      <AppText size={12} color={color.muted} align="center" lineHeight={12 * 1.4}>
        {copy.waiting.note}
      </AppText>
      <SecondaryButton
        label={copy.waiting.cancel}
        tone="ink"
        onPress={onCancelRequest}
        testID="request-cancel"
      />
    </>
  );
}

function Accepted({
  request,
  slot,
  onMessage,
  onGoToBookings,
}: RequestSentScreenProps & { slot: BookingRequest['slot'] }) {
  const { firstName } = request.worker;
  return (
    <>
      <OutcomeHeading
        disc={<OutcomeDisc icon="check" tone="brand" />}
        title={copy.accepted.title(firstName)}
        titleTamil={copy.accepted.titleTamil}
        body={copy.accepted.body}
      />
      <BookingSummary request={request} slot={slot} />
      <PrimaryButton
        label={copy.accepted.message(firstName)}
        icon="messageSquare"
        iconSize={18}
        onPress={onMessage}
        testID="request-message"
      />
      <SecondaryButton
        label={copy.accepted.bookings}
        onPress={onGoToBookings}
        testID="request-bookings"
      />
    </>
  );
}

function NewTime({
  request,
  suggestion,
  onAccept,
  onPickAnotherTime,
  onChooseAnotherWorker,
}: RequestSentScreenProps & { suggestion: SuggestedTime; onAccept: () => void }) {
  const { firstName } = request.worker;
  return (
    <>
      <OutcomeHeading
        disc={<OutcomeDisc icon="calendar" tone="mango" />}
        title={copy.newTime.title(firstName)}
        titleTamil={copy.newTime.titleTamil}
        body={copy.newTime.body}
      />
      <SummaryCard>
        <SummaryRow
          label={copy.newTime.askedFor}
          value={copy.slot(request.slot.day, request.slot.time)}
          struck
        />
        <View style={styles.newTimeRow}>
          <AppText size={13} color={color.muted}>
            {copy.newTime.newTime}
          </AppText>
          <View style={styles.newTimePill}>
            <AppText size={13} weight={800} color={color.purple}>
              {copy.slot(suggestion.slot.day, suggestion.slot.time)}
            </AppText>
          </View>
        </View>
      </SummaryCard>
      <View style={styles.bubble}>
        <AppText size={11} weight={700} color={color.muted}>
          {firstName}
        </AppText>
        <AppText size={14} lineHeight={14 * 1.4}>
          {suggestion.message}
        </AppText>
      </View>
      <PrimaryButton
        label={copy.newTime.accept(suggestion.slot.time)}
        onPress={onAccept}
        testID="request-accept-new"
      />
      <View style={styles.pair}>
        <View style={styles.half}>
          <SecondaryButton label={copy.newTime.pickAnother} onPress={onPickAnotherTime} />
        </View>
        <View style={styles.half}>
          <SecondaryButton
            label={copy.newTime.chooseAnother}
            tone="ink"
            onPress={onChooseAnotherWorker}
          />
        </View>
      </View>
    </>
  );
}

function Declined({
  request,
  similarWorkers = [],
  onFindWorker,
  onOpenWorker,
  onSeeAll,
}: RequestSentScreenProps) {
  return (
    <>
      <OutcomeHeading
        disc={<OutcomeDisc icon="calendar" tone="neutral" />}
        title={copy.declined.title(request.worker.firstName)}
        titleTamil={copy.declined.titleTamil}
        body={copy.declined.body}
      />
      <PrimaryButton
        label={copy.declined.findWorker}
        icon="search"
        iconSize={18}
        onPress={onFindWorker}
        testID="request-find-worker"
      />
      {/* With no one else nearby there is nothing to list, so the card is left out. */}
      {similarWorkers.length > 0 ? (
        <SimilarWorkers
          tradePlural={request.tradePlural}
          workers={similarWorkers}
          onOpenWorker={onOpenWorker}
        />
      ) : null}
      <Tappable
        onPress={onSeeAll}
        accessibilityRole="link"
        style={styles.seeAll}
        testID="request-see-all"
      >
        <AppText size={14} weight={700} color={color.purple}>
          {copy.declined.seeAll(request.tradePlural)}
        </AppText>
      </Tappable>
    </>
  );
}

const styles = StyleSheet.create({
  newTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  newTimePill: {
    flexShrink: 1,
    backgroundColor: color.lavender,
    borderRadius: radius.statusPill,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  // The design's CSS for this bubble is broken (a radius list ended up inside
  // box-shadow), so browsers draw it as a plain radius-20 box without shadow.
  // That rendered result is what is built here; see the screen report.
  bubble: {
    alignSelf: 'flex-start',
    maxWidth: '90%',
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.borderSoft,
    borderRadius: radius.card,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 3,
  },
  pair: { flexDirection: 'row', gap: 8 },
  half: { flex: 1 },
  seeAll: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
