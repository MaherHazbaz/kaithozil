import {
  AppText,
  Card,
  Icon,
  ScreenBackground,
  SecondaryButton,
  color,
  spacing,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchRipple } from '../components/SearchRipple';
import { SearchStep } from '../components/SearchStep';
import { jobServices, searchingCopy, type JobServiceKey } from '../copy';

export type SearchingScreenProps = {
  service: JobServiceKey;
  /** e.g. "Fan not working · Now". */
  jobSummary: string;
  /** Neighbourhood named in the explainer, e.g. "Anna Nagar". */
  area: string;
  /** The worker being called right now. */
  worker: { name: string; firstName: string; detail: string };
  onCancel: () => void;
  /** The design links the "Calling" row to Worker on the way. Unset until that screen exists. */
  onOpenWorker?: () => void;
};

/** Finding a worker (design/source/Searching.dc.html). */
export function SearchingScreen({
  service,
  jobSummary,
  area,
  worker,
  onCancel,
  onOpenWorker,
}: SearchingScreenProps) {
  const insets = useSafeAreaInsets();
  const title = jobServices[service].searchingTitle;

  return (
    <ScreenBackground>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.body, { paddingTop: 16 + insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          {/* Decorative: screen readers get the heading below instead. */}
          <View style={styles.rings} accessibilityElementsHidden importantForAccessibility="no">
            <View style={[styles.ring, styles.ringOuter]} />
            <View style={[styles.ring, styles.ringInner]} />
            {/* Drawn over the still rings and under the disc. */}
            <SearchRipple from={DISC} to={OUTER} />
            <View style={styles.searchDisc}>
              <Icon name="search" size={40} color={color.white} />
            </View>
          </View>
          <View style={styles.heading}>
            <AppText size={22} weight={800} align="center" accessibilityRole="header">
              {title}
            </AppText>
            <AppText size={13} color={color.muted} align="center">
              {searchingCopy.titleTamil}
            </AppText>
            <AppText size={14} color={color.muted} align="center" style={styles.explainer}>
              {searchingCopy.explainer(area)}
            </AppText>
          </View>
        </View>

        <Card style={styles.steps}>
          <SearchStep
            state="done"
            title={searchingCopy.posted}
            detail={jobSummary}
            testID="searching-posted"
          />
          <SearchStep
            state="current"
            title={searchingCopy.calling(worker.name)}
            detail={worker.detail}
            onPress={onOpenWorker}
            testID="searching-calling"
          />
          <SearchStep
            state="next"
            title={searchingCopy.next}
            detail={searchingCopy.nextDetail(worker.firstName)}
            testID="searching-next"
          />
        </Card>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 26 + insets.bottom }]}>
        <SecondaryButton
          label={searchingCopy.cancel}
          height={52}
          tone="ink"
          onPress={onCancel}
          testID="searching-cancel"
        />
      </View>
    </ScreenBackground>
  );
}

const OUTER = 220;
const INNER = 160;
const DISC = 96;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: {
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.gapL,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.gapXl,
    paddingTop: 50,
  },
  rings: {
    width: OUTER,
    height: OUTER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: { position: 'absolute' },
  ringOuter: {
    width: OUTER,
    height: OUTER,
    borderRadius: OUTER / 2,
    backgroundColor: color.lavender,
  },
  ringInner: {
    width: INNER,
    height: INNER,
    borderRadius: INNER / 2,
    // #DDD3F5 in the design; the token is named for its first use as text.
    backgroundColor: color.lavenderText,
  },
  searchDisc: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    backgroundColor: color.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    alignItems: 'center',
    gap: spacing.gapXs,
  },
  explainer: { maxWidth: 300 },
  steps: {
    padding: 14,
    gap: spacing.gapL,
  },
  footer: {
    paddingTop: 14,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.border,
  },
});
