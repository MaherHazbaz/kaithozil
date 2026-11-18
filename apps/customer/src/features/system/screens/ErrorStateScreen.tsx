import {
  StateIllustration,
  AppText,
  PrimaryButton,
  SecondaryButton,
  Tappable,
  color,
  radius,
} from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { StateLayout } from '../components/StateLayout';
import { StateMessage } from '../components/StateMessage';
import { errorStateCopy as copy } from '../copy';

export type ErrorStateScreenProps = {
  /** Shown to quote to support, e.g. "KT-ERR-4821". */
  reference: string;
  /**
   * Copies `reference` to the clipboard. The Copy button is shown only when
   * this is given: copying needs expo-clipboard, which is not installed yet.
   */
  onCopyReference?: () => Promise<void>;
  onRetry?: () => void;
  onHome?: () => void;
  onHelp?: () => void;
};

/** Shared · Something went wrong (design/source/ErrorState.dc.html). */
export function ErrorStateScreen({
  reference,
  onCopyReference,
  onRetry,
  onHome,
  onHelp,
}: ErrorStateScreenProps) {
  const [copied, setCopied] = useState(false);

  const copyReference = async () => {
    if (!onCopyReference) return;
    try {
      await onCopyReference();
      setCopied(true);
    } catch {
      // Leave the label as "Copy" so the customer can see it did not work.
    }
  };

  return (
    <StateLayout
      footer={
        <>
          <PrimaryButton label={copy.tryAgain} icon="rotateCcw" iconSize={18} onPress={onRetry} />
          <View style={styles.pair}>
            <View style={styles.half}>
              <SecondaryButton label={copy.goHome} icon="home" onPress={onHome} />
            </View>
            <View style={styles.half}>
              <SecondaryButton label={copy.getHelp} icon="helpCircle" onPress={onHelp} />
            </View>
          </View>
        </>
      }
    >
      <StateIllustration icon="alertCircle" tone="warning" />
      <StateMessage title={copy.title} titleTamil={copy.titleTamil}>
        {copy.body}
      </StateMessage>
      <View style={styles.reference}>
        <View style={styles.referenceText}>
          <AppText size={11} color={color.muted}>
            {copy.referenceLabel}
          </AppText>
          <AppText size={14} weight={800} letterSpacing={0.5} selectable>
            {reference}
          </AppText>
        </View>
        {onCopyReference ? (
          <Tappable
            onPress={copyReference}
            accessibilityRole="button"
            accessibilityLabel={copied ? copy.copied : copy.copyLabel}
            style={styles.copy}
          >
            <AppText size={13} weight={700} color={color.purple} numberOfLines={1}>
              {copied ? copy.copied : copy.copy}
            </AppText>
          </Tappable>
        ) : null}
      </View>
    </StateLayout>
  );
}

const styles = StyleSheet.create({
  pair: { flexDirection: 'row', gap: 8 },
  half: { flex: 1 },
  reference: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.note,
    paddingVertical: 8,
    paddingRight: 8,
    paddingLeft: 14,
    // Keeps the box 44 + 2 x 8 tall like the design when Copy is hidden.
    minHeight: 62,
    flexShrink: 0,
  },
  referenceText: { flexShrink: 1 },
  copy: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: radius.compactButton,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
    justifyContent: 'center',
    flexShrink: 0,
  },
});
