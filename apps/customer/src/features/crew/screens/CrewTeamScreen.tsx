import {
  AppText,
  Avatar,
  Card,
  Icon,
  PrimaryButton,
  SecondaryButton,
  Tappable,
  color,
  radius,
} from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { CrewLayout } from '../components/CrewLayout';
import { HeroCard, LinkCard } from '../components/Parts';
import { crewTeamCopy as copy, roleCopy } from '../copy';
import type { ConfirmedCrew } from '../types';

export type CrewTeamScreenProps = {
  crew: ConfirmedCrew;
  onBack: () => void;
  /** Both "Call Selvam" buttons. */
  onCall?: () => void;
  /** "Attendance and daily payments". */
  onPayments?: () => void;
  /** "Change team size": back to Book construction crew. */
  onChangeSize?: () => void;
};

/** Customer · Crew confirmed (design/source/CrewTeam.dc.html). */
export function CrewTeamScreen({
  crew,
  onBack,
  onCall,
  onPayments,
  onChangeSize,
}: CrewTeamScreenProps) {
  // Counting, not money: the totals are what the crew booking is made of.
  const workers = crew.roles.reduce((sum, line) => sum + line.members.length, 0);
  const callLabel = copy.call(crew.mestriFirstName);

  return (
    <CrewLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      backLabel={copy.back}
      onBack={onBack}
      testID="crew-team"
      footer={
        <View style={styles.pair}>
          <View style={styles.flex}>
            <SecondaryButton
              label={copy.changeSize}
              height={52}
              onPress={onChangeSize}
              testID="crew-team-change"
            />
          </View>
          <View style={styles.flex}>
            <PrimaryButton label={callLabel} height={52} onPress={onCall} testID="crew-team-call" />
          </View>
        </View>
      }
    >
      <HeroCard corner="tile" style={styles.confirmed}>
        <Icon name="check" size={26} color={color.mango} strokeWidth={3} />
        <View style={styles.shrink}>
          <AppText size={16} weight={800} color={color.white} accessibilityRole="header">
            {copy.confirmed}
          </AppText>
          <AppText size={12} color={color.lavenderText}>
            {crew.startLine}
          </AppText>
        </View>
      </HeroCard>

      <Card style={styles.mestri}>
        <View style={styles.mestriRow}>
          <Avatar initials={crew.mestriInitials} size={48} fontSize={15} />
          <View style={styles.mestriText}>
            <AppText size={16} weight={800}>
              {crew.mestriName}
            </AppText>
            <AppText size={12} color={color.muted}>
              {crew.mestriMeta}
            </AppText>
          </View>
          <Tappable
            onPress={onCall}
            accessibilityRole="button"
            accessibilityLabel={callLabel}
            style={styles.callButton}
            testID="crew-team-call-icon"
          >
            <Icon name="phone" size={18} color={color.white} />
          </Tappable>
        </View>
      </Card>

      <View>
        {crew.roles.map((line) => {
          const names = roleCopy[line.role];
          return (
            <View
              key={line.role}
              style={styles.roleRow}
              accessible
              accessibilityLabel={`${copy.roleLine(names.en, line.members.length)}, ${line.members
                .map((member) => member.name)
                .join(', ')}`}
            >
              <View style={styles.roleText}>
                <AppText size={14} weight={800}>
                  {copy.roleLine(names.en, line.members.length)}
                </AppText>
                <AppText size={12} color={color.muted}>
                  {copy.roleNames(
                    names.tamil,
                    line.members.map((member) => member.name),
                  )}
                </AppText>
              </View>
              <View style={styles.faces}>
                {line.members.map((member) => (
                  <Avatar
                    key={member.id}
                    initials={member.initials}
                    size={32}
                    fontSize={11}
                    tone="lavender"
                  />
                ))}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.stats}>
        <Stat value={copy.daysValue(crew.days)} label={crew.workLabel} />
        <Stat value={String(workers)} label={copy.workers} />
        <Stat value={String(workers * crew.days)} label={copy.workerDays} />
      </View>

      <View style={styles.attendance}>
        <Icon name="camera" size={18} color={color.purple} />
        <AppText size={13} color={color.muted} style={styles.flex}>
          {copy.attendanceNote(crew.mestriFirstName)}
        </AppText>
      </View>

      <LinkCard
        icon="walletDaily"
        title={copy.payments}
        detail={copy.paymentsDetail}
        onPress={onPayments}
        testID="crew-team-payments"
      />
    </CrewLayout>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${value} ${label}`}>
      <AppText size={18} weight={800} numberOfLines={1}>
        {value}
      </AppText>
      <AppText size={11} color={color.muted} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const CALL = 44;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  shrink: { flexShrink: 1, gap: 2 },
  pair: { flexDirection: 'row', gap: 8 },
  confirmed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  mestri: { padding: 14, gap: 10 },
  mestriRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mestriText: { flexGrow: 1, flexShrink: 1, gap: 2 },
  callButton: {
    width: CALL,
    height: CALL,
    borderRadius: CALL / 2,
    flexShrink: 0,
    backgroundColor: color.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  roleText: { flexGrow: 1, flexShrink: 1 },
  faces: { flexDirection: 'row', gap: 4, flexShrink: 0 },
  stats: { flexDirection: 'row', gap: 8 },
  stat: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.statTile,
    padding: 10,
  },
  attendance: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
});
