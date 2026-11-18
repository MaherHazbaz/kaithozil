import {
  AppText,
  Avatar,
  Card,
  Gradient,
  Icon,
  PrimaryButton,
  ScreenBackground,
  SegmentedControl,
  StatusPill,
  Tappable,
  color,
  radius,
  shadow,
  spacing,
  type Segment,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DetailRow } from '@/features/quote/components/Parts';

import { LockNote, SiteGrid } from '../components/Parts';
import { crewProfileCopy as copy } from '../copy';
import type { CrewProfile } from '../types';

type CrewTab = 'team' | 'sites' | 'reviews';

export type CrewProfileScreenProps = {
  crew: CrewProfile;
  /** Default "team". */
  initialTab?: CrewTab;
  onBack: () => void;
  /** "Book this crew": back to Book construction crew with this crew chosen. */
  onBook: () => void;
};

/**
 * Customer · Crew profile (design/source/CrewProfile.dc.html).
 *
 * Trust rule (DESIGN.md): no phone number or other contact detail anywhere
 * here; booking and payment happen only through the app, and chat with the
 * mestri opens once the crew is booked.
 */
export function CrewProfileScreen({
  crew,
  initialTab = 'team',
  onBack,
  onBook,
}: CrewProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<CrewTab>(initialTab);

  const tabs: readonly Segment<CrewTab>[] = [
    { key: 'team', label: copy.teamTab(crew.members.length) },
    { key: 'sites', label: copy.sitesTab(crew.siteCount) },
    { key: 'reviews', label: copy.reviewsTab },
  ];

  return (
    <ScreenBackground>
      {/* Light status bar text over the purple header. */}
      <StatusBar style="light" />
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <Gradient name="hero" style={[styles.hero, { paddingTop: 22 + insets.top }]}>
          <Tappable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={copy.back}
            style={styles.back}
            testID="crew-profile-back"
          >
            <Icon name="chevronLeft" size={20} color={color.white} />
          </Tappable>

          <View style={styles.identity}>
            <View style={styles.avatar}>
              <AppText size={23} weight={800} color={color.purpleDeep}>
                {crew.initials}
              </AppText>
            </View>
            <View style={styles.identityText}>
              <AppText size={22} weight={800} color={color.white} accessibilityRole="header">
                {crew.name}
              </AppText>
              <View style={styles.badge}>
                <Icon name="badgeCheck" size={13} color={color.gold} />
                <AppText size={12} weight={700} color={color.white} style={styles.shrink}>
                  {crew.badge}
                </AppText>
              </View>
              <AppText size={12} color={color.lavenderText}>
                {crew.specialities}
              </AppText>
            </View>
          </View>

          <View style={styles.stats}>
            <Stat
              value={copy.ratingValue(crew.rating)}
              label={copy.teamRating}
              valueColor={color.gold}
            />
            <Stat value={String(crew.members.length)} label={copy.members} />
            <Stat value={String(crew.siteCount)} label={copy.sitesDone} />
            <Stat value={copy.experienceValue(crew.experienceYears)} label={copy.experience} />
          </View>
        </Gradient>

        <View style={styles.body}>
          <SegmentedControl
            segments={tabs}
            selectedKey={tab}
            onSelect={setTab}
            accessibilityLabel={copy.sections}
            fontSize={13}
            raised
            testID="crew-profile-tab"
          />

          {tab === 'team' ? (
            <>
              <View style={styles.teamCard}>
                {crew.members.map((member) => (
                  <View
                    key={member.id}
                    style={styles.member}
                    accessible
                    accessibilityLabel={copy.memberLabel(member.name, member.role, member.level)}
                  >
                    <Avatar initials={member.initials} size={38} fontSize={12} tone="lavender" />
                    <View style={styles.memberText}>
                      <AppText size={14} weight={700}>
                        {member.name}
                      </AppText>
                      <AppText size={12} color={color.muted}>
                        {member.role}
                      </AppText>
                    </View>
                    <StatusPill label={member.level} tone={member.isNew ? 'mango' : 'purple'} />
                  </View>
                ))}
              </View>
              <AppText size={11} color={color.muted} align="center">
                {copy.teamNote(crew.mestriFirstName)}
              </AppText>
            </>
          ) : null}

          {tab === 'sites' ? (
            <>
              <SiteGrid sites={crew.sites} />
              <AppText size={11} color={color.muted} align="center">
                {copy.sitesNote}
              </AppText>
            </>
          ) : null}

          {tab === 'reviews' ? (
            <View style={styles.reviews}>
              {crew.reviews.map((review) => (
                <Card key={review.id} style={styles.review}>
                  <View style={styles.reviewHeader}>
                    <Avatar initials={review.initials} size={36} fontSize={11} tone="lavender" />
                    <View style={styles.memberText}>
                      <AppText size={14} weight={700}>
                        {review.name}
                      </AppText>
                      <AppText size={11} color={color.muted}>
                        {copy.reviewMeta(review.job, review.date)}
                      </AppText>
                    </View>
                    <AppText
                      size={13}
                      weight={800}
                      color={color.star}
                      accessibilityLabel={copy.starsLabel(review.stars)}
                    >
                      {copy.stars(review.stars)}
                    </AppText>
                  </View>
                  <AppText size={13} lineHeight={13 * 1.45}>
                    {review.text}
                  </AppText>
                </Card>
              ))}
            </View>
          ) : null}

          <Card style={styles.facts}>
            <DetailRow
              variant="quote"
              label={copy.dailyRate}
              value={copy.dailyRateValue}
              valueDetail={copy.dailyRateDetail}
            />
            <DetailRow variant="quote" label={copy.worksIn} value={crew.areas} />
            <DetailRow variant="quote" label={copy.attendance} value={copy.attendanceValue} />
          </Card>

          <LockNote>{copy.privacyNote}</LockNote>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 26 + insets.bottom }]}>
        <PrimaryButton
          label={copy.book}
          icon="users"
          iconSize={18}
          onPress={onBook}
          testID="crew-profile-book"
        />
      </View>
    </ScreenBackground>
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
const BACK = 44;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  shrink: { flexShrink: 1 },
  hero: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 20,
    // 30 in the design; radius.logoWelcome is the 30pt token (as on WorkerProfile).
    borderBottomLeftRadius: radius.logoWelcome,
    borderBottomRightRadius: radius.logoWelcome,
    overflow: 'hidden',
    gap: 14,
  },
  back: {
    width: BACK,
    height: BACK,
    borderRadius: BACK / 2,
    backgroundColor: color.onHeroFillSoft,
    borderWidth: 1,
    borderColor: color.onHeroBorderStrong,
    alignItems: 'center',
    justifyContent: 'center',
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
  stat: { flex: 1, minWidth: 0, alignItems: 'center' },
  body: {
    paddingVertical: 16,
    paddingHorizontal: spacing.screenPadding,
    gap: 12,
  },
  teamCard: {
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.borderSoft,
    borderRadius: radius.choiceCard,
    paddingVertical: 4,
    paddingHorizontal: 14,
    boxShadow: shadow.card,
  },
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  memberText: { flexGrow: 1, flexShrink: 1 },
  reviews: { gap: 10 },
  review: { padding: 14, gap: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  facts: { padding: 14, gap: 10 },
  footer: {
    paddingTop: 14,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.border,
    gap: 10,
  },
});
