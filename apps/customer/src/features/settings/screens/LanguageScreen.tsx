import { AppText, Card, PrimaryButton, Tappable, color, radius } from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, ToggleRow } from '../components/SettingRows';
import { languageCopy as copy } from '../copy';

export type AppLanguage = 'en' | 'ta';

export type LanguageSettings = {
  language: AppLanguage;
  showBoth: boolean;
  readAloud: boolean;
  largerText: boolean;
};

export type LanguageScreenProps = {
  /** The saved settings. The route passes the design's defaults until settings are stored. */
  initial: LanguageSettings;
  onBack: () => void;
  onSave?: (settings: LanguageSettings) => void;
};

/** Shared · Language (design/source/Language.dc.html). */
export function LanguageScreen({ initial, onBack, onSave }: LanguageScreenProps) {
  // Edited here and only applied on Save, so Back leaves the settings unchanged.
  const [settings, setSettings] = useState(initial);
  const toggle = (key: 'showBoth' | 'readAloud' | 'largerText') =>
    setSettings((current) => ({ ...current, [key]: !current[key] }));

  return (
    <PageLayout
      title={copy.title}
      titleTamil={copy.titleTamil}
      onBack={onBack}
      footer={<PrimaryButton label={copy.save} onPress={() => onSave?.(settings)} />}
    >
      <View style={styles.heading}>
        <AppText size={14} weight={800} accessibilityRole="header">
          {copy.appLanguage}
        </AppText>
        <AppText size={12} color={color.muted}>
          {copy.appLanguageHint}
        </AppText>
      </View>
      <View
        style={styles.choices}
        accessibilityRole="radiogroup"
        accessibilityLabel={copy.appLanguage}
      >
        {(['en', 'ta'] as const).map((language) => {
          const option = language === 'en' ? copy.english : copy.tamil;
          const selected = settings.language === language;
          return (
            <Tappable
              key={language}
              onPress={() => setSettings((current) => ({ ...current, language }))}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={option.name}
              accessibilityHint={option.detail}
              style={[styles.choice, selected ? styles.choiceOn : styles.choiceOff]}
              testID={`language-${language}`}
            >
              <View style={styles.mark}>
                <AppText size={18} weight={800} color={color.purple}>
                  {option.mark}
                </AppText>
              </View>
              <View style={styles.choiceText}>
                <AppText size={17} weight={800}>
                  {option.name}
                </AppText>
                <AppText size={12} color={color.muted}>
                  {option.detail}
                </AppText>
              </View>
              <View style={[styles.radio, selected ? styles.radioOn : styles.radioOff]} />
            </Tappable>
          );
        })}
      </View>

      <SectionHeading title={copy.readingHeading} />
      <Card>
        <View style={styles.group}>
          <ToggleRow
            icon="languages"
            title={copy.both.title}
            detail={copy.both.detail}
            on={settings.showBoth}
            onToggle={() => toggle('showBoth')}
            testID="language-both"
          />
          <ToggleRow
            icon="volume"
            title={copy.voice.title}
            detail={copy.voice.detail}
            on={settings.readAloud}
            onToggle={() => toggle('readAloud')}
            testID="language-voice"
          />
          <ToggleRow
            icon="type"
            title={copy.large.title}
            detail={copy.large.detail}
            on={settings.largerText}
            onToggle={() => toggle('largerText')}
            testID="language-large"
          />
        </View>
      </Card>
      <AppText size={12} color={color.muted} align="center">
        {copy.changeLater}
      </AppText>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 2 },
  choices: { gap: 10 },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.choiceCard,
  },
  // The 1pt border grows to 2pt when chosen; the padding is the same in the
  // design, so the content shifts by 1pt, exactly as it does there.
  choiceOn: { borderWidth: 2, borderColor: color.purple, backgroundColor: color.lavender },
  choiceOff: { borderWidth: 1, borderColor: color.borderStrong, backgroundColor: color.white },
  mark: {
    width: 48,
    height: 48,
    flexShrink: 0,
    borderRadius: radius.chipSquare,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceText: { flex: 1, gap: 2 },
  radio: {
    width: 22,
    height: 22,
    flexShrink: 0,
    borderRadius: 11,
    backgroundColor: color.white,
  },
  radioOn: { borderWidth: 7, borderColor: color.purple },
  radioOff: { borderWidth: 2, borderColor: color.borderStrong },
  // The rows pad themselves. This inner view clips their square corners to
  // the card's radius (minus its 1pt border); the shadow stays on the Card
  // outside, because a clipping view cannot draw a shadow beyond itself.
  group: { borderRadius: radius.card - 1, overflow: 'hidden' },
});
