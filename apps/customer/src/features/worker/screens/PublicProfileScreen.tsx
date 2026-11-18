import {
  AppText,
  Icon,
  PrimaryButton,
  ScreenBackground,
  SegmentedControl,
  color,
  radius,
  spacing,
  type Segment,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AboutCard } from '../components/AboutCard';
import { PortfolioGrid } from '../components/PortfolioGrid';
import { ProfileHero } from '../components/ProfileHero';
import { ReviewCard } from '../components/ReviewCard';
import { publicProfileCopy as copy } from '../copy';
import type { PublicWorkerProfile } from '../types';

type ProfileTab = 'work' | 'reviews' | 'about';

export type PublicProfileScreenProps = {
  worker: PublicWorkerProfile;
  /** Whether the customer already saved this worker. Default false. */
  initialSaved?: boolean;
  /** Called with the new value after Save is tapped. */
  onToggleSave?: (saved: boolean) => void;
  onBack: () => void;
  onBook: () => void;
};

/**
 * Customer · Worker profile (design/source/WorkerProfile.dc.html).
 *
 * Trust rule (DESIGN.md): no phone number or other contact detail is shown
 * anywhere here; booking and payment happen only through the app.
 */
export function PublicProfileScreen({
  worker,
  initialSaved = false,
  onToggleSave,
  onBack,
  onBook,
}: PublicProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<ProfileTab>('work');
  const [saved, setSaved] = useState(initialSaved);

  const toggleSave = () => {
    const next = !saved;
    setSaved(next);
    onToggleSave?.(next);
  };

  const tabs: readonly Segment<ProfileTab>[] = [
    { key: 'work', label: copy.workTab(worker.work.length) },
    { key: 'reviews', label: copy.reviewsTab(worker.reviewCount) },
    { key: 'about', label: copy.aboutTab },
  ];

  return (
    <ScreenBackground>
      {/* Light status bar text over the purple header. */}
      <StatusBar style="light" />
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        <ProfileHero
          worker={worker}
          saved={saved}
          onToggleSave={toggleSave}
          onBack={onBack}
          topInset={insets.top}
        />
        <View style={styles.body}>
          <SegmentedControl
            segments={tabs}
            selectedKey={tab}
            onSelect={setTab}
            accessibilityLabel={copy.sections}
            raised
            testID="profile-tab"
          />

          {tab === 'work' ? (
            <>
              <PortfolioGrid items={worker.work} />
              <AppText size={11} color={color.muted} align="center">
                {copy.workNote}
              </AppText>
            </>
          ) : null}

          {tab === 'reviews' ? (
            <View style={styles.reviews}>
              {worker.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </View>
          ) : null}

          {tab === 'about' ? <AboutCard facts={worker.about} /> : null}

          <View style={styles.note}>
            <Icon name="lock" size={18} color={color.purple} />
            <AppText size={12} lineHeight={12 * 1.45} style={styles.noteText}>
              {copy.safetyNote}
            </AppText>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 26 + insets.bottom }]}>
        <PrimaryButton
          label={copy.book(worker.firstName)}
          icon="calendar"
          iconSize={18}
          onPress={onBook}
          testID="profile-book"
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: {
    paddingTop: 16,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 16,
    gap: 12,
  },
  reviews: { gap: 10 },
  // Not InfoNote: the design draws this lock at 18pt, InfoNote's icon is 16pt.
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: color.lavender,
    borderRadius: radius.note,
    padding: 12,
  },
  noteText: { flex: 1 },
  footer: {
    paddingTop: 14,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.border,
    gap: 10,
  },
});
