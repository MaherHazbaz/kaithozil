import {
  AppText,
  Card,
  Chip,
  HeroHeader,
  Icon,
  IconBox,
  Logo,
  ScreenBackground,
  color,
  spacing,
  type IconBoxTone,
  type IconName,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { welcomeCopy } from '../copy';

export type WelcomeScreenProps = {
  onNeedWorker: () => void;
  onAmWorker: () => void;
  onTerms?: () => void;
  onPrivacy?: () => void;
};

type RoleCardProps = {
  icon: IconName;
  tone: IconBoxTone;
  title: string;
  tamil: string;
  description: string;
  onPress: () => void;
  testID: string;
};

function RoleCard({ icon, tone, title, tamil, description, onPress, testID }: RoleCardProps) {
  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${title}. ${description}`}
      style={styles.roleCard}
      testID={testID}
    >
      <IconBox icon={icon} tone={tone} size={48} />
      <View style={styles.roleText}>
        <AppText size={17} weight={800}>
          {title}
        </AppText>
        <AppText size={12} color={color.muted}>
          {tamil}
        </AppText>
        <AppText size={13} color={color.muted}>
          {description}
        </AppText>
      </View>
      <Icon name="chevronRight" size={20} color={color.purple} />
    </Card>
  );
}

/** Welcome: language and role choice (design/source/Welcome.dc.html). */
export function WelcomeScreen({
  onNeedWorker,
  onAmWorker,
  onTerms,
  onPrivacy,
}: WelcomeScreenProps) {
  // Safe-area insets: the space taken by the status bar (top) and the system
  // navigation bar (bottom). The design's own padding is kept and the inset is
  // added to it, so content never sits under system UI.
  const insets = useSafeAreaInsets();
  // Selected-state only for now; switching the app language arrives with i18next.
  const [language, setLanguage] = useState(0);

  return (
    <ScreenBackground>
      <StatusBar style="light" />
      <HeroHeader
        gradient="welcomeHeader"
        bottomRadius="welcomeHeaderBottom"
        topInset={insets.top}
        paddingTop={56}
        paddingBottom={36}
        paddingHorizontal={24}
        skyline={false}
        centered
      >
        <Logo size={104} radius="logoWelcome" shadow="logoWelcome" />
        <View style={styles.headerGroup}>
          <AppText
            family="title"
            size={36}
            weight={800}
            letterSpacing={1.5}
            color={color.lavenderText}
            align="center"
            accessibilityRole="header"
          >
            {welcomeCopy.brand}
          </AppText>
          <AppText size={15} color={color.lavenderText} align="center">
            {welcomeCopy.brandTamil}
          </AppText>
        </View>
        <View style={styles.headerGroup}>
          <AppText size={18} weight={700} color={color.white} align="center">
            {welcomeCopy.tagline}
          </AppText>
          <AppText size={13} color={color.lavenderText} align="center">
            {welcomeCopy.taglineTamil}
          </AppText>
        </View>
      </HeroHeader>

      <ScrollView
        style={styles.scroll}
        // flexGrow lets the legal line sit at the bottom on tall screens while
        // the content still scrolls on short ones or with large text.
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.languageRow}>
          <AppText size={14} weight={700} color={color.muted}>
            {welcomeCopy.language}
          </AppText>
          <View style={styles.languageChips} accessibilityLabel={welcomeCopy.language}>
            {welcomeCopy.languages.map((label, index) => (
              <Chip
                key={label}
                label={label}
                selected={language === index}
                onPress={() => setLanguage(index)}
                testID={`language-${index}`}
              />
            ))}
          </View>
        </View>

        <RoleCard
          icon="search"
          tone="lavender"
          title={welcomeCopy.needWorker.title}
          tamil={welcomeCopy.needWorker.tamil}
          description={welcomeCopy.needWorker.description}
          onPress={onNeedWorker}
          testID="role-need-worker"
        />
        <RoleCard
          icon="wrench"
          tone="mango"
          title={welcomeCopy.amWorker.title}
          tamil={welcomeCopy.amWorker.tamil}
          description={welcomeCopy.amWorker.description}
          onPress={onAmWorker}
          testID="role-am-worker"
        />

        <View style={[styles.legal, { paddingBottom: 28 + insets.bottom }]}>
          <AppText size={12} color={color.muted} align="center">
            {welcomeCopy.legal.before}
            <AppText color={color.purple} underline accessibilityRole="link" onPress={onTerms}>
              {welcomeCopy.legal.terms}
            </AppText>
            {welcomeCopy.legal.between}
            <AppText color={color.purple} underline accessibilityRole="link" onPress={onPrivacy}>
              {welcomeCopy.legal.privacy}
            </AppText>
            {welcomeCopy.legal.after}
          </AppText>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  headerGroup: {
    alignItems: 'center',
    gap: 2,
  },
  scroll: {
    flex: 1,
  },
  body: {
    flexGrow: 1,
    paddingTop: 16,
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.gapL,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageChips: {
    flexDirection: 'row',
    gap: spacing.gapS,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gapL,
    padding: 16,
  },
  roleText: {
    flexGrow: 1,
    flexShrink: 1,
    gap: 2,
  },
  legal: {
    marginTop: 'auto',
  },
});
