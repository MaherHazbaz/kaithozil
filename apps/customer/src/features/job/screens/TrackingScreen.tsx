import {
  AppText,
  Avatar,
  Card,
  Icon,
  PrimaryButton,
  Tappable,
  color,
  radius,
  spacing,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DoneSteps, type DoneStep } from '../components/DoneSteps';
import { DoorCode } from '../components/DoorCode';
import { ROUTE_MAP_HEIGHT, RouteMap } from '../components/RouteMap';
import { trackingCopy } from '../copy';

export type TrackingScreenProps = {
  worker: {
    name: string;
    firstName: string;
    initials: string;
    /** e.g. "Verified Level 2 · ★ 4.8 · 280 jobs". */
    detail: string;
  };
  /** The heading in Tamil. It contains the worker's name, so it arrives as data. */
  titleTamil: string;
  etaMinutes: number;
  progress: TrackingProgress;
  /** Read out when the worker reaches the door (step 1). Generated on the server, never in the app. */
  arrivalCode: string;
  /** Read out when the customer is ready for work to begin (step 2). */
  workStartCode: string;
  /** e.g. "Fan not working". */
  jobSummary: string;
  /** e.g. "₹400 – 700". */
  estimateRange: string;
  onBack: () => void;
  onCancel: () => void;
  // Calling, messaging and paying are not built yet, so the route leaves them unset.
  onCall?: () => void;
  onMessage?: () => void;
  onPay?: () => void;
  onReportProblem?: () => void;
};

/**
 * Where the visit is (design v3, "two door codes"). Times are already
 * formatted for display, e.g. "4:29 PM".
 */
export type TrackingProgress =
  | { stage: 'onTheWay' }
  | { stage: 'arrived'; arrivedAt: string }
  | { stage: 'workStarted'; arrivedAt: string; startedAt: string };

function doneSteps(
  progress: Exclude<TrackingProgress, { stage: 'onTheWay' }>,
  firstName: string,
): DoneStep[] {
  const arrived = {
    title: trackingCopy.arrived(firstName, progress.arrivedAt),
    detail: trackingCopy.arrivedDetail,
  };
  if (progress.stage === 'arrived') return [arrived];
  return [
    arrived,
    { title: trackingCopy.started(progress.startedAt), detail: trackingCopy.startedDetail },
  ];
}

