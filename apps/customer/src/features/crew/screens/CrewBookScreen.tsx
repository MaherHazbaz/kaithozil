import {
  AppText,
  Chip,
  InfoNote,
  PrimaryButton,
  Stepper,
  Tappable,
  Toggle,
  color,
  radius,
  shadow,
} from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { useAsyncAction } from '@/features/quote/hooks/useAsyncAction';

import { CrewLayout } from '../components/CrewLayout';
import { LinkCard } from '../components/Parts';
import { crewBookCopy as copy, roleCopy } from '../copy';
import { CREW_DAYS, CREW_ROLES, WORKERS_PER_ROLE } from '../crewPlan';
import { useCrewRequest } from '../hooks/useCrewRequest';
import type { CrewRequest } from '../types';

export type CrewBookScreenProps = {
  /** Starting choices (Crew.dc.html: 2 + 3 + 2 workers for 5 days, with a mestri). */
  initialRequest: CrewRequest;
  onBack: () => void;
  /** "Prefer to choose your crew?": the list of verified mestri teams. */
  onChooseCrew?: () => void;
  /**
   * Sends the request to the server. Resolves once it is recorded; rejects to
   * stay on this screen. Nobody is charged here: crews are paid day by day,
   * from attendance, once work starts.
   */
  onFind: (request: CrewRequest) => Promise<void>;
};

/** Customer · Book construction crew (design/source/Crew.dc.html). */
export function CrewBookScreen({
  initialRequest,
  onBack,
  onChooseCrew,
  onFind,
}: CrewBookScreenProps) {
  const crew = useCrewRequest(initialRequest);
  const { request } = crew;
  const { busy, run } = useAsyncAction();

  return (
    <CrewLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
      contentPaddingTop={14}
      testID="crew-book"
      footer={
        <>
          <View style={styles.summary}>
            <AppText size={14} color={color.muted} style={styles.shrink} testID="crew-book-summary">
              {request.unsure ? copy.summaryUnsure : copy.summary(crew.total, request.days)}
            </AppText>
            <View style={styles.daysPill}>
              <AppText
                size={14}
                weight={800}
                color={color.mangoText}
                numberOfLines={1}
                testID="crew-book-worker-days"
              >
                {request.unsure ? copy.workerDaysUnsure : copy.workerDays(crew.workerDays)}
              </AppText>
            </View>
          </View>
          <PrimaryButton
            label={copy.find(crew.total)}
            disabled={busy || !crew.canFind}
            accessibilityHint={crew.canFind ? undefined : copy.noWorkersHint}
            onPress={() => void run(() => onFind(request))}
            testID="crew-book-find"
          />
        </>
      }
    >
      <View style={styles.chips} accessibilityLabel={copy.workGroupLabel}>
        {copy.works.map((work) => (
          <Chip
            key={work.key}
            label={work.label}
            selected={request.work === work.key}
            onPress={() => crew.setWork(work.key)}
            height={40}
            testID={`crew-work-${work.key}`}
          />
        ))}
      </View>

      <LinkCard
        icon="team"
        title={copy.chooseCrew}
        detail={copy.chooseCrewDetail}
        onPress={onChooseCrew}
        testID="crew-book-choose"
      />

      <Tappable
        onPress={crew.toggleUnsure}
        accessibilityRole="switch"
        accessibilityLabel={`${copy.unsure} ${copy.unsureTamil}`}
        accessibilityState={{ checked: request.unsure }}
        style={styles.unsure}
        testID="crew-book-unsure"
      >
        <View style={styles.unsureText}>
          <AppText size={14} weight={800}>
            {copy.unsure}
          </AppText>
          <AppText size={12} color={color.muted}>
            {copy.unsureTamil}
          </AppText>
        </View>
        <Toggle on={request.unsure} />
      </Tappable>
      {request.unsure ? (
        <InfoNote tone="info" icon="check" iconStrokeWidth={2.5}>
          {copy.unsureNote}
        </InfoNote>
      ) : null}

      <AppText size={15} weight={800} accessibilityRole="header">
        {copy.workersHeading}
      </AppText>

      <View style={styles.roles}>
        {CREW_ROLES.map((role) => {
          const names = roleCopy[role];
          return (
            <View key={role} style={[styles.card, styles.stepperCard]} testID={`crew-role-${role}`}>
              <View style={styles.roleText}>
                <AppText size={17} weight={700}>
                  {names.en}
                </AppText>
                <AppText size={13} weight={700} color={color.purple}>
                  {names.ta}
                </AppText>
                <AppText size={12} color={color.muted}>
                  {names.desc}
                </AppText>
              </View>
              <Stepper
                value={request.counts[role]}
                onChange={(count) => crew.setRoleCount(role, count)}
                min={WORKERS_PER_ROLE.min}
                max={WORKERS_PER_ROLE.max}
                decreaseLabel={copy.removeOne(names.en)}
                increaseLabel={copy.addOne(names.en)}
              />
            </View>
          );
        })}
      </View>

      <View style={[styles.card, styles.stepperCard]}>
        <View style={styles.roleText}>
          <AppText size={15} weight={700}>
            {copy.days}
          </AppText>
          <AppText size={12} color={color.muted}>
            {copy.daysDetail}
          </AppText>
        </View>
        <Stepper
          value={request.days}
          onChange={crew.setDays}
          min={CREW_DAYS.min}
          max={CREW_DAYS.max}
          decreaseLabel={copy.fewerDays}
          increaseLabel={copy.moreDays}
        />
      </View>

      <Tappable
        onPress={crew.toggleMestri}
        accessibilityRole="switch"
        accessibilityLabel={`${copy.mestri}, ${copy.mestriDetail}`}
        accessibilityState={{ checked: request.withMestri }}
        style={[styles.card, styles.mestri]}
        testID="crew-book-mestri"
      >
        <View style={styles.mestriText}>
          <AppText size={15} weight={700}>
            {copy.mestri}
          </AppText>
          <AppText size={12} color={color.muted}>
            {copy.mestriDetail}
          </AppText>
        </View>
        <Toggle on={request.withMestri} tone="mango" />
      </Tappable>
    </CrewLayout>
  );
}

const styles = StyleSheet.create({
  shrink: { flexShrink: 1 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  unsure: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.noteLarge,
  },
  unsureText: { flexGrow: 1, flexShrink: 1, gap: 2 },
  roles: { gap: 8 },
  card: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.borderSoft,
    borderRadius: radius.card,
    boxShadow: shadow.card,
  },
  stepperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingRight: 12,
    paddingLeft: 14,
  },
  roleText: { flexGrow: 1, flexShrink: 1, minWidth: 0, gap: 1 },
  mestri: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  mestriText: { flexShrink: 1, gap: 1 },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
  },
  daysPill: {
    flexShrink: 0,
    backgroundColor: color.mangoTint,
    borderRadius: radius.statusPill,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
