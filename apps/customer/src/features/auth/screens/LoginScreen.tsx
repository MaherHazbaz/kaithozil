import { formatIndianMobile } from '@kaithozhil/core';
import {
  AppText,
  Icon,
  PrimaryButton,
  ScreenBackground,
  Tappable,
  color,
  fontFamily,
  radius,
  spacing,
  type as typeStyle,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OtpInput } from '../components/OtpInput';
import { loginCopy } from '../copy';

export type LoginScreenProps = {
  onBack: () => void;
  /** UI only for now: real OTP verification arrives in Sprint 2. */
  onVerify: () => void;
  onWorkerSignup?: () => void;
  /** Starting values. The route passes the design's sample state until real OTP exists. */
  initialMobile?: string;
  initialCode?: string;
  /** Countdown text, e.g. "0:24". Static until the resend timer is built with real OTP. */
  resendIn?: string;
};

/** Log in with mobile number and 6-digit code (design/source/Login.dc.html). */
export function LoginScreen({
  onBack,
  onVerify,
  onWorkerSignup,
  initialMobile = '',
  initialCode = '',
  resendIn = '0:24',
}: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [mobile, setMobile] = useState(() => formatIndianMobile(initialMobile));
  const [code, setCode] = useState(initialCode);

  return (
    <ScreenBackground>
      {/* Dark status bar icons over the light page. */}
      <StatusBar style="dark" />
      {/* Lifts the footer above the on-screen keyboard. */}
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <View style={[styles.header, { paddingTop: 22 + insets.top }]}>
          <Tappable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={loginCopy.back}
            style={styles.back}
            testID="login-back"
          >
            <Icon name="chevronLeft" size={20} color={color.ink} />
          </Tappable>
          <View style={styles.headerText}>
            <AppText
              size={typeStyle.screenTitleWithBack.size}
              weight={typeStyle.screenTitleWithBack.weight}
              accessibilityRole="header"
            >
              {loginCopy.title}
            </AppText>
            <AppText size={12} color={color.muted}>
              {loginCopy.titleTamil}
            </AppText>
          </View>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heading}>
            <AppText size={22} weight={800}>
              {loginCopy.heading}
            </AppText>
            <AppText size={13} color={color.muted}>
              {loginCopy.headingTamil}
            </AppText>
          </View>

          <View style={styles.field}>
            <AppText size={13} weight={700} color={color.muted}>
              {loginCopy.mobileLabel}
            </AppText>
            <View style={styles.mobileRow}>
              <View style={styles.countryCode}>
                <AppText weight={700}>{loginCopy.countryCode}</AppText>
              </View>
              <TextInput
                value={mobile}
                onChangeText={(text) => setMobile(formatIndianMobile(text))}
                keyboardType="phone-pad"
                autoComplete="tel-national"
                textContentType="telephoneNumber"
                accessibilityLabel={loginCopy.mobileLabel}
                maxFontSizeMultiplier={1.3}
                style={styles.mobileInput}
                testID="login-mobile"
              />
            </View>
            <AppText size={12} color={color.muted}>
              {loginCopy.mobileHelp}
            </AppText>
          </View>

          <View style={styles.divider} />

          <View style={styles.codeBlock}>
            <AppText size={15} weight={800}>
              {loginCopy.codeHeading}
            </AppText>
            <AppText size={13} color={color.muted}>
              {loginCopy.sentTo(mobile)}
              <AppText color={color.purple} underline accessibilityRole="link">
                {loginCopy.change}
              </AppText>
            </AppText>
            <OtpInput value={code} onChange={setCode} />
            <AppText size={13} color={color.muted}>
              {loginCopy.resendIn(resendIn)}
            </AppText>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: 26 + insets.bottom }]}>
          <PrimaryButton label={loginCopy.verify} onPress={onVerify} testID="login-verify" />
          <AppText
            size={14}
            weight={700}
            color={color.purple}
            align="center"
            underline
            accessibilityRole="link"
            onPress={onWorkerSignup}
            style={styles.workerLink}
            testID="login-worker-link"
          >
            {loginCopy.workerLink}
          </AppText>
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  headerText: {
    flexGrow: 1,
    flexShrink: 1,
  },
  body: {
    flexGrow: 1,
    paddingTop: 16,
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.gapL,
  },
  heading: {
    gap: spacing.gapXs,
    paddingTop: 6,
  },
  field: {
    gap: spacing.gapS,
  },
  mobileRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCode: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileInput: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    height: 52,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    paddingHorizontal: 14,
    paddingVertical: 0,
    fontFamily: fontFamily.body,
    fontSize: 17,
    fontWeight: '700',
    color: color.ink,
    includeFontPadding: false,
  },
  divider: {
    height: 1,
    backgroundColor: color.border,
  },
  codeBlock: {
    gap: 8,
  },
  footer: {
    paddingTop: 14,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: color.white,
    borderTopWidth: 1,
    borderTopColor: color.border,
    gap: spacing.gapM,
  },
  workerLink: {
    paddingVertical: 8,
  },
});
