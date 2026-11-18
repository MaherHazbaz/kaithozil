import { AppText, Gradient, Icon, Tappable, color, radius } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { publicProfileCopy as copy } from '../copy';
import type { PublicWorkerProfile } from '../types';

export type ProfileHeroProps = {
  worker: PublicWorkerProfile;
  saved: boolean;
  onToggleSave: () => void;
  onBack: () => void;
  /** Status bar height, added to the design's 22pt top padding. */
  topInset: number;
};

/** The purple header of WorkerProfile.dc.html: back, Save, identity and the stats panel. */
export function ProfileHero({ worker, saved, onToggleSave, onBack, topInset }: ProfileHeroProps) {
  return (
    <Gradient name="hero" style={[styles.hero, { paddingTop: 22 + topInset }]}>
      <View style={styles.topRow}>
        <Tappable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={copy.back}
          style={styles.back}
          testID="profile-back"
        >
          <Icon name="chevronLeft" size={20} color={color.white} />
        </Tappable>
        <Tappable
          onPress={onToggleSave}
          accessibilityRole="button"
          accessibilityLabel={copy.saveLabel(worker.firstName)}
          // The design marks it with aria-pressed; `selected` tells screen readers the same.
          accessibilityState={{ selected: saved }}
          style={styles.save}
          testID="profile-save"
        >
          <Icon name="bookmark" size={16} color={color.white} />
          <AppText size={13} weight={700} color={color.white}>
            {saved ? copy.saved : copy.save}
          </AppText>
        </Tappable>
      </View>

      <View style={styles.identity}>
        <View style={styles.avatar}>
          <AppText size={23} weight={800} color={color.purpleDeep}>
            {worker.initials}
          </AppText>
        </View>
        <View style={styles.identityText}>
          <AppText size={22} weight={800} color={color.white} accessibilityRole="header">
            {worker.name}
          </AppText>
          <View style={styles.badge}>
            <Icon name="badgeCheck" size={13} color={color.gold} />
            <AppText size={12} weight={700} color={color.white} style={styles.shrink}>
              {worker.badge}
            </AppText>
          </View>
          <AppText size={12} color={color.lavenderText}>
            {copy.serves(worker.areas)}
          </AppText>
        </View>
      </View>

      <View style={styles.stats}>
        <Stat
          value={copy.ratingValue(worker.rating)}
          label={copy.reviews(worker.reviewCount)}
          valueColor={color.gold}
        />
        <Stat value={String(worker.jobsDone)} label={copy.jobsDone} />
        <Stat value={copy.repeatValue(worker.repeatPercent)} label={copy.repeat} />
        <Stat value={copy.experienceValue(worker.experienceYears)} label={copy.experience} />
      </View>
    </Gradient>
  );
}

function Stat({
  value,
  label,
  valueColor = color.white,
}: {
  value: string;
  label: string;
  valueColor?: string;
}) {
  return (
    // Read as one item by screen readers: "280, Jobs done".
    <View style={styles.stat} accessible accessibilityLabel={`${value}, ${label}`}>
      <AppText size={17} weight={800} color={valueColor} numberOfLines={1}>
        {value}
      </AppText>
      <AppText size={10.5} color={color.lavenderText} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const AVATAR = 72;
const CONTROL = 44;

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    // 30 in the design; logoWelcome is the only 30pt radius token.
    borderBottomLeftRadius: radius.logoWelcome,
    borderBottomRightRadius: radius.logoWelcome,
    overflow: 'hidden',
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  back: {
    width: CONTROL,
    height: CONTROL,
    borderRadius: CONTROL / 2,
    backgroundColor: color.onHeroFillSoft,
    borderWidth: 1,
    borderColor: color.onHeroBorderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  save: {
    height: CONTROL,
    paddingHorizontal: 14,
    borderRadius: CONTROL / 2,
    backgroundColor: color.onHeroFillSoft,
    borderWidth: 1,
    borderColor: color.onHeroBorderStrong,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    flexShrink: 0,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: { flexShrink: 1, gap: 4 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: color.onHeroFillSoft,
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  shrink: { flexShrink: 1 },
  stats: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: color.onHeroPanel,
    borderWidth: 1,
    borderColor: color.onHeroPanelBorder,
    borderRadius: radius.noteLarge,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  // Four equal columns (the design's grid).
  stat: { flex: 1, minWidth: 0, alignItems: 'center' },
});
