import {
  AppText,
  Avatar,
  BottomNav,
  Card,
  GoldIconButton,
  Gradient,
  HeroHeader,
  Icon,
  IconBox,
  Logo,
  PrimaryButton,
  ScreenBackground,
  Tappable,
  color,
  radius,
  shadow,
  spacing,
  type as typeStyle,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CUSTOMER_TABS, type CustomerTab } from '@/features/navigation/customerTabs';

import { BenefitsCarousel } from '../components/BenefitsCarousel';
import { homeCopy, services, type ServiceKey } from '../copy';

export type HomeTab = CustomerTab;

export type HomeScreenProps = {
  /** Shown data. The route passes the design's sample values until Supabase exists (Sprint 2). */
  customerName: string;
  customerInitials: string;
  areaName: string;
  verifiedWorkerCount: number;
  bookAgain: { initials: string; name: string; trade: string; rating: string };
  onProfile?: () => void;
  /** The search field opens Search workers. */
  onSearch?: () => void;
  onService?: (service: ServiceKey) => void;
  onVoice?: () => void;
  onCrew?: () => void;
  onBookAgain?: () => void;
  onTab?: (tab: HomeTab) => void;
};

/** Customer home (design/source/Main.dc.html). */
export function HomeScreen({
  customerName,
  customerInitials,
  areaName,
  verifiedWorkerCount,
  bookAgain,
  onProfile,
  onSearch,
  onService,
  onVoice,
  onCrew,
  onBookAgain,
  onTab,
}: HomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScreenBackground name="homePage">
      <StatusBar style="light" />

      {/* Everything above the bottom navigation scrolls, including the hero. */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <HeroHeader topInset={insets.top}>
          <View style={styles.topRow}>
            <View style={styles.brand}>
              <Logo size={40} radius="logoSmall" shadow="logoSmall" />
              <AppText size={18} weight={800} color={color.gold} letterSpacing={-0.2}>
                {homeCopy.brand}
              </AppText>
            </View>
            <Avatar
              initials={customerInitials}
              size={40}
              tone="onHero"
              onPress={onProfile}
              accessibilityLabel={homeCopy.profileLabel}
              testID="home-profile"
            />
          </View>

          <View style={styles.greeting}>
            <AppText
              size={typeStyle.heroGreeting.size}
              weight={typeStyle.heroGreeting.weight}
              letterSpacing={typeStyle.heroGreeting.letterSpacing}
              color={color.white}
              accessibilityRole="header"
            >
              {homeCopy.greeting(customerName)}
            </AppText>
            <View style={styles.locationLine}>
              <AppText size={14} color={color.lavenderText}>
                {homeCopy.youAreIn}
              </AppText>
              <Icon name="mapPin" size={14} color={color.gold} />
              <AppText size={14} color={color.lavenderText}>
                <AppText weight={700} color={color.white} underline>
                  {areaName}
                </AppText>
                .
              </AppText>
            </View>
            <AppText size={14} color={color.lavenderText}>
              {homeCopy.thereAre}
              <AppText weight={800} color={color.gold} underline>
                {homeCopy.verifiedWorkers(verifiedWorkerCount)}
              </AppText>
              {homeCopy.aroundYou}
            </AppText>
          </View>

          <View style={styles.searchRow}>
            <Tappable
              onPress={onSearch}
              accessibilityRole="button"
              style={styles.searchField}
              testID="home-search"
            >
              <Icon name="search" size={20} color={color.purple} />
              <AppText size={15} color={color.muted} numberOfLines={1} style={styles.searchText}>
                {homeCopy.search}
              </AppText>
            </Tappable>
            <GoldIconButton
              icon="mic"
              onPress={onVoice}
              accessibilityLabel={homeCopy.voiceLabel}
              testID="home-voice"
            />
          </View>
        </HeroHeader>

        {/* Service tiles overlap the bottom 40 pt of the hero. */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tiles}
          contentContainerStyle={styles.tilesContent}
          accessibilityLabel={homeCopy.servicesLabel}
        >
          {services.map((service) => (
            <Tappable
              key={service.key}
              onPress={() => onService?.(service.key)}
              accessibilityRole="button"
              accessibilityLabel={service.label}
              style={styles.tile}
              testID={`service-${service.key}`}
            >
              <IconBox
                icon={service.icon}
                tone={service.tone}
                size={50}
                radius="tileIcon"
                iconSize={24}
              />
              <AppText size={13} weight={800}>
                {service.label}
              </AppText>
              <AppText size={10.5} color={color.muted} style={styles.tileTamil}>
                {service.tamil}
              </AppText>
            </Tappable>
          ))}
        </ScrollView>

        <View style={styles.sections}>
          <BenefitsCarousel />

          <Tappable
            onPress={onCrew}
            accessibilityRole="button"
            accessibilityLabel={homeCopy.crew.title}
            style={styles.crewShadow}
            testID="home-crew"
          >
            <Gradient name="crewCard" style={styles.crewCard}>
              <IconBox icon="brickWall" tone="gold" size={46} radius="crewIcon" iconSize={22} />
              <View style={styles.crewText}>
                <AppText size={16} weight={800} color={color.gold}>
                  {homeCopy.crew.title}
                </AppText>
                <AppText size={12} color={color.lavenderText}>
                  {homeCopy.crew.subtitle}
                </AppText>
              </View>
              <Icon name="chevronRight" size={20} color={color.gold} />
            </Gradient>
          </Tappable>

          <Card bordered={false} style={styles.bookAgain}>
            <Avatar initials={bookAgain.initials} />
            <View style={styles.bookAgainText}>
              <AppText size={12} weight={700} color={color.muted}>
                {homeCopy.bookAgain}
              </AppText>
              <View style={styles.workerName}>
                <AppText size={typeStyle.cardTitle.size} weight={typeStyle.cardTitle.weight}>
                  {bookAgain.name}
                </AppText>
                <Icon name="badgeCheck" size={15} color={color.purple} strokeWidth={2.2} />
              </View>
              <AppText size={12} color={color.muted}>
                {`${bookAgain.trade} · ★ ${bookAgain.rating}`}
              </AppText>
            </View>
            <PrimaryButton
              label={homeCopy.book}
              onPress={onBookAgain}
              height={44}
              radius="smallButton"
              fontSize={14}
              paddingHorizontal={18}
              testID="home-book-again"
            />
          </Card>
        </View>
      </ScrollView>

      <BottomNav
        items={CUSTOMER_TABS}
        activeKey="home"
        onSelect={(tab) => onTab?.(tab)}
        bottomInset={insets.bottom}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greeting: {
    gap: 3,
  },
  locationLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchField: {
    flexGrow: 1,
    flexShrink: 1,
    height: 52,
    backgroundColor: color.white,
    borderRadius: radius.searchField,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    boxShadow: shadow.searchField,
  },
  searchText: {
    flexShrink: 1,
  },
  tiles: {
    marginTop: -40,
    flexGrow: 0,
  },
  tilesContent: {
    paddingTop: 2,
    paddingHorizontal: spacing.screenPaddingHome,
    paddingBottom: 14,
    gap: spacing.gapM,
  },
  tile: {
    width: 96,
    height: 112,
    backgroundColor: color.white,
    borderRadius: radius.tile,
    boxShadow: shadow.tile,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tileTamil: {
    marginTop: -2,
  },
  sections: {
    paddingHorizontal: spacing.screenPaddingHome,
    gap: 12,
  },
  crewShadow: {
    borderRadius: radius.tile,
    boxShadow: shadow.button,
  },
  crewCard: {
    borderRadius: radius.tile,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  crewText: {
    flexGrow: 1,
    flexShrink: 1,
    gap: 1,
  },
  bookAgain: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bookAgainText: {
    flexGrow: 1,
    flexShrink: 1,
    gap: 2,
  },
  workerName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
