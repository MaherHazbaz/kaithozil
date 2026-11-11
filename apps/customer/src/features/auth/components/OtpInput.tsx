import { color, fontFamily, radius } from '@kaithozhil/ui';
import { useRef, type ComponentRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { loginCopy } from '../copy';

export const OTP_LENGTH = 6;

export type OtpInputProps = {
  /** Up to six digits. */
  value: string;
  onChange: (next: string) => void;
};

/**
 * Six single-digit boxes (46 x 56). A filled box has a 2 pt purple border, an
 * empty one a 1 pt grey border, as in design/source/Login.dc.html.
 *
 * The value is one string owned by the parent; each box shows one character.
 * Typing moves focus forward, and Backspace on an empty box moves it back.
 */
export function OtpInput({ value, onChange }: OtpInputProps) {
  // ComponentRef gives the type of the native input instance a ref points at.
  const inputs = useRef<(ComponentRef<typeof TextInput> | null)[]>([]);

  const handleChange = (index: number, text: string) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    const chars = value.padEnd(OTP_LENGTH, ' ').split('');
    chars[index] = digit || ' ';
    onChange(chars.join('').trimEnd());
    if (digit && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    const current = value[index];
    if ((current === undefined || current === ' ') && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row} accessibilityLabel={loginCopy.codeGroupLabel}>
      {Array.from({ length: OTP_LENGTH }, (_, index) => {
        const char = value[index];
        const digit = char !== undefined && char !== ' ' ? char : '';
        return (
          <TextInput
            key={index}
            ref={(node) => {
              inputs.current[index] = node;
            }}
            value={digit}
            onChangeText={(text) => handleChange(index, text)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') handleBackspace(index);
            }}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            // Lets the OS offer the code from the SMS (real OTP arrives in Sprint 2).
            autoComplete={index === 0 ? 'sms-otp' : 'off'}
            textContentType="oneTimeCode"
            accessibilityLabel={loginCopy.digitLabel(index + 1)}
            maxFontSizeMultiplier={1.3}
            style={[styles.box, digit ? styles.filled : styles.empty]}
            testID={`otp-${index}`}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: 46,
    height: 56,
    borderRadius: radius.input,
    backgroundColor: color.white,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: fontFamily.body,
    fontSize: 22,
    fontWeight: '800',
    color: color.ink,
    // Android adds default padding inside TextInput that would push the digit off-centre.
    padding: 0,
    includeFontPadding: false,
  },
  filled: {
    borderWidth: 2,
    borderColor: color.purple,
  },
  empty: {
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
});
