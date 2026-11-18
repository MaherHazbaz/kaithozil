import {
  AppText,
  Card,
  Icon,
  InfoNote,
  PrimaryButton,
  Tappable,
  color,
  radius,
} from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { useAsyncAction } from '@/features/quote/hooks/useAsyncAction';
import { JobLine } from '../components/Parts';
import { MARKS, markWords, workCopy as copy } from '../copy';
import { useWorkRecord } from '../hooks/useWorkRecord';
import type { DisputeJob, Mark, Milestone } from '../types';

export type WorkRecordScreenProps = {
  job: DisputeJob;
  /** The agreed plan's parts, with the worker's marking. */
  milestones: readonly Milestone[];
  /** Marks to open with, in the plan's order (a saved draft). Missing ones start as "Not done". */
  initialMarks?: readonly Mark[];
  onBack: () => void;
  /**
   * Saves the customer's marks on the server, one per milestone in the plan's
   * order. Resolves once recorded; rejects to stay here and try again.
   */
  onSave: (marks: readonly Mark[]) => Promise<void>;
  /** After saving: Settle the payment. */
  onSaved: () => void;
};

/** Shared · Record the work done, customer side (design/source/WorkRecord.dc.html). */
export function WorkRecordScreen({
  job,
  milestones,
  initialMarks = [],
  onBack,
  onSave,
  onSaved,
}: WorkRecordScreenProps) {
  const record = useWorkRecord(milestones, initialMarks);
  const { busy, run } = useAsyncAction();
  const other = job.workerFirstName;

  const next = () => {
    void run(async () => {
      await onSave(record.marks);
      onSaved();
    });
  };

  return (
    <PageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      onBack={onBack}
      footer={
        <>
          <View style={styles.summary}>
            <View style={styles.summaryTop} accessible>
              <AppText size={13} color={color.muted} style={styles.shrink}>
                {copy.doneByYou}
                <AppText weight={700} color={color.ink}>
                  {copy.agreedOf(record.agreed, milestones.length)}
                </AppText>
              </AppText>
              <AppText size={20} weight={800} color={color.purple} testID="work-my-percent">
                {copy.percent(record.myPercent)}
              </AppText>
            </View>
            {/* Decorative: the percent above says the same in words. */}
            <View
              style={styles.track}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <View style={[styles.fill, { width: `${record.myPercent}%` }]} />
            </View>
            <AppText size={11} color={color.muted}>
              {copy.otherMarking(other, record.otherPercent)}
            </AppText>
          </View>
          {/* No plan, nothing to record: the server has not sent the milestones. */}
          <PrimaryButton
            label={copy.next}
            disabled={busy || milestones.length === 0}
            onPress={next}
            testID="work-next"
          />
        </>
      }
    >
      <JobLine job={job} />

      <InfoNote tone="info" icon="check" iconStrokeWidth={2.5}>
        {copy.intro(other)}
      </InfoNote>

      {milestones.map((milestone, index) => {
        const mine = record.marks[index] ?? 'notDone';
        const agreed = mine === milestone.otherMark;
        return (
          <Card key={milestone.id} style={styles.milestone} testID={`work-${milestone.id}`}>
            <View style={styles.milestoneTop}>
              <View style={styles.milestoneName}>
                <AppText size={14} weight={800}>
                  {milestone.name}
                </AppText>
                <AppText size={11} color={color.muted}>
                  {copy.weight(milestone.weightPercent)}
                </AppText>
              </View>
              {agreed ? (
                <View style={[styles.pill, styles.agreed]}>
                  <Icon name="check" size={12} color={color.purple} strokeWidth={3} />
                  <AppText size={11} weight={800} color={color.purple} numberOfLines={1}>
                    {copy.agreed}
                  </AppText>
                </View>
              ) : (
                <View style={[styles.pill, styles.different]}>
                  <AppText size={11} weight={800} color={color.mangoText} numberOfLines={1}>
                    {copy.different}
                  </AppText>
                </View>
              )}
            </View>
            <View style={styles.marks} accessibilityLabel={milestone.name}>
              {MARKS.map((mark) => {
                const selected = mine === mark;
                return (
                  <Tappable
                    key={mark}
                    onPress={() => record.setMark(index, mark)}
                    accessibilityRole="button"
                    accessibilityLabel={copy.markLabel(markWords[mark], milestone.name)}
                    accessibilityState={{ selected }}
                    style={[styles.mark, selected ? styles.markOn : styles.markOff]}
                    testID={`work-${milestone.id}-${mark}`}
                  >
                    <AppText
                      size={13}
                      weight={selected ? 700 : 600}
                      color={selected ? color.purple : color.ink}
                      numberOfLines={1}
                    >
                      {markWords[mark]}
                    </AppText>
                  </Tappable>
                );
              })}
            </View>
            <AppText size={12} color={color.muted}>
              {copy.otherSays(other, markWords[milestone.otherMark], milestone.photoCount)}
            </AppText>
          </Card>
        );
      })}

      <AppText size={12} color={color.muted} align="center">
        {copy.photosNote}
      </AppText>
    </PageLayout>
  );
}

const BAR = 10;
const MARK_HEIGHT = 44;

const styles = StyleSheet.create({
  shrink: { flexShrink: 1 },
  milestone: { padding: 14, gap: 8 },
  milestoneTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  milestoneName: { flexShrink: 1, gap: 1 },
  pill: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  agreed: { backgroundColor: color.lavender },
  different: { backgroundColor: color.mangoTint },
  marks: { flexDirection: 'row', gap: 6 },
  mark: {
    flex: 1,
    height: MARK_HEIGHT,
    borderRadius: radius.segment,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markOn: { borderWidth: 2, borderColor: color.purple, backgroundColor: color.lavender },
  markOff: { borderWidth: 1, borderColor: color.borderStrong, backgroundColor: color.white },
  summary: { gap: 6 },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 8,
  },
  track: {
    height: BAR,
    borderRadius: BAR / 2,
    backgroundColor: color.border,
    overflow: 'hidden',
  },
  fill: {
    height: BAR,
    borderRadius: BAR / 2,
    backgroundColor: color.purple,
  },
});
