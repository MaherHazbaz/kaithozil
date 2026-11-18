import { AppText, Avatar, Card, PrimaryButton, SecondaryButton, color } from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { DetailRow } from '@/features/quote/components/Parts';
import { useAsyncAction } from '@/features/quote/hooks/useAsyncAction';

import { ConfirmedNote, MessageCard, RowsCard, ToggleRow } from '../components/Parts';
import { leaveCopy as copy } from '../copy';
import type { Housekeeper, LeaveRequest } from '../types';

export type LeaveAnswer = 'ask' | 'approved' | 'declined';

export type LeaveApproveScreenProps = {
  housekeeper: Housekeeper;
  leave: LeaveRequest;
  /** Default "ask". Tests and the dev states can show the answers. */
  initialAnswer?: LeaveAnswer;
  onBack: () => void;
  /** Approves on the server, asking for cover when `cover` is true; rejects to stay on the question. */
  onApprove: (options: { cover: boolean }) => Promise<void>;
  onDecline: () => Promise<void>;
  onMessage?: () => void;
  /** "Back to regular help" after answering. */
  onDone?: () => void;
};

/** Customer · Approve leave (design/source/LeaveApprove.dc.html). */
export function LeaveApproveScreen({
  housekeeper,
  leave,
  initialAnswer = 'ask',
  onBack,
  onApprove,
  onDecline,
  onMessage,
  onDone,
}: LeaveApproveScreenProps) {
  const [answer, setAnswer] = useState<LeaveAnswer>(initialAnswer);
  // Off by default, as drawn: cover costs the customer money, so they opt in.
  const [cover, setCover] = useState(false);
  const { busy, run } = useAsyncAction();
  const firstName = housekeeper.firstName;

  const respond = (action: () => Promise<void>, next: LeaveAnswer) => {
    void run(async () => {
      await action();
      setAnswer(next);
    });
  };

  return (
    <PageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
    >
      <Card style={styles.person}>
        <Avatar initials={housekeeper.initials} size={48} fontSize={15} />
        <View
          style={styles.personText}
          accessible
          accessibilityLabel={`${copy.askedForLeave(firstName)}. ${copy.when(leave.dates, leave.reason)}`}
        >
          <AppText size={16} weight={800}>
            {copy.askedForLeave(firstName)}
          </AppText>
          <AppText size={12} color={color.muted}>
            {copy.when(leave.dates, leave.reason)}
          </AppText>
        </View>
      </Card>

      <RowsCard>
        {leave.rows.map((row) => (
          <DetailRow
            key={row.label}
            variant="summary"
            label={row.label}
            labelDetail={row.labelDetail}
            value={row.value}
          />
        ))}
      </RowsCard>

      {answer === 'ask' ? (
        <>
          <ToggleRow
            title={copy.coverTitle}
            detail={copy.coverTitleTamil}
            on={cover}
            onPress={() => setCover((on) => !on)}
            testID="leave-cover"
          />
          <AppText
            size={12}
            color={color.muted}
            lineHeight={12 * 1.4}
            accessibilityLiveRegion="polite"
            testID="leave-cover-text"
          >
            {cover ? copy.coverOn(leave.shortDays) : copy.coverOff(leave.shortDays)}
          </AppText>
          <PrimaryButton
            label={copy.approve}
            disabled={busy}
            onPress={() => respond(() => onApprove({ cover }), 'approved')}
            testID="leave-approve"
          />
          <View style={styles.pair}>
            <View style={styles.flex}>
              <SecondaryButton
                label={copy.message(firstName)}
                icon="messageSquare"
                onPress={onMessage}
                testID="leave-message"
              />
            </View>
            <View style={styles.flex}>
              <SecondaryButton
                label={copy.decline}
                tone="ink"
                disabled={busy}
                onPress={() => respond(onDecline, 'declined')}
                testID="leave-decline"
              />
            </View>
          </View>
        </>
      ) : null}

      {answer === 'approved' ? (
        <>
          <ConfirmedNote
            title={copy.approvedTitle(firstName)}
            detail={copy.approvedDetail(leave.monthName)}
            testID="leave-approved"
          />
          <SecondaryButton label={copy.backToPlan} onPress={onDone} testID="leave-done" />
        </>
      ) : null}

      {answer === 'declined' ? (
        <>
          <MessageCard
            title={copy.declinedTitle}
            body={copy.declinedBody(firstName)}
            testID="leave-declined"
          />
          <SecondaryButton label={copy.backToPlan} onPress={onDone} testID="leave-done" />
        </>
      ) : null}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  person: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  personText: { flexGrow: 1, flexShrink: 1, gap: 2 },
  pair: { flexDirection: 'row', gap: 8 },
});