/** Worker on the way (design/source/Tracking.dc.html). */
export function TrackingScreen({
  worker,
  titleTamil,
  etaMinutes,
  progress,
  arrivalCode,
  workStartCode,
  jobSummary,
  estimateRange,
  onBack,
  onCancel,
  onCall,
  onMessage,
  onPay,
  onReportProblem,
}: TrackingScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <View style={{ height: ROUTE_MAP_HEIGHT + insets.top }}>
        <RouteMap topInset={insets.top} />
        <Tappable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={trackingCopy.back}
          style={[styles.back, { top: 22 + insets.top }]}
          testID="tracking-back"
        >
          <Icon name="chevronLeft" size={20} color={color.ink} />
        </Tappable>
        <View style={[styles.eta, { top: 26 + insets.top }]}>
          <AppText size={13} weight={800} color={color.white}>
            {trackingCopy.arrivesIn(etaMinutes)}
          </AppText>
        </View>
      </View>

      {/* The sheet overlaps the bottom 24pt of the map, showing its rounded corners. */}
      <View style={styles.sheet}>
        <ScrollView
          contentContainerStyle={[styles.body, { paddingBottom: 26 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heading}>
            <AppText size={20} weight={800} accessibilityRole="header">
              {trackingCopy.onTheWay(worker.firstName)}
            </AppText>
            <AppText size={13} color={color.muted}>
              {titleTamil}
            </AppText>
          </View>

          <Card style={styles.workerCard}>
            <Avatar initials={worker.initials} size={48} fontSize={15} />
            <View style={styles.workerText}>
              <AppText size={16} weight={800}>
                {worker.name}
              </AppText>
              <AppText size={12} color={color.muted}>
                {worker.detail}
              </AppText>
            </View>
            <Tappable
              onPress={onCall}
              accessibilityRole="button"
              accessibilityLabel={trackingCopy.call(worker.firstName)}
              style={[styles.roundButton, styles.callButton]}
              testID="tracking-call"
            >
              <Icon name="phone" size={18} color={color.white} />
            </Tappable>
            <Tappable
              onPress={onMessage}
              accessibilityRole="button"
              accessibilityLabel={trackingCopy.message(worker.firstName)}
              style={[styles.roundButton, styles.messageButton]}
              testID="tracking-message"
            >
              <Icon name="messageSquare" size={18} color={color.purple} />
            </Tappable>
          </Card>

          <View style={styles.codes}>
            {progress.stage === 'onTheWay' ? (
              <DoorCode
                title={trackingCopy.arrivalTitle}
                titleTamil={trackingCopy.arrivalTitleTamil}
                code={arrivalCode}
                spokenLabel={trackingCopy.arrivalSpoken(arrivalCode)}
                note={trackingCopy.arrivalNote(worker.firstName)}
                testID="tracking-arrival-code"
              />
            ) : (
              <DoneSteps steps={doneSteps(progress, worker.firstName)} testID="tracking-done" />
            )}
            {progress.stage === 'arrived' ? (
              <DoorCode
                title={trackingCopy.workStartTitle}
                titleTamil={trackingCopy.workStartTitleTamil}
                code={workStartCode}
                spokenLabel={trackingCopy.workStartSpoken(workStartCode)}
                note={trackingCopy.workStartNote}
                testID="tracking-work-start-code"
              />
            ) : null}
          </View>

          <View style={styles.summary}>
            <AppText size={13} color={color.muted}>
              {jobSummary}
            </AppText>
            <AppText size={13} weight={700}>
              {trackingCopy.estimate(estimateRange)}
            </AppText>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              label={trackingCopy.payNow}
              height={52}
              onPress={onPay}
              testID="tracking-pay"
            />
            <Tappable
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel={trackingCopy.cancel}
              style={styles.cancel}
              testID="tracking-cancel"
            >
              <AppText size={14} weight={700} color={color.muted}>
                {trackingCopy.cancel}
              </AppText>
            </Tappable>
            <Tappable
              onPress={onReportProblem}
              accessibilityRole="button"
              style={styles.report}
              // The design draws this link 40pt tall; hitSlop makes the touch
              // area 44pt without moving anything.
              hitSlop={{ top: 2, bottom: 2 }}
              testID="tracking-report"
            >
              <AppText size={14} weight={700} color={color.muted}>
                {trackingCopy.reportProblem}
              </AppText>
            </Tappable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const ROUND_BUTTON = 44;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.pageBackground,
  },
  back: {
    position: 'absolute',
    left: spacing.screenPadding,
    width: ROUND_BUTTON,
    height: ROUND_BUTTON,
    borderRadius: ROUND_BUTTON / 2,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eta: {
    position: 'absolute',
    right: spacing.screenPadding,
    backgroundColor: color.purple,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  sheet: {
    flex: 1,
    marginTop: -radius.sheetTop,
    backgroundColor: color.pageBackground,
    borderTopLeftRadius: radius.sheetTop,
    borderTopRightRadius: radius.sheetTop,
    // Clips the scrolling content to the rounded corners.
    overflow: 'hidden',
  },
  body: {
    // Lets the actions sit at the bottom when the content is shorter than the sheet.
    flexGrow: 1,
    paddingTop: 18,
    paddingHorizontal: spacing.screenPadding,
    gap: 12,
  },
  heading: { gap: 2 },
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  workerText: {
    flexGrow: 1,
    flexShrink: 1,
    gap: 2,
  },
  roundButton: {
    width: ROUND_BUTTON,
    height: ROUND_BUTTON,
    borderRadius: ROUND_BUTTON / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButton: { backgroundColor: color.purple },
  messageButton: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  codes: { gap: 10 },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actions: {
    // `margin-top: auto` in the design: pushes the actions to the bottom.
    marginTop: 'auto',
    gap: 8,
  },
  cancel: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  report: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
