import {
  AppText,
  Avatar,
  Card,
  Gradient,
  Icon,
  SecondaryButton,
  Tappable,
  TickItem,
  color,
  fontFamily,
  radius,
  shadow,
} from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { SectionHeading, ToggleRow } from '../components/SettingRows';
import { safetyCopy as copy } from '../copy';

export type EmergencyContact = {
  id: string;
  initials: string;
  /** Name and relationship, e.g. "Ravi R. · husband". */
  label: string;
  /** Partly hidden, e.g. "+91 98410 ••221". */
  phoneMasked: string;
};

export type SafetySettings = { shareLocation: boolean; preferWomen: boolean };

export type SafetyScreenProps = {
  contacts: readonly EmergencyContact[];
  initialSettings: SafetySettings;
  onBack: () => void;
  onCallSafetyLine?: () => void;
  onEditContact?: (id: string) => void;
  onAddContact?: (contact: { name: string; phone: string }) => void;
  /** Called on every toggle; the design has no Save button here. */
  onSettingsChange?: (settings: SafetySettings) => void;
};

/** Shared · Safety and emergency contacts (design/source/Safety.dc.html). */
export function SafetyScreen({
  contacts,
  initialSettings,
  onBack,
  onCallSafetyLine,
  onEditContact,
  onAddContact,
  onSettingsChange,
}: SafetyScreenProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const canSave = name.trim() !== '' && phone.trim() !== '';

  const toggle = (key: keyof SafetySettings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    onSettingsChange?.(next);
  };

  const saveContact = () => {
    onAddContact?.({ name: name.trim(), phone: phone.trim() });
    setName('');
    setPhone('');
    setAdding(false);
  };

  return (
    <PageLayout title={copy.title} titleTamil={copy.titleTamil} onBack={onBack}>
      {/* The shadow is on this wrapper; the gradient inside clips to the corners. */}
      <View style={styles.heroShadow}>
        <Gradient name="hero" style={styles.hero}>
          <AppText size={16} weight={800} color={color.white} accessibilityRole="header">
            {copy.unsafeTitle}
          </AppText>
          <AppText size={13} lineHeight={13 * 1.45} color={color.lavenderText}>
            {copy.unsafeBody}
          </AppText>
          <Tappable
            onPress={onCallSafetyLine}
            accessibilityRole="button"
            style={styles.callButton}
            testID="safety-call"
          >
            <Icon name="phone" size={18} color={color.ink} />
            <AppText size={15} weight={800} numberOfLines={1} style={styles.shrink}>
              {copy.callLine}
            </AppText>
          </Tappable>
        </Gradient>
      </View>

      <View style={styles.section}>
        <SectionHeading title={copy.contactsHeading} titleTamil={copy.contactsHeadingTamil} />
        <Card style={styles.contacts}>
          {contacts.map((contact) => (
            <View key={contact.id} style={styles.contact}>
              <Avatar initials={contact.initials} size={40} fontSize={13} tone="lavender" />
              <View style={styles.contactText}>
                <AppText size={14} weight={700}>
                  {contact.label}
                </AppText>
                <AppText size={12} color={color.muted}>
                  {contact.phoneMasked}
                </AppText>
              </View>
              <Tappable
                onPress={() => onEditContact?.(contact.id)}
                accessibilityRole="button"
                accessibilityLabel={copy.editLabel(contact.label)}
                style={styles.edit}
              >
                <AppText size={13} weight={700} color={color.purple}>
                  {copy.edit}
                </AppText>
              </Tappable>
            </View>
          ))}
          {adding ? (
            <View style={styles.form}>
              <AppText size={12} weight={700} color={color.muted}>
                {copy.name}
              </AppText>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={copy.namePlaceholder}
                placeholderTextColor={color.placeholder}
                accessibilityLabel={copy.name}
                autoComplete="name"
                maxFontSizeMultiplier={1.3}
                style={styles.input}
                testID="safety-contact-name"
              />
              <AppText size={12} weight={700} color={color.muted}>
                {copy.phone}
              </AppText>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder={copy.phonePlaceholder}
                placeholderTextColor={color.placeholder}
                accessibilityLabel={copy.phone}
                keyboardType="phone-pad"
                autoComplete="tel"
                maxFontSizeMultiplier={1.3}
                style={styles.input}
                testID="safety-contact-phone"
              />
              {/* Dimmed until both fields are filled, so an empty contact is never saved. */}
              <View style={canSave ? null : styles.dimmed}>
                <SecondaryButton
                  label={copy.saveContact}
                  onPress={saveContact}
                  disabled={!canSave}
                  testID="safety-save-contact"
                />
              </View>
            </View>
          ) : (
            <Tappable
              onPress={() => setAdding(true)}
              accessibilityRole="button"
              style={styles.add}
              testID="safety-add-contact"
            >
              <Icon name="plus" size={16} color={color.purple} />
              <AppText size={14} weight={700} color={color.purple}>
                {copy.addContact}
              </AppText>
            </Tappable>
          )}
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeading title={copy.duringJobs} titleTamil={copy.duringJobsTamil} />
        <ToggleRow
          title={copy.shareLocation.title}
          detail={copy.shareLocation.detail}
          on={settings.shareLocation}
          onToggle={() => toggle('shareLocation')}
          testID="safety-share-location"
        />
        <ToggleRow
          title={copy.preferWomen.title}
          detail={copy.preferWomen.detail}
          on={settings.preferWomen}
          onToggle={() => toggle('preferWomen')}
          testID="safety-prefer-women"
        />
      </View>

      <Card style={styles.tips}>
        <AppText size={14} weight={800}>
          {copy.goodToKnow}
        </AppText>
        {copy.tips.map((tip) => (
          <TickItem key={tip}>{tip}</TickItem>
        ))}
      </Card>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  heroShadow: { borderRadius: radius.tile, boxShadow: shadow.button },
  hero: { borderRadius: radius.tile, padding: 16, gap: 10, overflow: 'hidden' },
  callButton: {
    height: 52,
    borderRadius: radius.smallButton,
    backgroundColor: color.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  shrink: { flexShrink: 1 },
  section: { gap: 8 },
  // The source sets padding 14 / gap 10 and then overrides them: 4 14, gap 0.
  contacts: { paddingVertical: 4, paddingHorizontal: 14 },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  contactText: { flex: 1 },
  edit: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: radius.compactButton,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    justifyContent: 'center',
  },
  add: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  form: { gap: 8, paddingVertical: 10 },
  input: {
    height: 48,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: color.borderStrong,
    paddingHorizontal: 14,
    fontFamily: fontFamily.body,
    fontSize: 15,
    color: color.ink,
    includeFontPadding: false,
  },
  dimmed: { opacity: 0.5 },
  tips: { padding: 14, gap: 10 },
});
