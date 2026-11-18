import {
  AppText,
  Chip,
  Icon,
  PrimaryButton,
  ScreenBackground,
  StateIllustration,
  Tappable,
  color,
  fontFamily,
  radius,
  spacing,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StateMessage } from '@/features/system/components/StateMessage';
import { emptyStateCopy } from '@/features/system/copy';

import { WorkerResultCard } from '../components/WorkerResultCard';
import { searchCopy as copy } from '../copy';
import { matchWorkers, resultCount } from '../matchWorkers';
import { SEARCH_FILTERS, type SearchFilter, type WorkerResult } from '../types';

export type SearchScreenProps = {
  /** First page of results, in the server's "Best match" order. */
  workers: readonly WorkerResult[];
  /** How many workers the server found in total (the heading's number). */
  totalCount: number;
  areaName: string;
  initialQuery?: string;
  initialFilters?: readonly SearchFilter[];
  onBack: () => void;
  onOpenWorker?: (id: string) => void;
  /** "Post an urgent job" and, with no results, "Post a job". */
  onPostJob?: () => void;
};

const emptyCopy = emptyStateCopy.search;

/** Customer · Search workers (design/source/Search.dc.html). */
export function SearchScreen({
  workers,
  totalCount,
  areaName,
  initialQuery = '',
  initialFilters = [],
  onBack,
  onOpenWorker,
  onPostJob,
}: SearchScreenProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<readonly SearchFilter[]>(initialFilters);

  const matches = useMemo(
    () => matchWorkers(workers, { query, filters }),
    [workers, query, filters],
  );
  const count = resultCount({ total: totalCount, listed: workers.length, matched: matches.length });

  const toggleFilter = (filter: SearchFilter) =>
    setFilters((current) =>
      current.includes(filter) ? current.filter((f) => f !== filter) : [...current, filter],
    );

  const filterChips = (
    // A horizontal ScrollView is the React Native version of `overflow-x: auto`.
    // It stays inside the 20pt page padding, so the last chip is cut at that edge as drawn.
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filters}
      style={styles.noShrink}
      accessibilityLabel={copy.filtersLabel}
    >
      {SEARCH_FILTERS.map((filter) => (
        <Chip
          key={filter}
          label={copy.filters[filter]}
          selected={filters.includes(filter)}
          onPress={() => toggleFilter(filter)}
          testID={`search-filter-${filter}`}
        />
      ))}
    </ScrollView>
  );

  return (
    <ScreenBackground>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <View style={[styles.header, { paddingTop: 22 + insets.top }]}>
          <Tappable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={copy.back}
            style={styles.back}
            testID="search-back"
          >
            <Icon name="chevronLeft" size={20} color={color.ink} />
          </Tappable>
          <View style={styles.field}>
            <Icon name="search" size={18} color={color.purple} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              accessibilityLabel={copy.searchLabel}
              returnKeyType="search"
              autoCorrect={false}
              maxFontSizeMultiplier={1.3}
              style={styles.input}
              testID="search-input"
            />
          </View>
        </View>

        {/* FlatList only mounts the cards near the screen, so a long result list stays smooth.
            The filters and heading scroll with the list, as in the design. */}
        <FlatList
          data={matches}
          keyExtractor={(worker) => worker.id}
          renderItem={({ item }) => (
            <WorkerResultCard worker={item} onPress={() => onOpenWorker?.(item.id)} />
          )}
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              {filterChips}
              {matches.length > 0 ? (
                <View style={styles.headingRow}>
                  <AppText size={15} weight={800} accessibilityRole="header" style={styles.shrink}>
                    {copy.resultsHeading(count, areaName)}
                  </AppText>
                  <AppText size={12} color={color.muted}>
                    {copy.sortLabel}
                  </AppText>
                </View>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <StateIllustration icon="searchX" tone="neutral" />
              <StateMessage
                title={emptyCopy.title}
                titleTamil={emptyCopy.titleTamil}
                titleSize={22}
              >
                {emptyCopy.body}
              </StateMessage>
              <PrimaryButton label={emptyCopy.action} onPress={onPostJob} />
            </View>
          }
          ListFooterComponent={
            matches.length > 0 ? (
              <Tappable
                onPress={onPostJob}
                accessibilityRole="link"
                accessibilityLabel={copy.urgentLink}
                // Two 17pt lines are under the 44pt minimum; hitSlop extends the touch area.
                hitSlop={6}
                style={styles.urgent}
                testID="search-urgent"
              >
                <AppText size={12} color={color.muted} align="center" lineHeight={12 * 1.4}>
                  {copy.urgentBefore}
                  <AppText weight={700} color={color.purple}>
                    {copy.urgentLink}
                  </AppText>
                  {copy.urgentAfter}
                </AppText>
              </Tappable>
            ) : undefined
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const GAP = 12;

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  noShrink: { flexGrow: 0, flexShrink: 0 },
  shrink: { flexShrink: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.screenPadding,
  },
  back: {
    width: 44,
    height: 44,
    flexShrink: 0,
    borderRadius: 22,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: color.white,
    borderWidth: 2,
    borderColor: color.purple,
    borderRadius: radius.button,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontFamily: fontFamily.body,
    fontSize: 15,
    color: color.ink,
    includeFontPadding: false,
  },
  content: { paddingTop: 14, paddingHorizontal: spacing.screenPadding },
  listHeader: { gap: GAP, marginBottom: GAP },
  filters: { gap: 6, paddingBottom: 2 },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // CSS `align-items: baseline`.
    alignItems: 'baseline',
  },
  separator: { height: GAP },
  urgent: { marginTop: GAP },
  empty: { gap: 22, paddingTop: 28 },
});
