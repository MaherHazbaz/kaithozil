import {
  AppText,
  Card,
  Chip,
  DangerButton,
  Icon,
  IconBox,
  SecondaryButton,
  Tappable,
  TickItem,
  color,
  fontFamily,
  radius,
} from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { deleteAccountCopy as copy } from '../copy';

export type LeaveReason = (typeof copy.reasons)[number]['key'];

export type DeleteAccountScreenProps = {
  /** Where the confirmation code was sent, partly hidden, e.g. "+91 98400 ••345". */
  maskedPhone: string;
  onBack: () => void;
  onLogOut?: () => void;
  /** Asks the server to send the 6-digit code. Called when the customer continues past step 1. */
  onRequestCode?: () => void;
  /**
   * Schedules the deletion. Resolves when the server accepted the code;
   * rejects (wrong or expired code) to stay on the code step.
   */
  onConfirm: (input: { code: string; reason: LeaveReason | null }) => Promise<void>;
  /** "Close" after the deletion is scheduled. */
  onClose?: () => void;
};

type Step = 'info' | 'confirm' | 'done';

const CODE_LENGTH = 6;

/** Shared · Log out or delete account (design/source/DeleteAccount.dc.html). */
export function DeleteAccountScreen({
  maskedPhone,
  onBack,
  onLogOut,
  onRequestCode,
  onConfirm,
  onClose,
}: DeleteAccountScreenProps) {
  const [step, setStep] = useState<Step>('info');
  const [understood, setUnderstood] = useState(false);
  const [reason, setReason] = useState<LeaveReason | null>(null);
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);

  const confirm = async () => {
    setSending(true);
    try {
      await onConfirm({ code, reason });
      setStep('done');
    } catch {
      // Stays on the code step so the customer can try again.
    } finally {
      setSending(false);
    }
  };

  return (
    <PageLayout title={copy.title} titleTamil={copy.titleTamil} onBack={onBack}>
      {step === 'info' ? (
        <>
          <Card style={styles.logOutCard}>
            <IconBox icon="logOut" tone="lavender" size={40} />
            <View style={styles.flex}>
              <AppText size={15} weight={800}>
                {copy.logOutTitle}
              </AppText>
              <AppText size={12} color={color.muted}>
                {copy.logOutDetail}
              </AppText>
            </View>
            <Tappable
              onPress={onLogOut}
              accessibilityRole="button"
              style={styles.logOut}
              testID="delete-log-out"
            >
              <AppText size={14} weight={700} color={color.purple}>
                {copy.logOut}
              </AppText>
            </Tappable>
          </Card>

          <AppText size={15} weight={800} accessibilityRole="header" style={styles.deleteHeading}>
            {copy.deleteHeading}
            <AppText size={12} weight={600} color={color.muted}>
              {copy.deleteHeadingTamil}
            </AppText>
          </AppText>

          <Card style={styles.card}>
            <AppText size={13} weight={800}>
              {copy.beforeTitle}
            </AppText>
            {copy.before.map((item) => (
              <TickItem key={item}>{item}</TickItem>
            ))}
            <AppText size={12} color={color.muted}>
              {copy.beforeNote}
            </AppText>
          </Card>

          <Card style={[styles.card, styles.whatCard]}>
            <AppText size={13} weight={800}>
              {copy.whatTitle}
            </AppText>
            {copy.what.map((line) => (
              <AppText key={line} size={13} lineHeight={13 * 1.45}>
                {line}
              </AppText>
            ))}
          </Card>

          <View style={styles.why}>
            <AppText size={13} weight={700} color={color.muted}>
              {copy.whyLabel}
            </AppText>
            <View style={styles.chips} accessibilityLabel={copy.whyGroupLabel}>
              {copy.reasons.map((option) => (
                <Chip
                  key={option.key}
                  label={option.label}
                  selected={reason === option.key}
                  onPress={() => setReason(option.key)}
                />
              ))}
            </View>
          </View>

          <Tappable
            onPress={() => setUnderstood((current) => !current)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: understood }}
            style={styles.understand}
            testID="delete-understand"
          >
            <View style={[styles.box, understood ? styles.boxOn : styles.boxOff]}>
              {understood ? (
                <Icon name="check" size={16} color={color.white} strokeWidth={3} />
              ) : null}
            </View>
            <AppText size={14} weight={700} style={styles.flex}>
              {copy.understand}
            </AppText>
          </Tappable>

          <DangerButton
            label={copy.delete}
            icon="trash"
            disabled={!understood}
            accessibilityHint={understood ? undefined : copy.understandFirst}
            onPress={() => {
              onRequestCode?.();
              setStep('confirm');
            }}
            testID="delete-continue"
          />
        </>
      ) : null}

      {step === 'confirm' ? (
        <>
          <View style={styles.confirmHeading}>
            <AppText size={18} weight={800} accessibilityRole="header">
              {copy.confirmTitle}
            </AppText>
            <AppText size={13} color={color.muted}>
              {copy.codeSent(maskedPhone)}
            </AppText>
          </View>
          <AppText size={13} weight={700} color={color.muted}>
            {copy.codeLabel}
          </AppText>
          <TextInput
            value={code}
            // Digits only, at most six, as the design's input does.
            onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH))}
            placeholder={copy.codePlaceholder}
            placeholderTextColor={color.placeholder}
            accessibilityLabel={copy.codeLabel}
            keyboardType="number-pad"
            // Lets Android offer the code from the SMS.
            autoComplete="sms-otp"
            textContentType="oneTimeCode"
            maxLength={CODE_LENGTH}
            maxFontSizeMultiplier={1.2}
            style={styles.code}
            testID="delete-code"
          />
          <DangerButton
            label={copy.delete}
            disabled={code.length !== CODE_LENGTH || sending}
            accessibilityHint={code.length === CODE_LENGTH ? undefined : copy.enterCode}
            onPress={confirm}
            testID="delete-confirm"
          />
          <Tappable
            onPress={() => setStep('info')}
            accessibilityRole="button"
            style={styles.goBack}
            testID="delete-go-back"
          >
            <AppText size={14} weight={700} color={color.purple}>
              {copy.goBack}
            </AppText>
          </Tappable>
        </>
      ) : null}

      {step === 'done' ? (
        <>
          <View style={styles.done}>
            <View style={styles.doneIcon}>
              <Icon name="trash" size={38} color={color.muted} />
            </View>
            <AppText size={20} weight={800} align="center" accessibilityRole="header">
              {copy.doneTitle}
            </AppText>
            <AppText size={13} color={color.muted} align="center">
              {copy.doneTitleTamil}
            </AppText>
            <AppText size={14} lineHeight={14 * 1.5} align="center" style={styles.doneBody}>
              {copy.doneBefore}
              <AppText weight={700}>{copy.doneDate}</AppText>
              {copy.doneAfter}
            </AppText>
          </View>
          <SecondaryButton label={copy.close} onPress={onClose} testID="delete-close" />
        </>
      ) : null}
    </PageLayout>
  );
}

const DONE_ICON = 88;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  logOutCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  logOut: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: radius.compactButton,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    justifyContent: 'center',
    flexShrink: 0,
  },
  deleteHeading: { paddingTop: 6 },
  card: { padding: 14, gap: 10 },
  // The source sets gap 10 and then overrides it with 6.
  whatCard: { gap: 6 },
  why: { gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  understand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.note,
  },
  box: {
    width: 28,
    height: 28,
    flexShrink: 0,
    borderRadius: radius.tickBox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: color.purple },
  boxOff: { borderWidth: 2, borderColor: color.borderStrong, backgroundColor: color.white },
  confirmHeading: { gap: 4 },
  code: {
    height: 56,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    paddingHorizontal: 16,
    fontFamily: fontFamily.body,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 6,
    color: color.ink,
    includeFontPadding: false,
  },
  goBack: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  done: { alignItems: 'center', gap: 10, paddingTop: 30, paddingBottom: 6 },
  doneIcon: {
    width: DONE_ICON,
    height: DONE_ICON,
    borderRadius: DONE_ICON / 2,
    backgroundColor: color.neutralTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBody: { maxWidth: 300 },
});
